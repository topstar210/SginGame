// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DogeSpinSlotMachine is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    IERC20 public spinToken;
    IERC20 public rewardToken;

    address public developerWallet;
    uint256 public spinCost = 10 ether;

    uint256 public basicWinReward = 10 ether;
    uint256 public doubleDogepotReward = 1000 ether;
    uint256 public tripleDogepotReward = 10000 ether;

    uint8 public dogepotSymbol = 6;

    uint256 public spinFee = 3; // in percentage
    uint256 public withdrawalFee = 3; // in percentage

    mapping(address => uint256) public spinTkBalances;
    mapping(address => uint256) public rewardTkBalances;

    event Deposited(address indexed user, uint256 amount);
    event Spun(address indexed user, uint8[] result, uint256 rewardAmount);
    event RewardUpdated(string rewardType, uint256 newAmount);
    event TokenWithdrawn(address indexed user, uint256 amount);

    constructor(address _spinToken, address _developerWallet, address _initialOwner) Ownable(_initialOwner) {
        spinToken = IERC20(_spinToken);
        rewardToken = IERC20(_spinToken);
        developerWallet = _developerWallet;
    }

    function depositToken(uint256 amount) external nonReentrant {
        uint256 fee = amount.mul(spinFee).div(100);
        uint256 depositAmount = amount.sub(fee);

        require(spinToken.transferFrom(msg.sender, address(this), depositAmount), "Transfer failed");
        require(spinToken.transfer(developerWallet, fee), "Fee transfer failed");

        spinTkBalances[msg.sender] = spinTkBalances[msg.sender].add(depositAmount);

        emit Deposited(msg.sender, depositAmount);
    }

    function spin() external nonReentrant {
        require(spinTkBalances[msg.sender] >= spinCost, "Insufficient balance to spin");

        uint8[] memory result = new uint8[](3);
        for(uint8 i = 0; i < 3; i++) {
            result[i] = uint8((uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, i))) % 6) + 1);
        }

        uint256 rewardAmount = calculateReward(result);
        if(rewardAmount > 0) {
            rewardTkBalances[msg.sender] = rewardTkBalances[msg.sender].add(rewardAmount);
        }

        spinTkBalances[msg.sender] = spinTkBalances[msg.sender].sub(spinCost);

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

    function withdrawToken(uint256 amount) external nonReentrant {
        uint256 fee = amount.mul(withdrawalFee).div(100);
        uint256 withdrawalAmount = amount.sub(fee);

        require(rewardTkBalances[msg.sender] >= withdrawalAmount, "Insufficient tokens to withdraw");
        rewardTkBalances[msg.sender] = rewardTkBalances[msg.sender].sub(amount);
        
        require(rewardToken.transfer(msg.sender, withdrawalAmount), "Transfer failed");
        require(rewardToken.transfer(developerWallet, fee), "Fee transfer failed");

        emit TokenWithdrawn(msg.sender, withdrawalAmount);
    }

    function ownerWithdrawToken(uint256 amount) external onlyOwner {
        require(rewardToken.balanceOf(address(this)) >= amount, "Insufficient tokens in contract");
        require(rewardToken.transfer(owner(), amount), "Transfer failed");
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

    function setFees(uint256 _spinFee, uint256 _withdrawalFee) external onlyOwner {
        spinFee = _spinFee;
        withdrawalFee = _withdrawalFee;
    }

    function setSpinCost(uint256 newSpinCost) external onlyOwner {
        spinCost = newSpinCost;
    }
}
