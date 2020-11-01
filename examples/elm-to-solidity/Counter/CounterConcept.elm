module Counter.CounterConcept exposing (..)

-- Press buttons to increment and decrement a counter.
--
-- Attention!
-- This will never be compilable Elm to Solidity.
-- Dependencies like Browser and Html are Elm to JS only.
--
-- This is a conceptual example of what a well known Elm app will look like as Solidity code.
--


import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)



-- MAIN


main : Program () Model Msg
main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type alias Model = Int


init : Model
init =
  0



-- UPDATE


type Msg
  = Increment
  | Decrement
  | Reset


update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1

    Reset ->
      0



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model) ]
    , button [ onClick Increment ] [ text "+" ]
    , button [ onClick Reset ] [ text "reset" ]
    ]
