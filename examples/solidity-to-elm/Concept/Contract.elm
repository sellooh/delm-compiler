port module Concept.Contract exposing (..)

import Array exposing (Array)
import Browser
import Bytes exposing (..)
import Bytes.Encode as BEnc
import Dict exposing (Dict)
import Hex
import Html exposing (Html, address, button, div, h1, h3, input, text)
import Html.Attributes exposing (placeholder, type_, value)
import Html.Events exposing (onClick, onInput)
import Keccak.Bytes exposing (ethereum_keccak_256)
import Random
import String exposing (fromFloat, fromInt, toInt)
import Task
import Time
import Concept.Core exposing (Address, Global, Requirements, throw)
import Concept.Mapping as Mapping exposing (Mapping(..), empty)


type Basic
    = RAddress Address
    | RString String
    | RInt Int


type FunctionIO
    = None
    | Single Basic
    | Tuple2 ( Basic, Basic )
    | Tuple3 ( Basic, Basic, Basic )


type Interface
    = IAddress
    | IString
    | IInt


type InterfaceIO
    = INone
    | ISingle Interface
    | ITuple2 ( Interface, Interface )
    | ITuple3 ( Interface, Interface, Interface )


type Position
    = P1
    | P2
    | P3


type alias Contract msg model =
    { constructor : ( Global -> FunctionIO -> model, Signature )
    , update : msg -> Global -> model -> ( Requirements, model, FunctionIO )
    , signatures : List ( String, Signature )
    , encodeMsg : ( String, FunctionIO ) -> msg
    }


type alias Model model =
    { deploys : Mapping String model
    , form : Mapping String ( Maybe Basic, Maybe Basic, Maybe Basic )
    , returns : Mapping String FunctionIO
    , addresses : Dict Address Float
    , sender : Maybe Address
    , value : Int
    , global : Global
    }


type alias Signature =
    { inputs : InterfaceIO
    , outputs : InterfaceIO
    }


type Msg
    = GenerateGlobal Msg Time.Posix
    | SetGlobal Msg Global
    | GenerateNewAddress
    | GetAddressSeed Int
    | SetDeployer Address
    | SetValue Int
    | DeployIntent Msg
    | Deploy FunctionIO
    | ContractCallIntent Msg
    | ContractCall String FunctionIO
    | SetForm String Position Basic


initialize : Contract msg model -> Program () (Model model) Msg
initialize contract =
    Browser.element
        { init = init contract
        , view = view contract
        , update = update contract
        , subscriptions = subscriptions
        }


init : Contract msg model -> () -> ( Model model, Cmd Msg )
init contract _ =
    ( { form = Mapping.empty
      , deploys = Mapping.empty
      , returns = Mapping.empty
      , addresses =
            Dict.empty
      , sender = Nothing
      , value = 0
      , global =
            { msg = { sender = "", data = "", sig = "", value = 0 }
            , block = { coinbase = "", difficulty = 0, gasLimit = 0, number = 0, timestamp = 0 }
            }

      -- { contract
      --     | deploys = Mapping.insert "default" (contract.constructor global [ "test" ]) contract.deploys
      -- }
      }
    , Cmd.batch
        (List.append
            (List.repeat 5 (Random.generate GetAddressSeed anyInt))
            []
        )
    )


generateGlobal : Model model -> Time.Posix -> Random.Generator Global
generateGlobal model timestamp =
    let
        msg =
            { sender = Maybe.withDefault "" model.sender
            , data = ""
            , sig = ""
            , value = model.value
            }
    in
    Random.map2
        (\difficulty number ->
            { msg = msg
            , block =
                { coinbase = "0x" ++ hexify (ethereum_keccak_256 (BEnc.encode (BEnc.unsignedInt32 LE number)))
                , difficulty = difficulty
                , gasLimit = 0
                , number = number
                , timestamp = Time.toMillis Time.utc timestamp
                }
            }
        )
        (Random.int 0 100)
        (Random.int 0 Random.maxInt)


