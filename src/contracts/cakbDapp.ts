import { bsc, bscTestnet } from 'wagmi/chains'

export const getCakbDapp = (chainId?: number): `0x${string}` => {
  if (chainId === bscTestnet.id) {
    return '0xeccB2b475F4Df88EfEe30538B9BD596F4158833D'
  }
  if (chainId === bsc.id) {
    return '0x'
  }
  return '0x'
}

export const cakbDappAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'type_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderNo',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time_',
        type: 'uint256',
      },
    ],
    name: 'DrawReview',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'type_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cakeAmount_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'cakbAmount_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time_',
        type: 'uint256',
      },
    ],
    name: 'Pledge',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'type_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time_',
        type: 'uint256',
      },
    ],
    name: 'TopUp',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'type_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderNo',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAddr_',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'time_',
        type: 'uint256',
      },
    ],
    name: 'TopUpReview',
    type: 'event',
  },
  {
    inputs: [],
    name: '_cakb',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_cake',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_collect',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_info',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_initial',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_pledgeTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_re_cakb',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderNo',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenAddr_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'drawReview',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'pledge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'topUpCakb',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'topUpCake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'orderNo',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'userAddr_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenAddr_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'topUpReview',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ROUTER_',
        type: 'address',
      },
    ],
    name: 'updateROUTER',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 're_cakb',
        type: 'uint256',
      },
    ],
    name: 'updateReCakb',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
