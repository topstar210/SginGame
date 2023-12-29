// Replace 'YOUR_CONTRACT_ADDRESS' with your actual contract address
const contractAddress = '0x59ca8D480B96f4B488DeeDD7cED43C6FF8b8db98';
const spinTokenAddress = '0x7B4328c127B85369D9f82ca0503B000D09CF9180';
// const rewardTokenAddress = '0x7B4328c127B85369D9f82ca0503B000D09CF9180';

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_wDOGE",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_DCToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_developerWallet",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_initialOwner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "DCTokenWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "depositWDOGE",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ownerWithdrawDCToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "rewardType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAmount",
        "type": "uint256"
      }
    ],
    "name": "RewardUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_wdogeFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_dcWithdrawalFee",
        "type": "uint256"
      }
    ],
    "name": "setFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "rewardType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "newAmount",
        "type": "uint256"
      }
    ],
    "name": "setRewardAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newSpinCost",
        "type": "uint256"
      }
    ],
    "name": "setSpinCost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "spin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8[]",
        "name": "result",
        "type": "uint8[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rewardAmount",
        "type": "uint256"
      }
    ],
    "name": "Spun",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawDCToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "basicWinReward",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "DCBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DCToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dcWithdrawalFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "developerWallet",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dogepotSymbol",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "doubleDogepotReward",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "spinCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tripleDogepotReward",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wDOGE",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "wDOGEBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wdogeFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; // Copy the ABI of your contract

const spinTokenABI = [{"type":"constructor","stateMutability":"payable","inputs":[{"type":"address","name":"_logic","internalType":"address"},{"type":"address","name":"admin_","internalType":"address"},{"type":"bytes","name":"_data","internalType":"bytes"}]},{"type":"event","name":"AdminChanged","inputs":[{"type":"address","name":"previousAdmin","internalType":"address","indexed":false},{"type":"address","name":"newAdmin","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"BeaconUpgraded","inputs":[{"type":"address","name":"beacon","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Upgraded","inputs":[{"type":"address","name":"implementation","internalType":"address","indexed":true}],"anonymous":false},{"type":"fallback","stateMutability":"payable"},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"address","name":"admin_","internalType":"address"}],"name":"admin","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeAdmin","inputs":[{"type":"address","name":"newAdmin","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"address","name":"implementation_","internalType":"address"}],"name":"implementation","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"upgradeTo","inputs":[{"type":"address","name":"newImplementation","internalType":"address"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"upgradeToAndCall","inputs":[{"type":"address","name":"newImplementation","internalType":"address"},{"type":"bytes","name":"data","internalType":"bytes"}]},{"type":"receive","stateMutability":"payable"}];
// const rewardTokenABI = [{"type":"constructor","stateMutability":"payable","inputs":[{"type":"address","name":"_logic","internalType":"address"},{"type":"address","name":"admin_","internalType":"address"},{"type":"bytes","name":"_data","internalType":"bytes"}]},{"type":"event","name":"AdminChanged","inputs":[{"type":"address","name":"previousAdmin","internalType":"address","indexed":false},{"type":"address","name":"newAdmin","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"BeaconUpgraded","inputs":[{"type":"address","name":"beacon","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Upgraded","inputs":[{"type":"address","name":"implementation","internalType":"address","indexed":true}],"anonymous":false},{"type":"fallback","stateMutability":"payable"},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"address","name":"admin_","internalType":"address"}],"name":"admin","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"changeAdmin","inputs":[{"type":"address","name":"newAdmin","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"address","name":"implementation_","internalType":"address"}],"name":"implementation","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"upgradeTo","inputs":[{"type":"address","name":"newImplementation","internalType":"address"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"upgradeToAndCall","inputs":[{"type":"address","name":"newImplementation","internalType":"address"},{"type":"bytes","name":"data","internalType":"bytes"}]},{"type":"receive","stateMutability":"payable"}];