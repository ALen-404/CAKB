import { bsc, bscTestnet } from 'wagmi/chains'

export const getSwapAddress = (chainId?: number): `0x${string}` => {
  if (chainId === bscTestnet.id) {
    return '0x1Be4881365c6B1e579A2C708C7630744608D40d3'
  }
  if (chainId === bsc.id) {
    return '0x'
  }

  return '0x'
}

export const swapABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'type_', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'userAddr', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'cakeAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'cakbAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'time', type: 'uint256' },
    ],
    name: 'ADDLP',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'type_', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'userAddr', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'cakeAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'cakbAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'time', type: 'uint256' },
    ],
    name: 'EXTRACTLP',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'type_', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'userAddr', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'cakeAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'cakbAmount_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'price_', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'time', type: 'uint256' },
    ],
    name: 'SWAP',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: '_LP',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_cakb',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_cake',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_increase_ratio',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_increase_unit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_price',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_total_exchange_amount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'cakeAmount_', type: 'uint256' },
      { internalType: 'uint256', name: 'cakbAmount_', type: 'uint256' },
    ],
    name: 'addLP',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenAddr_', type: 'address' },
      { internalType: 'address', name: 'userAddr_', type: 'address' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' },
    ],
    name: 'draw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'extractLP', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'getCakePrice',
    outputs: [{ internalType: 'uint256', name: 'tokenPrice', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSwapInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'cakePrice', type: 'uint256' },
          { internalType: 'uint256', name: 'cakbPrice', type: 'uint256' },
          { internalType: 'uint256', name: 'total_exchange_amount', type: 'uint256' },
          { internalType: 'uint256', name: 'cake_arket_value', type: 'uint256' },
          { internalType: 'uint256', name: 'cakb_arket_value', type: 'uint256' },
        ],
        internalType: 'struct CAKBSWAP.SwapInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'bool', name: 'status', type: 'bool' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bool', name: 'status', type: 'bool' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' },
    ],
    name: 'swapEstimate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'increase_ratio', type: 'uint256' }],
    name: 'updateIncreaseRatio',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'increase_unit', type: 'uint256' }],
    name: 'updateIncreaseUnit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
