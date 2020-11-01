// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Counter {
  struct Model {
    uint count;
  }

  Model public model;

  constructor () {
    model = Model(0);
  }

  function increment () public {
    model = Model(model.count + 1);
  }

  function decrement () public {
    model = Model(model.count - 1);
  }

  function reset () public {
    model = Model(0);
  }
}
