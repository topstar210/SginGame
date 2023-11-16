// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SPIN is ERC20Burnable, Ownable {
    using SafeMath for uint256;

    uint256 public buyTaxRate = 4;
    uint256 public sellTaxRate = 7;

    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isBot;
    uint256 public maxWalletSize = 50000 * 10**decimals();  // Example: No wallet (except owner) can hold more than 50,000 tokens.

    bool public noTaxMode = false;

    event TaxesCollected(uint256 amount);
    event BotDetected(address botAddress);
    event ExceededMaxWalletSize(address holder, uint256 amount);

    constructor() ERC20("DOGESPINDOG", "SPIN") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(!isBot[msg.sender], "Bots are not allowed to trade!");
        if (isExcludedFromTax[msg.sender] || noTaxMode) {
            return super.transfer(recipient, amount);
        }

        if (recipient != owner() && !isExcludedFromTax[recipient]) {
            require(amount.add(balanceOf(recipient)) <= maxWalletSize, "Exceeds maximum wallet size!");
        }

        uint256 taxAmount = getTaxAmount(msg.sender, recipient, amount);
        uint256 transferAmount = amount.sub(taxAmount);

        super.transfer(owner(), taxAmount); // Sending taxes to the owner
        emit TaxesCollected(taxAmount);

        return super.transfer(recipient, transferAmount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(!isBot[sender], "Bots are not allowed to trade!");
        if (isExcludedFromTax[sender] || noTaxMode) {
            return super.transferFrom(sender, recipient, amount);
        }

        if (recipient != owner() && !isExcludedFromTax[recipient]) {
            require(amount.add(balanceOf(recipient)) <= maxWalletSize, "Exceeds maximum wallet size!");
        }

        uint256 taxAmount = getTaxAmount(sender, recipient, amount);
        uint256 transferAmount = amount.sub(taxAmount);

        super.transferFrom(sender, owner(), taxAmount);  // Sending taxes to the owner
        emit TaxesCollected(taxAmount);

        return super.transferFrom(sender, recipient, transferAmount);
    }

    function getTaxAmount(address sender, address recipient, uint256 amount) public view returns (uint256) {
        if (noTaxMode) {
            return 0;
        }
        uint256 taxRate = (sender == owner() || recipient == owner()) ? buyTaxRate : sellTaxRate;
        return amount.mul(taxRate).div(100);
    }

    function excludeFromFee(address account) external onlyOwner {
        isExcludedFromTax[account] = true;
    }

    function includeToFee(address account) external onlyOwner {
        isExcludedFromTax[account] = false;
    }

    function setBot(address account, bool _isBot) external onlyOwner {
        isBot[account] = _isBot;
        if(_isBot) {
            emit BotDetected(account);
        }
    }

    function setNoTaxMode(bool _noTaxMode) external onlyOwner {
        noTaxMode = _noTaxMode;
    }

    function setMaxWalletSize(uint256 _maxWalletSize) external onlyOwner {
        maxWalletSize = _maxWalletSize;
    }
    function mint(address account, uint256 amount) external onlyOwner {
    _mint(account, amount);
}

}
