
import React from 'react';
import { ChainType, Token } from './types';

export const TOKENS: Record<ChainType, Token> = {
  [ChainType.POLKADOT]: {
    ticker: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    prefix: 0,
    color: '#E6007A',
    chain: ChainType.POLKADOT
  },
  [ChainType.ACALA]: {
    ticker: 'ACA',
    name: 'Acala',
    decimals: 12,
    prefix: 10,
    color: '#645AFF',
    chain: ChainType.ACALA
  },
  [ChainType.ETHEREUM]: {
    ticker: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    prefix: -1, // Ethereum doesn't use SS58 prefixes
    color: '#627EEA',
    chain: ChainType.ETHEREUM
  }
};

export const CHAIN_IDS: Record<ChainType, number> = {
  [ChainType.POLKADOT]: 0, // Relay chains usually don't use EIP-155 style chainIds but we map for consistency
  [ChainType.ACALA]: 787,
  [ChainType.ETHEREUM]: 1 // Ethereum Mainnet
};

export const EXISTENTIAL_DEPOSITS: Record<ChainType, number> = {
  [ChainType.POLKADOT]: 1.0,
  [ChainType.ACALA]: 0.1,
  [ChainType.ETHEREUM]: 0 // Ethereum doesn't have an ED in the Substrate sense
};

export const INITIAL_SHARDS = [
  { id: 1, label: 'Vault', connected: true, type: 'X1' as const },
  { id: 2, label: 'Card A', connected: true, type: 'Card' as const },
  { id: 3, label: 'Card B', connected: false, type: 'Card' as const },
  { id: 4, label: 'Card C', connected: false, type: 'Card' as const },
  { id: 5, label: 'Card D', connected: false, type: 'Card' as const },
];

/** 
 * Refined RPC lists. 
 */
export const POLKADOT_RPCS = [
  'wss://rpc.polkadot.io',
  'wss://polkadot.api.onfinality.io/public-ws',
  'wss://polkadot-rpc.publicnode.com',
  'wss://polkadot-rpc.dwellir.com',
  'wss://dot-rpc.stakeworld.io'
];

export const ACALA_RPCS = [
  'wss://acala-rpc.aca-api.network',
  'wss://acala.public.curie.io',
  'wss://acala-polkadot.api.onfinality.io/public-ws',
  'wss://acala-rpc.dwellir.com',
  'wss://acala-rpc.publicnode.com'
];
