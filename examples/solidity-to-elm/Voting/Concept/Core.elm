port module Voting.Concept.Core exposing (..)


port sendMessage : String -> Cmd msg


type alias Requirements =
    List ( Bool, String )


type alias Address =
    String


type alias PayableAddress =
    String


zeroAddress : String
zeroAddress =
    "0x0000000000000000000000000000000000000000"


throw : String -> a
throw =
    Debug.todo


defaultValues : a -> a
defaultValues a =
    a


type alias Msg =
    { sender : PayableAddress
    , data : String
    , sig : String
    , value : Int
    }


type alias Block =
    { coinbase : Address
    , difficulty : Int
    , gasLimit : Int
    , number : Int
    , timestamp : Int
    }


type alias Tx =
    { gasPrice : Int
    , origin : Address
    }


type alias Global =
    { msg : Msg, block : Block }