update : Contract msg model -> Msg -> Model model -> ( Model model, Cmd Msg )
update contract msg model =
    case msg of
        GenerateGlobal msgIntent timestamp ->
            ( model
            , Cmd.batch
                [ Random.generate (\g -> SetGlobal msgIntent g) (generateGlobal model timestamp)
                ]
            )

        SetGlobal msgIntent g ->
            ( { model | global = g }
            , Cmd.batch
                [ Task.succeed msgIntent
                    |> Task.perform identity
                ]
            )

        GenerateNewAddress ->
            ( model, Cmd.batch [ Random.generate GetAddressSeed anyInt ] )

        GetAddressSeed seed ->
            let
                -- Reference: https://medium.com/@jeancvllr/solidity-tutorial-all-about-addresses-ffcdf7efc4e7
                address =
                    String.right 40 (hexify (ethereum_keccak_256 (BEnc.encode (BEnc.unsignedInt32 LE seed))))

                addresses =
                    Dict.insert ("0x" ++ address) 100.0 model.addresses

                sender =
                    case model.sender of
                        Nothing ->
                            Just ("0x" ++ address)

                        Just a ->
                            Just a
            in
            ( { model | sender = sender, addresses = addresses }, Cmd.none )

        SetDeployer address ->
            ( { model | sender = Just address }, Cmd.none )

        SetValue v ->
            ( { model | value = v }, Cmd.none )

        DeployIntent msgIntent ->
            ( model
            , Cmd.batch
                [ Task.perform (GenerateGlobal msgIntent) Time.now
                ]
            )

        Deploy params ->
            let
                ( constructor, _ ) =
                    contract.constructor

                deploys =
                    Mapping.insert "default" (constructor model.global params) model.deploys

                deployerAddress =
                    Maybe.withDefault "" model.sender

                deployerEth =
                    Maybe.withDefault 0 (Dict.get deployerAddress model.addresses)

                _ =
                    if deployerEth - 0.1 < 0 then
                        throw "Not enough funds"

                    else
                        0

                addresses =
                    Dict.insert deployerAddress (deployerEth - 0.1) model.addresses
            in
            ( { model | deploys = deploys, addresses = addresses }, Cmd.none )

        ContractCallIntent msgIntent ->
            ( model
            , Cmd.batch
                [ Task.perform (GenerateGlobal msgIntent) Time.now
                ]
            )

        ContractCall name params ->
            let
                deploy =
                    case Mapping.get "default" model.deploys of
                        Just m ->
                            m

                        Nothing ->
                            throw "Contract not deployed."

                ( requirements, updatedModel, returns ) =
                    contract.update (contract.encodeMsg ( name, params )) model.global deploy

                errors =
                    List.filterMap
                        (\( ok, error ) ->
                            if ok then
                                Nothing

                            else
                                Just error
                        )
                        requirements

                _ =
                    if List.length errors == 0 then
                        Nothing

                    else
                        Just (Debug.log "failed" (String.join " " errors))

                deploys =
                    if List.length errors == 0 then
                        Mapping.insert "default" updatedModel model.deploys

                    else
                        model.deploys

                newReturns =
                    if List.length errors == 0 then
                        Mapping.insert name
                            returns
                            model.returns

                    else
                        model.returns
            in
            ( { model | deploys = deploys, returns = newReturns }, Cmd.none )

        SetForm name position param ->
            -- throw "not implemented yet."
            let
                ( value1, value2, value3 ) =
                    Maybe.withDefault ( Nothing, Nothing, Nothing ) (Mapping.get name model.form)

                fields =
                    case position of
                        P1 ->
                            ( Just param, value2, value3 )

                        P2 ->
                            ( value1, Just param, value3 )

                        P3 ->
                            ( value1, value2, Just param )

                updatedForm =
                    Mapping.insert name fields model.form
            in
            ( { model | form = updatedForm }, Cmd.none )


view : Contract msg model -> Model model -> Html Msg
view contract model =
    let
        signatures =
            contract.signatures

        ( _, constructorSignature ) =
            contract.constructor
    in
    div []
        [ h1 []
            [ text "running..." ]
        , div [] (viewAddresses model)
        , div [] [ button [ onClick GenerateNewAddress ] [ text "new" ] ]
        , div []
            ([ h3 [] [ text "Constructor" ]
             , constructorForm model
                ( "constructor", constructorSignature )
             ]
                ++ formParseSend model "constructor"
            )
        , div [] (List.map (form model) signatures)
        ]


viewAddresses : Model model -> List (Html Msg)
viewAddresses model =
    let
        sender =
            case model.sender of
                Just a ->
                    a

                Nothing ->
                    ""
    in
    List.map
        (\( k, v ) ->
            div []
                [ text
                    (k
                        ++ " | "
                        ++ fromFloat v
                        ++ "   "
                    )
                , if k /= sender then
                    button [ onClick (SetDeployer k) ] [ text "set as sender" ]

                  else
                    button [] [ text "[current sender]" ]
                ]
        )
        (Dict.toList model.addresses)


constructorForm : Model model -> ( String, Signature ) -> Html Msg
constructorForm model nameSignature =
    let
        fields =
            signatureToInput model nameSignature
    in
    div []
        [ input
            [ type_ "number"
            , placeholder "Value in wei"
            , value
                (if model.value > 0 then
                    String.fromInt model.value

                 else
                    ""
                )
            , onInput (\s -> SetValue (Maybe.withDefault 0 (toInt s)))
            ]
            []
        , fields
        ]


