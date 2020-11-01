# 1. Counter Concept

The [Counter](https://elm-lang.org/examples/buttons) is a pretty basic app to get started with Elm.

The files `CounterConcept.elm` and `CounterConcept.sol` provide high level ideas of how the Elm code might look like when compiled/transpiled to Solidity.

## Conceptual

The work `concept` is being used for examples that will not compile ever, because they depend on libraries specific to the _web_ scenario of Elm.

They are still worth showing up in the examples as they provide intuition both Elm and Solidity developers.

## Key Observations

As the writing of this, It's not clear how the architecture will look like for delm apps.

When It comes to observing the behaviour of both languages, state modifications of Delm will propably happen in an `update` function as Elm does.
The Solidity transpiled code might be made with multiple functions?
Where will global variables such as `msg` and `block` of Solidity going to come from in Delm?

### Elm update

```elm
update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1

    Reset ->
      0
```

### Solidity functions

```ts
function increment () public {
  model = Model(model.count + 1);
}

function decrement () public {
  model = Model(model.count - 1);
}

function reset () public {
  model = Model(0);
}
```
