module ERC20.ERC20 exposing (..)

import Concept.Contract as ContractModule exposing (Basic(..), Contract, FunctionIO(..), Interface(..), InterfaceIO(..), Signature, initialize, subscriptions)
import Concept.Core exposing (Address, Global, Requirements, defaultValues, throw, zeroAddress)
import Concept.Mapping as Mapping exposing (Mapping(..))
import Dict exposing (Dict)


main : Program () (ContractModule.Model Model) ContractModule.Msg
main =
    initialize
        (Contract ( constructor, Signature (ITuple3 ( IString, IString, IInt )) INone )
            update
            signatures
            encodeMsg
        )



-- Contract types


type alias Model =
    { balances : Mapping Address Int
    , allowances : Mapping Address (Mapping Address Int)
    , totalSupply : Int
    , name : String
    , symbol : String
    , decimals : Int
    }


constructor : Global -> FunctionIO -> Model
constructor global params =
    let
        ( name, symbol, totalSupply ) =
            case params of
                Tuple3 ( RString n, RString s, RInt ts ) ->
                    ( n, s, ts )

                _ ->
                    throw "Invalid parameters"
    in
    { balances = Mapping.insert global.msg.sender totalSupply Mapping.empty
    , allowances = Mapping.empty
    , totalSupply = totalSupply
    , name = name
    , symbol = symbol
    , decimals = 2
    }


type Msg
    = BalanceOf Address
    | Transfer Address Int
    | GetAllowance Address Address
    | Approve Address Int
    | TransferFrom Address Address Int
    | GetName
    | GetSymbol
    | GetDecimals
    | GetTotalSupply


update : Msg -> Global -> Model -> ( Requirements, Model, FunctionIO )
update msg global model =
    case msg of
        BalanceOf address ->
            let
                balance =
                    let
                        owner =
                            Mapping.get address model.balances
                    in
                    case owner of
                        Just o ->
                            o

                        Nothing ->
                            defaultValues 0
            in
            ( []
            , model
            , Single (RInt balance)
            )

        Transfer address amount ->
            let
                senderBalance =
                    let
                        owner =
                            Mapping.get global.msg.sender model.balances
                    in
                    case owner of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0

                updatedBalance =
                    Mapping.insert global.msg.sender (senderBalance - amount) model.balances

                recipientBalance =
                    let
                        owner =
                            Mapping.get address updatedBalance
                    in
                    case owner of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0
            in
            ( [ ( global.msg.sender /= zeroAddress, "ERC20: transfer from the zero address" )
              , ( address /= zeroAddress, "ERC20: transfer to the zero address" )
              , ( senderBalance >= amount, "ERC20: transfer amount exceeds balance" )
              ]
            , { model
                | balances =
                    Mapping.insert address
                        (recipientBalance + amount)
                        updatedBalance
              }
            , Single (RBool True)
            )

        GetAllowance owner spender ->
            let
                allowancesMapping =
                    let
                        o =
                            Mapping.get owner model.allowances
                    in
                    case o of
                        Just mapping ->
                            mapping

                        Nothing ->
                            defaultValues Mapping.empty

                allowedBalance =
                    let
                        a =
                            Mapping.get spender allowancesMapping
                    in
                    case a of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0
            in
            ( [], model, Single (RInt allowedBalance) )

        Approve spender amount ->
            let
                allowancesMapping =
                    let
                        o =
                            Mapping.get global.msg.sender model.allowances
                    in
                    case o of
                        Just mapping ->
                            mapping

                        Nothing ->
                            defaultValues Mapping.empty

                allowances =
                    Mapping.insert global.msg.sender
                        (Mapping.insert spender amount allowancesMapping)
                        model.allowances
            in
            ( [ ( global.msg.sender /= zeroAddress, "ERC20: transfer from the zero address" )
              , ( spender /= zeroAddress, "ERC20: transfer to the zero address" )
              ]
            , { model | allowances = allowances }
            , Single (RBool True)
            )

        TransferFrom sender recipient amount ->
            let
                senderBalance =
                    let
                        owner =
                            Mapping.get sender model.balances
                    in
                    case owner of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0

                updatedBalance =
                    Mapping.insert sender (senderBalance - amount) model.balances

                recipientBalance =
                    let
                        owner =
                            Mapping.get recipient updatedBalance
                    in
                    case owner of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0

                allowancesMapping =
                    let
                        o =
                            Mapping.get sender model.allowances
                    in
                    case o of
                        Just mapping ->
                            mapping

                        Nothing ->
                            defaultValues Mapping.empty

                allowedBalance =
                    let
                        a =
                            Mapping.get global.msg.sender allowancesMapping
                    in
                    case a of
                        Just balance ->
                            balance

                        Nothing ->
                            defaultValues 0

                allowances =
                    Mapping.insert sender
                        (Mapping.insert global.msg.sender (allowedBalance - amount) allowancesMapping)
                        model.allowances
            in
            ( [ ( sender /= zeroAddress, "ERC20: transfer from the zero address" )
              , ( recipient /= zeroAddress, "ERC20: transfer to the zero address" )
              , ( senderBalance >= amount, "ERC20: transfer amount exceeds balance" )
              , ( allowedBalance >= amount, "ERC20: transfer amount exceeds allowance" )
              ]
            , { model
                | allowances = allowances
                , balances =
                    Mapping.insert recipient
                        (recipientBalance + amount)
                        updatedBalance
              }
            , Single (RBool True)
            )

        GetName ->
            ( [], model, Single (RString model.name) )

        GetSymbol ->
            ( [], model, Single (RString model.symbol) )

        GetDecimals ->
            ( [], model, Single (RInt model.decimals) )

        GetTotalSupply ->
            ( [], model, Single (RInt model.totalSupply) )


signatures : List ( String, Signature )
signatures =
    [ ( "balanceOf", Signature (ISingle IAddress) (ISingle IInt) )
    , ( "transfer", Signature (ITuple2 ( IAddress, IInt )) (ISingle IBool) )
    , ( "allowance", Signature (ITuple2 ( IAddress, IAddress )) (ISingle IBool) )
    , ( "approve", Signature (ITuple2 ( IAddress, IInt )) (ISingle IBool) )
    , ( "transferFrom", Signature (ITuple3 ( IAddress, IAddress, IInt )) (ISingle IBool) )
    , ( "name", Signature INone (ISingle IString) )
    , ( "symbol", Signature INone (ISingle IString) )
    , ( "decimals", Signature INone (ISingle IInt) )
    , ( "totalSupply", Signature INone (ISingle IInt) )
    ]


encodeMsg : ( String, FunctionIO ) -> Msg
encodeMsg toEncode =
    case toEncode of
        ( "balanceOf", Single (RAddress address) ) ->
            BalanceOf address

        ( "transfer", Tuple2 ( RAddress address, RInt amount ) ) ->
            Transfer address amount

        ( "allowance", Tuple2 ( RAddress owner, RAddress spender ) ) ->
            GetAllowance owner spender

        ( "approve", Tuple2 ( RAddress owner, RInt amount ) ) ->
            Approve owner amount

        ( "transferFrom", Tuple3 ( RAddress sender, RAddress recipient, RInt amount ) ) ->
            TransferFrom sender recipient amount

        ( "name", None ) ->
            GetName

        ( "symbol", None ) ->
            GetSymbol

        ( "decimals", None ) ->
            GetDecimals

        ( "totalSupply", None ) ->
            GetTotalSupply

        _ ->
            throw "Invalid Call"
