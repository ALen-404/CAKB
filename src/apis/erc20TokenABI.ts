export const erc20TokenABI = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'string',
        name: 'name_',
        internalType: 'string',
      },
      {
        type: 'string',
        name: 'symbol_',
        internalType: 'string',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientAllowance',
    inputs: [
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'allowance',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'needed',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InsufficientBalance',
    inputs: [
      {
        type: 'address',
        name: 'sender',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'balance',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'needed',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidApprover',
    inputs: [
      {
        type: 'address',
        name: 'approver',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidReceiver',
    inputs: [
      {
        type: 'address',
        name: 'receiver',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSender',
    inputs: [
      {
        type: 'address',
        name: 'sender',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC20InvalidSpender',
    inputs: [
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'allowance',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'approve',
    inputs: [
      {
        type: 'address',
        name: 'spender',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint8',
        name: '',
        internalType: 'uint8',
      },
    ],
    name: 'decimals',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    name: 'name',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    name: 'symbol',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'totalSupply',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'transfer',
    inputs: [
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'transferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
      },
    ],
  },
]
