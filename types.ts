
export enum ChainType {
  POLKADOT = 'POLKADOT',
  ACALA = 'ACALA',
  ETHEREUM = 'ETHEREUM'
}

export interface Token {
  ticker: string;
  name: string;
  decimals: number;
  prefix: number;
  color: string;
  chain: ChainType;
}

export interface NFT {
  id: string;
  collectionId: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  chain: ChainType;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  token: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  address: string;
  fee?: number;
  txHash?: string;
  chainId?: number; // EIP-155 Replay Protection Support
}

export interface ShardStatus {
  id: number;
  label: string;
  connected: boolean;
  type: 'X1' | 'Card';
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  chain: ChainType;
}

export interface ImportedAsset {
  id: string;
  ticker: string;
  chain: ChainType;
  balance: number;
  color: string;
}

export interface WalletState {
  dotBalance: number;
  acaBalance: number;
  ethBalance: number;
  dotStaked: number;
  acaStaked: number;
  ethStaked: number;
  dotRewards: number;
  acaRewards: number;
  ethRewards: number;
  dotAddress: string;
  acaAddress: string;
  ethAddress: string;
  transactions: Transaction[];
  contacts: Contact[];
  importedAssets: ImportedAsset[];
  nfts: NFT[];
}
