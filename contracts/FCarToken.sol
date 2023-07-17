// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FCarToken is ERC20, Ownable{
    uint256 decimalFactor;
    constructor() ERC20("F-RACEToken","FRT"){
        decimalFactor = 1;
        uint256 totalSupply = 1000000000 * decimalFactor; // Total supply of 1 trillion tokens
        _mint(address(this), totalSupply);
    }

    function buy(address _buyer) public payable {
        require(msg.value > 0, "Amount must be greater than zero");
        uint256 tokensToBuy = msg.value * decimalFactor;

        require(balanceOf(address(this)) >= tokensToBuy, "Insufficient token balance in contract");

        // Transfer tokens from contract to buyer
        _transfer(address(this), _buyer, tokensToBuy);
    }

    function sell(address _seller, uint256 _amount) external {
        uint256 etherToReceive = _amount / decimalFactor;

        require(balanceOf(_seller) >= _amount, "Insufficient token balance");
        require(address(this).balance >= etherToReceive, "Insufficient ether balance in contract");

        // Transfer tokens from seller to contract
        _transfer(_seller, address(this), _amount);

        // Transfer ethers from contract to seller
        (bool success, ) = _seller.call{value: etherToReceive}("");
        require(success, "Failed to send ethers");
    }

    function withdrawEther(address _seller, uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient ether balance in contract");

        (bool success, ) = _seller.call{value: _amount}("");
        require(success, "Failed to send ethers");
    }
}