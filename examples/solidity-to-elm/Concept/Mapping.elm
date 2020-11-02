module Concept.Mapping exposing (..)

import Dict exposing (Dict)


type Mapping comparable value
    = Mapping (Dict comparable value)


singleton : comparable -> value -> Mapping comparable value
singleton comparable value =
    let
        internalDict =
            Dict.singleton comparable value
    in
    Mapping internalDict


empty : Mapping comparable value
empty =
    let
        dict =
            Dict.empty
    in
    Mapping dict


insert : comparable -> value -> Mapping comparable value -> Mapping comparable value
insert comparable value mapping =
    let
        dict =
            case mapping of
                Mapping d ->
                    d

        internalDict =
            Dict.insert comparable value dict
    in
    Mapping internalDict


remove : comparable -> Mapping comparable value -> Mapping comparable value
remove comparable mapping =
    let
        dict =
            case mapping of
                Mapping d ->
                    d

        internalDict =
            Dict.remove comparable dict
    in
    Mapping internalDict


get : comparable -> Mapping comparable value -> Maybe value
get comparable mapping =
    let
        dict =
            case mapping of
                Mapping d ->
                    d

        value =
            Dict.get comparable dict
    in
    value
