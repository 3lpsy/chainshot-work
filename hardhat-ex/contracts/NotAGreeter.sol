//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract NotAGreeter {
  uint256 public answer;
  uint256 public miss;

  constructor(uint256 _answer) {
    answer = _answer;
  }

  function ask(uint256 _guess) external returns (bool) {
    if (_guess != answer) {
      miss++;
      return true;
    }
    return false;
  }
}