form : Model model -> ( String, Signature ) -> Html Msg
form model nameSignature =
    let
        ( name, _ ) =
            nameSignature

        fields =
            signatureToInput model nameSignature
    in
    case Mapping.get "default" model.deploys of
        Just _ ->
            div []
                [ text name
                , div [] ([ fields ] ++ formParseSend model name)
                ]

        Nothing ->
            text ""


signatureToInput : Model model -> ( String, Signature ) -> Html Msg
signatureToInput model nameSignature =
    let
        ( key, signature ) =
            nameSignature

        singleToInputCurried =
            singleToInput model
    in
    case signature.inputs of
        ISingle iBasic ->
            singleToInputCurried key P1 iBasic

        ITuple2 ( iBasic1, iBasic2 ) ->
            div []
                [ singleToInputCurried key P1 iBasic1
                , singleToInputCurried key P2 iBasic2
                ]

        ITuple3 ( iBasic1, iBasic2, iBasic3 ) ->
            div []
                [ singleToInputCurried key P1 iBasic1
                , singleToInputCurried key P2 iBasic2
                , singleToInputCurried key P3 iBasic3
                ]

        INone ->
            text ""


singleToInput : Model model -> String -> Position -> Interface -> Html Msg
singleToInput model key position interface =
    let
        ( v1, v2, v3 ) =
            Maybe.withDefault ( Nothing, Nothing, Nothing ) (Mapping.get key model.form)

        valueBasic =
            case position of
                P1 ->
                    v1

                P2 ->
                    v2

                P3 ->
                    v3
    in
    case interface of
        IAddress ->
            let
                val =
                    case valueBasic of
                        Just (RAddress v) ->
                            v

                        Nothing ->
                            ""

                        _ ->
                            throw "Strange value for field RAddress."
            in
            input [ type_ "text", placeholder "Address", value val, onInput (\s -> SetForm key position (RAddress s)) ] []

        IString ->
            let
                val =
                    case valueBasic of
                        Just (RString v) ->
                            v

                        Nothing ->
                            ""

                        _ ->
                            throw "Strange value for field RString."
            in
            input [ type_ "text", placeholder "Text", value val, onInput (\s -> SetForm key position (RString s)) ] []

        IInt ->
            let
                val =
                    case valueBasic of
                        Just (RInt v) ->
                            fromInt v

                        Nothing ->
                            ""

                        _ ->
                            throw "Strange value for field RInt."
            in
            input [ type_ "number", placeholder "Int", value val, onInput (\s -> SetForm key position (RInt (Maybe.withDefault 0 (toInt s)))) ] []


formParseSend : Model model -> String -> List (Html Msg)
formParseSend model key =
    let
        formData =
            Maybe.withDefault ( Nothing, Nothing, Nothing ) (Mapping.get key model.form)

        isConstructor =
            key == "constructor"

        params =
            case formData of
                ( Nothing, Nothing, Nothing ) ->
                    None

                ( Just basic, Nothing, Nothing ) ->
                    Single basic

                ( Just basic1, Just basic2, Nothing ) ->
                    Tuple2 ( basic1, basic2 )

                ( Just basic1, Just basic2, Just basic3 ) ->
                    Tuple3 ( basic1, basic2, basic3 )

                _ ->
                    throw "Malformed form data."

        parseReturn basic =
            case basic of
                RString s ->
                    s

                RAddress s ->
                    s

                RInt i ->
                    fromInt i

        returns =
            case Mapping.get key model.returns of
                Just None ->
                    ""

                Just (Single basic) ->
                    parseReturn basic

                Just (Tuple2 ( basic1, basic2 )) ->
                    parseReturn basic1 ++ "; " ++ parseReturn basic2

                Just (Tuple3 ( basic1, basic2, basic3 )) ->
                    parseReturn basic1 ++ "; " ++ parseReturn basic2 ++ "; " ++ parseReturn basic2

                Nothing ->
                    ""
    in
    [ button
        [ if isConstructor then
            onClick (DeployIntent (Deploy params))

          else
            onClick (ContractCallIntent (ContractCall key params))
        ]
        [ text
            (if isConstructor then
                "Deploy"

             else
                "Transact"
            )
        ]
    , if isConstructor then
        text ""

      else
        text returns
    ]


subscriptions : Model model -> Sub Msg
subscriptions model =
    Sub.none


port messageReceiver : (String -> msg) -> Sub msg


anyInt : Random.Generator Int
anyInt =
    Random.int Random.minInt Random.maxInt


hexify : List Int -> String
hexify l =
    String.concat (List.map (Hex.toString >> String.padLeft 2 '0') l)