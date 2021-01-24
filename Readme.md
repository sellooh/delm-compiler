# Delm Compiler

Delm-compiler is an **experimental** project trying to compile Elm to Solidity.

_Delm aka Decentralized Elm._

## Motivation

Both elm and solidity are amazing projects that are solving different problems.
* Elm enables developers to write safe code _for reliable webapps_;
* Solidity enables developers to write Smart Contracts _which governs the behaviour of accounts within the Ethereum state_.

Delm tries to leverage the best of both worlds.

`Type safe code in the blockchain`

* Elm-like architecture, to manage blockchain states;
* Elm type-inference to minimize (remove?) runtime errors;
* Leverage Elm and Solidity ecosystems, where possible;
* Solidity security and tooling;
* Elm debugging.

## Installation

WIP

## Usage

WIP

## Examples

WIP

## Roadmap

This isn't a set in stone roadmap, but as of right now a path the project could take:

* Phase 0 **(current)**: Develop the Delm Interpreter. This will allow developers to experience the creation of Smart Contracts in Delm. The Interpreter will feature a web playground similar to Remix where developers can test how a Delm Smart Contract behaves.

* Phase 1: Develop the Delm Compiler. This will enable developers to generate .sol files from their .elm source code. They should be deployable-ready to any Ethereum or Ethereum-like network. Preferably they are easily readable by humans.

* Beyond: Security. Ecosystem. Community. Bytecode generation. Having Phase 1 completed the project can take many directions. As of today **the goal is**: Provide a good experience to developers looking to write reliable, secure and predictable Smart Contracts to Ethereum-compatible networks.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
