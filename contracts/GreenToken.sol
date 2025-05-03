// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("GreenToken", "GRN") Ownable(initialOwner) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
