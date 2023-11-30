// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DogeSpinSlotMachine is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    IERC20 public wDOGE;
    IERC20 public DCToken;

    address public developerWallet;
    uint256 public spinCost = 10 ether;

    uint256 public basicWinReward = 10 ether;
    uint256 public doubleDogepotReward = 1000 ether;
    uint256 public tripleDogepotReward = 10000 ether;

    uint8 public dogepotSymbol = 7;

    uint256 public wdogeFee = 3; // in percentage
    uint256 public dcWithdrawalFee = 3; // in percentage

    mapping(address => uint256) public wDOGEBalances;
    mapping(address => uint256) public DCBalances;

    event Deposited(address indexed user, uint256 amount);
    event Spun(address indexed user, uint8[] result, uint256 rewardAmount);
    event RewardUpdated(string rewardType, uint256 newAmount);
    event DCTokenWithdrawn(address indexed user, uint256 amount);

    constructor(address _wDOGE, address _DCToken, address _developerWallet, address _initialOwner) Ownable(_initialOwner) {
        wDOGE = IERC20(_wDOGE);
        DCToken = IERC20(_DCToken);
        developerWallet = _developerWallet;
    }

    function depositWDOGE(uint256 amount) external nonReentrant {
        uint256 fee = amount.mul(wdogeFee).div(100);
        uint256 depositAmount = amount.sub(fee);

        require(wDOGE.transferFrom(msg.sender, address(this), depositAmount), "Transfer failed");
        require(wDOGE.transfer(developerWallet, fee), "Fee transfer failed");

        wDOGEBalances[msg.sender] = wDOGEBalances[msg.sender].add(depositAmount);

        emit Deposited(msg.sender, depositAmount);
    }

    function spin() external nonReentrant {
        require(wDOGEBalances[msg.sender] >= spinCost, "Insufficient wDOGE balance to spin");

        uint8[] memory result = new uint8[](3);
        for(uint8 i = 0; i < 3; i++) {
            result[i] = uint8((uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, i))) % 6) + 1);
        }

        uint256 rewardAmount = calculateReward(result);
        if(rewardAmount > 0) {
            DCBalances[msg.sender] = DCBalances[msg.sender].add(rewardAmount);
        }

        wDOGEBalances[msg.sender] = wDOGEBalances[msg.sender].sub(spinCost);

        emit Spun(msg.sender, result, rewardAmount);
    }

    function calculateReward(uint8[] memory result) internal view returns (uint256) {
        if(result[0] == dogepotSymbol && result[1] == dogepotSymbol && result[2] == dogepotSymbol) {
            return tripleDogepotReward;
        } else if(result[0] == dogepotSymbol && result[1] == dogepotSymbol || result[1] == dogepotSymbol && result[2] == dogepotSymbol) {
            return doubleDogepotReward;
        } else if(result[0] == result[1] && result[1] == result[2] && result[0] != dogepotSymbol) {
            return basicWinReward;
        }
        return 0; // No reward if no match
    }

    function withdrawDCToken(uint256 amount) external nonReentrant {
        uint256 fee = amount.mul(dcWithdrawalFee).div(100);
        uint256 withdrawalAmount = amount.sub(fee);

        require(DCBalances[msg.sender] >= withdrawalAmount, "Insufficient DC tokens to withdraw");
        DCBalances[msg.sender] = DCBalances[msg.sender].sub(amount);
        
        require(DCToken.transfer(msg.sender, withdrawalAmount), "Transfer failed");
        require(DCToken.transfer(developerWallet, fee), "Fee transfer failed");

        emit DCTokenWithdrawn(msg.sender, withdrawalAmount);
    }

    function ownerWithdrawDCToken(uint256 amount) external onlyOwner {
        require(DCToken.balanceOf(address(this)) >= amount, "Insufficient DC tokens in contract");
        require(DCToken.transfer(owner(), amount), "Transfer failed");
    }

    function setRewardAmount(string memory rewardType, uint256 newAmount) external onlyOwner {
        if(keccak256(abi.encodePacked(rewardType)) == keccak256(abi.encodePacked("basicWin"))) {
            basicWinReward = newAmount;
        } else if(keccak256(abi.encodePacked(rewardType)) == keccak256(abi.encodePacked("doubleDogepot"))) {
            doubleDogepotReward = newAmount;
        } else if(keccak256(abi.encodePacked(rewardType)) == keccak256(abi.encodePacked("tripleDogepot"))) {
            tripleDogepotReward = newAmount;
        } else {
            revert("Invalid reward type");
        }
        emit RewardUpdated(rewardType, newAmount);
    }

    function setFees(uint256 _wdogeFee, uint256 _dcWithdrawalFee) external onlyOwner {
        wdogeFee = _wdogeFee;
        dcWithdrawalFee = _dcWithdrawalFee;
    }

    function setSpinCost(uint256 newSpinCost) external onlyOwner {
        spinCost = newSpinCost;
    }
}
