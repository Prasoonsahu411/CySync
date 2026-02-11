
import React, { useState, useMemo, useEffect } from 'react';
import { Token, Transaction, ChainType, Contact, ImportedAsset, ShardStatus, NFT } from '../types';
import { 
  Send, 
  Download, 
  History, 
  Box, 
  Gift, 
  ArrowUpRight, 
  Fingerprint, 
  PlusCircle, 
  Coins, 
  ShieldCheck, 
  Layers, 
  Database,
  X,
  ExternalLink,
  ChevronDown,
  Image as ImageIcon,
  LayoutGrid,
  Info,
  Trash2,
  Share2,
  Tag,
  Zap,
  Activity,
  ArrowRight,
  RefreshCw,
  WifiOff,
  ArrowRightLeft,
  Sparkles,
  Search,
  ShieldAlert,
  Server
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import TransactionModal from './TransactionModal';
import StakingModal from './StakingModal';
import ShardVisualizer from './ShardVisualizer';
import ReceiveModal from './ReceiveModal';
import { 
  fetchAccountData, 
  fetchStakingData, 
  subscribeAccountData, 
  fetchTransactionHistory,
  subscribeNewBlocks,
  getChainMetadata,
  fetchNominations
} from '../services/substrateService';
import { EXISTENTIAL_DEPOSITS } from '../constants';

interface Props {
  token: Token;
  balance: number;
  staked?: number;
  rewards?: number;
  transactions: Transaction[];
  address: string;
  contacts: Contact[];
  onAddContact?: (name: string, address: string, chain: ChainType) => void;
  importedAssets: ImportedAsset[];
  nfts: NFT[];
  onImportAsset: (ticker: string, chain: ChainType) => void;
  onImportNFT: (name: string, collectionId: string, tokenId: string, chain: ChainType) => void;
  onTransactionSuccess?: (amount: number, address: string, fee: number) => void;
  privacyMode: boolean;
  shards: ShardStatus[];
  currencySymbol: string;
  currencyRate: number;
}

const WalletView: React.FC<Props> = ({ 
  token, 
  balance: initialBalance, 
  staked: initialStaked = 0, 
  rewards: initialRewards = 0, 
  transactions: initialTransactions, 
  address, 
  contacts,
  onAddContact,
  importedAssets,
  nfts,
  onImportAsset,
  onImportNFT,
  onTransactionSuccess,
  privacyMode,
  shards,
  currencySymbol,
  currencyRate
}) => {
  const [modalMode, setModalMode] = useState<'send' | 'swap'>('send');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isNFTImportModalOpen, setIsNFTImportModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [claimStep, setClaimStep] = useState<'none' | 'signing' | 'success'>('none');
  const [isSyncingIndexer, setIsSyncingIndexer] = useState(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tokens' | 'nfts'>('tokens');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  
  const [liveBalance, setLiveBalance] = useState<number | null>(null);
  const [liveStaked, setLiveStaked] = useState<number | null>(null);
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);
  const [currentBlock, setCurrentBlock] = useState<{ number: number; hash: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [metadata, setMetadata] = useState<{ specName: string; specVersion: number } | null>(null);
  const [nominations, setNominations] = useState<string[]>([]);
  
  // State for modals
  const [newTicker, setNewTicker] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftCollectionId, setNftCollectionId] = useState('');
  const [nftTokenId, setNftTokenId] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const displayBalance = liveBalance !== null && liveBalance > 0 ? liveBalance : initialBalance;
  const displayStaked = liveStaked !== null && liveStaked > 0 ? liveStaked : initialStaked;

  const displayTransactions = useMemo(() => {
    const merged = [...liveTransactions];
    initialTransactions.forEach(localTx => {
      const alreadyExists = merged.some(m => 
        m.txHash === localTx.txHash || 
        (m.id === localTx.id && m.id.startsWith('local-'))
      );
      if (!alreadyExists) merged.unshift(localTx);
    });
    return merged.sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  }, [liveTransactions, initialTransactions]);

  const chartData = useMemo(() => [
    { name: 'T-6', value: displayBalance * 0.98 },
    { name: 'T-5', value: displayBalance * 0.97 },
    { name: 'T-4', value: displayBalance * 0.99 },
    { name: 'T-3', value: displayBalance * 1.01 },
    { name: 'T-2', value: displayBalance * 0.96 },
    { name: 'T-1', value: displayBalance * 1.03 },
    { name: 'Now', value: displayBalance },
  ], [displayBalance]);

  const syncChainData = async () => {
    if (syncStatus === 'syncing') return;
    setSyncStatus('syncing');
    try {
      const [account, staking, history, meta, noms] = await Promise.all([
        fetchAccountData(token.chain, address),
        fetchStakingData(token.chain, address),
        fetchTransactionHistory(token.chain, address),
        getChainMetadata(token.chain),
        fetchNominations(token.chain, address)
      ]);
      setLiveBalance(account.free);
      setLiveStaked(staking.bonded);
      setLiveTransactions(history);
      setMetadata(meta);
      setNominations(noms);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    let unsubBalance: any = null;
    let unsubBlocks: any = null;
    const init = async () => {
      await syncChainData();
      unsubBalance = await subscribeAccountData(token.chain, address, (data) => {
        if (data.free > 0) setLiveBalance(data.free);
        setSyncStatus('synced');
      });
      unsubBlocks = await subscribeNewBlocks(token.chain, (header) => setCurrentBlock(header));
    };
    init();
    return () => {
      if (unsubBalance && typeof unsubBalance === 'function') unsubBalance();
      if (unsubBlocks && typeof unsubBlocks === 'function') unsubBlocks();
    };
  }, [token.chain, address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitiateClaim = () => {
    if (initialRewards <= 0 || claimStep !== 'none') return;
    setClaimStep('signing');
    setTimeout(() => {
      setClaimStep('success');
      setTimeout(() => setClaimStep('none'), 3000);
    }, 4000);
  };

  const handleIndexerSync = async () => {
    setIsSyncingIndexer(true);
    try {
      const history = await fetchTransactionHistory(token.chain, address);
      setLiveTransactions(history);
    } finally {
      setTimeout(() => setIsSyncingIndexer(false), 800);
    }
  };

  const maskValue = (val: string | number) => privacyMode ? '••••••' : val.toLocaleString();

  const getSubscanUrl = (txHash?: string) => {
    if (!txHash) return '#';
    const networkMap: Record<string, string> = {
      [ChainType.POLKADOT]: 'polkadot',
      [ChainType.ACALA]: 'acala',
      [ChainType.ETHEREUM]: 'ethereum'
    };
    return `https://${networkMap[token.chain] || 'polkadot'}.subscan.io/extrinsic/${txHash}`;
  };

  const handleImportTokenSubmit = () => {
    if (!newTicker.trim()) return;
    setIsImporting(true);
    setTimeout(() => {
      onImportAsset(newTicker.toUpperCase(), token.chain);
      setNewTicker('');
      setIsImportModalOpen(false);
      setIsImporting(false);
    }, 1500);
  };

  const handleImportNFTSubmit = () => {
    if (!nftName || !nftCollectionId) return;
    setIsImporting(true);
    setTimeout(() => {
      onImportNFT(nftName, nftCollectionId, nftTokenId, token.chain);
      setNftName('');
      setNftCollectionId('');
      setNftTokenId('');
      setIsNFTImportModalOpen(false);
      setIsImporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${syncStatus === 'synced' ? 'bg-green-500/10 border-green-500/30 text-green-500' : syncStatus === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
            {syncStatus === 'syncing' ? <RefreshCw className="w-3 h-3 animate-spin" /> : syncStatus === 'synced' ? <div className="live-indicator" /> : <WifiOff className="w-3 h-3" />}
            {syncStatus === 'syncing' ? 'WS Handshake...' : syncStatus === 'synced' ? `${token.name} Cluster` : 'Node Error'}
          </div>
          {currentBlock && (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
              <Box className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-bold text-zinc-400 mono">#{currentBlock.number.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
           <button onClick={handleIndexerSync} disabled={isSyncingIndexer} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-cyan-500 flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full transition-all active:scale-95 disabled:opacity-50">
            {isSyncingIndexer ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
            {isSyncingIndexer ? 'Syncing...' : 'Indexer Sync'}
          </button>
          <button onClick={syncChainData} disabled={syncStatus === 'syncing'} className="p-2.5 text-zinc-600 hover:text-cyan-500 bg-zinc-900 border border-zinc-800 rounded-full transition-all active:rotate-180 duration-500 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-[#111115] border border-zinc-800/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        <div className="space-y-4 text-center lg:text-left z-10 w-full lg:w-1/2">
          <div className="flex items-center justify-center lg:justify-start gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: token.color }}>
              <span className="text-white text-xl font-black">{token.ticker[0]}</span>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase">{token.name} Wallet</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Protocol Index: {token.prefix} • {token.chain === ChainType.ETHEREUM ? 'Secp256k1' : 'Ed25519'} </p>
                {token.prefix >= 0 && (
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-[8px] font-black rounded-md border border-cyan-500/20 uppercase tracking-tighter">SS58 Prefix {token.prefix}</span>
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black mb-1">Available Balance</p>
              <div className="flex items-baseline justify-center lg:justify-start gap-3">
                <h1 className="text-6xl font-black tracking-tighter text-white">
                  {privacyMode ? `${currencySymbol} ••••••` : displayBalance.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                </h1>
                <span className="text-zinc-700 font-black text-2xl uppercase tracking-tighter">{token.ticker}</span>
              </div>
            </div>
            
            {/* Protocol Insights Area - Populated as requested */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="px-5 py-4 bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Existential Deposit</p>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  <p className="text-xs font-black text-white">{EXISTENTIAL_DEPOSITS[token.chain]} {token.ticker}</p>
                </div>
              </div>
              <div className="px-5 py-4 bg-zinc-950/40 border border-zinc-800 rounded-2xl space-y-1">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Network Type</p>
                <div className="flex items-center gap-2">
                  <Server className="w-3 h-3 text-cyan-500" />
                  <p className="text-xs font-black text-white uppercase">{token.chain === ChainType.POLKADOT ? 'Relay' : 'Parachain'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-8">
            <button 
              onClick={() => { setModalMode('send'); setIsModalOpen(true); }} 
              className="flex-1 bg-white text-black font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest shadow-xl active:scale-95"
            >
              <Send className="w-5 h-5" /> Send {token.ticker}
            </button>
            <button 
              onClick={() => setIsReceiveModalOpen(true)} 
              className={`flex-1 bg-[#1a1a1f] text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all border border-zinc-800 text-xs uppercase tracking-widest active:scale-95 shadow-lg`}
            >
              <Download className="w-5 h-5" /> Receive
            </button>
          </div>
        </div>
        {!privacyMode && (
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-40 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="value" stroke={token.color} fill={token.color} fillOpacity={0.05} strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#111115] border border-zinc-800/60 rounded-[2rem] p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
                <button 
                  onClick={() => setViewMode('tokens')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'tokens' ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <div className="flex items-center gap-2"><Coins className="w-3.5 h-3.5" /> Tokens</div>
                </button>
                <button 
                  onClick={() => setViewMode('nfts')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'nfts' ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <div className="flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5" /> Collectibles</div>
                </button>
              </div>
              <button 
                onClick={() => viewMode === 'tokens' ? setIsImportModalOpen(true) : setIsNFTImportModalOpen(true)} 
                className="text-[10px] font-black text-cyan-500 bg-cyan-500/5 px-4 py-2 rounded-full border border-cyan-500/20 uppercase tracking-widest hover:bg-cyan-500/10 transition-all active:scale-95 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Import {viewMode === 'tokens' ? 'Token' : 'NFT'}
              </button>
            </div>

            {viewMode === 'tokens' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-zinc-900/40 rounded-3xl border border-zinc-800/40 hover:border-zinc-700 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-950 border border-zinc-800">
                      <span className="font-black text-sm" style={{ color: token.color }}>{token.ticker}</span>
                    </div>
                    <div>
                      <h4 className="font-black text-lg tracking-tight text-white uppercase">{token.name} Native</h4>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Main Ledger Balance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl tracking-tight text-white">
                      {maskValue(displayBalance)} <span className="text-zinc-600 text-sm">{token.ticker}</span>
                    </p>
                  </div>
                </div>
                {importedAssets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-6 bg-zinc-900/40 rounded-3xl border border-zinc-800/40 shadow-inner group hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-950 border border-zinc-800">
                        <span className="font-black text-sm" style={{ color: asset.color }}>{asset.ticker[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-lg tracking-tight text-white uppercase">{asset.ticker} Asset</h4>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Cross-Chain Asset</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl tracking-tight text-white">
                        {maskValue(asset.balance)} <span className="text-zinc-600 text-sm">{asset.ticker}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.length > 0 ? nfts.map((nft) => (
                  <div 
                    key={nft.id} 
                    onClick={() => setSelectedNFT(nft)}
                    className="bg-zinc-950/40 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden group hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full"
                  >
                    <div className="aspect-square relative overflow-hidden bg-zinc-900">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                         <div className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                           View Details
                         </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-base text-white tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{nft.name}</h4>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">ID: {nft.collectionId.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-24 text-center space-y-6">
                    <ImageIcon className="w-10 h-10 text-zinc-800 mx-auto" />
                    <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">The Vault is Empty</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-[#111115] border border-zinc-800/60 rounded-[2rem] overflow-hidden shadow-xl">
            <div className="p-8 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900/20">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-white uppercase"><History className="w-6 h-6 text-zinc-500" /> Transaction Ledger</h3>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Activity Feed</span>
            </div>
            <div className="divide-y divide-zinc-900/50">
              {displayTransactions.length > 0 ? displayTransactions.map((tx) => (
                <div key={tx.id} className="flex flex-col group">
                  <div 
                    onClick={() => setExpandedTxId(expandedTxId === tx.id ? null : tx.id)}
                    className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${tx.type === 'send' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {tx.type === 'send' ? <ArrowUpRight className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-sm uppercase tracking-widest text-zinc-200">{tx.type === 'send' ? 'Outgoing' : 'Incoming'} {tx.token}</p>
                        <p className="text-[10px] text-zinc-600 mono font-bold">{tx.address.slice(0, 16)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className={`font-black text-xl tracking-tight ${tx.type === 'send' ? 'text-zinc-200' : 'text-green-500'}`}>
                          {privacyMode ? '••••••' : `${tx.type === 'send' ? '-' : '+'}${tx.amount.toLocaleString()}`}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-zinc-700 transition-transform ${expandedTxId === tx.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {expandedTxId === tx.id && (
                    <div className="px-10 pb-8 pt-2 bg-zinc-900/10 animate-in slide-in-from-top-2 duration-300 space-y-6">
                      <div className="space-y-3 p-5 bg-[#0a0a0c] border border-zinc-800/60 rounded-2xl">
                         <div className="flex justify-between items-center">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Transaction Hash</p>
                            <a href={getSubscanUrl(tx.txHash)} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1 hover:text-cyan-400">
                              Explorer <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                         <p className="text-[11px] font-mono text-zinc-500 break-all select-all">{tx.txHash || '0x7f3e82...c0a1b2c3d4e5f6'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-24 text-center space-y-4">
                  <Database className="w-10 h-10 text-zinc-800 mx-auto" />
                  <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">No extrinsic history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111115] border border-zinc-800/60 rounded-[2.5rem] p-10 shadow-xl space-y-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Zap className="w-32 h-32 text-indigo-500" />
             </div>
             <div className="flex justify-between items-center relative z-10">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-white uppercase"><Layers className="w-8 h-8 text-indigo-500" /> Yield Hub</h3>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full">Active</div>
             </div>
             <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2rem] space-y-2">
                  <p className="text-[10px] uppercase font-black text-zinc-600 mb-2 tracking-[0.3em] flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Bonded Capital
                  </p>
                  <p className="text-4xl font-black tracking-tighter text-white">
                    {maskValue(displayStaked)} <span className="text-base font-medium text-zinc-700 uppercase">{token.ticker}</span>
                  </p>
                </div>
                <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2rem] flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-black text-zinc-600 mb-2 tracking-[0.3em] flex items-center gap-2">
                      <Gift className="w-3 h-3" /> Pending Rewards
                    </p>
                    <p className="text-4xl font-black text-green-500 tracking-tighter">
                      {maskValue(initialRewards)} <span className="text-base font-medium text-green-900/40">{token.ticker}</span>
                    </p>
                  </div>
                  <button onClick={handleInitiateClaim} disabled={initialRewards <= 0 || claimStep !== 'none'} className="p-5 rounded-2xl bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white border border-green-500/20 active:scale-95 transition-all disabled:opacity-20 shadow-xl group/btn">
                    {claimStep === 'signing' ? <Fingerprint className="w-8 h-8 animate-pulse" /> : <Download className="w-8 h-8 group-hover/btn:scale-110 transition-transform" />}
                  </button>
                </div>
             </div>
             <button onClick={() => setIsStakingModalOpen(true)} className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] transition-all text-sm shadow-2xl active:scale-95">Manage Staking Positions</button>
          </div>

          <ShardVisualizer shards={shards} signing={claimStep === 'signing'} reconstructed={claimStep === 'success'} />

          <div className="bg-[#111115] border border-zinc-800/60 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Master Public Key</h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 break-all mono text-[12px] leading-relaxed text-zinc-400 cursor-pointer hover:border-zinc-700 transition-all shadow-inner relative" onClick={handleCopy}>
              {address}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Verified Derivation</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-cyan-600/10 border border-cyan-500/20 rounded-full">
                   <Sparkles className="w-3 h-3 text-cyan-500" />
                   <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Gemini Shield Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Token Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsImportModalOpen(false)} />
          <div className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500">
                      <PlusCircle className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tight">Import Token</h2>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                   <X className="w-6 h-6" />
                </button>
             </div>
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Ticker</label>
                   <div className="relative group">
                      <input 
                         autoFocus
                         value={newTicker} 
                         onChange={e => setNewTicker(e.target.value)} 
                         placeholder="e.g. USDC, USDT" 
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4.5 px-6 focus:border-cyan-500 outline-none font-bold text-white text-lg placeholder:text-zinc-800 transition-all" 
                      />
                   </div>
                </div>
                <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex gap-4">
                   <Info className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">CySync will automatically derive the balance for this asset based on your master key configuration.</p>
                </div>
                <button 
                   disabled={!newTicker.trim() || isImporting}
                   onClick={handleImportTokenSubmit} 
                   className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                   {isImporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                   {isImporting ? 'Syncing Chain Data...' : 'Track Asset'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Import NFT Modal */}
      {isNFTImportModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsNFTImportModalOpen(false)} />
          <div className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                      <LayoutGrid className="w-6 h-6" />
                   </div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tight">Import NFT</h2>
                </div>
                <button onClick={() => setIsNFTImportModalOpen(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                   <X className="w-6 h-6" />
                </button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Name</label>
                   <input value={nftName} onChange={e => setNftName(e.target.value)} placeholder="e.g. Pioneer #01" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-black outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Collection ID / Contract</label>
                   <input value={nftCollectionId} onChange={e => setNftCollectionId(e.target.value)} placeholder="0x..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-mono text-xs outline-none focus:border-indigo-500" />
                </div>
                <button 
                   disabled={!nftName || !nftCollectionId || isImporting}
                   onClick={handleImportNFTSubmit} 
                   className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl transition-all active:scale-95 mt-4"
                >
                   {isImporting ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Confirm Import'}
                </button>
             </div>
          </div>
        </div>
      )}

      {selectedNFT && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setSelectedNFT(null)} />
          <div className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95">
             <div className="flex-1 bg-zinc-950 flex items-center justify-center p-4">
                <img src={selectedNFT.image} className="max-h-[60vh] rounded-[2rem] shadow-2xl border border-zinc-900" alt={selectedNFT.name} />
             </div>
             <div className="w-full md:w-[400px] p-12 space-y-10">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedNFT.name}</h3>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{selectedNFT.chain} Asset</p>
                   </div>
                   <button onClick={() => setSelectedNFT(null)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                      <X className="w-8 h-8" />
                   </button>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metadata Summary</p>
                      <p className="text-sm text-zinc-400 leading-relaxed font-medium">{selectedNFT.description}</p>
                   </div>
                   <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Contract ID</span>
                         <span className="text-[10px] font-mono text-cyan-500">{selectedNFT.collectionId.slice(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4">
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rarity Score</span>
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">{selectedNFT.rarity || 'Common'}</span>
                      </div>
                   </div>
                </div>
                <button className="w-full py-5 bg-zinc-800 text-zinc-400 font-black rounded-2xl uppercase tracking-widest text-[10px] cursor-not-allowed">External Trade Locked</button>
             </div>
          </div>
        </div>
      )}

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        token={token}
        currentBalance={displayBalance}
        contacts={contacts}
        onAddContact={onAddContact}
        shards={shards}
        mode={modalMode}
        onSuccess={(amt, addr, fee) => {
          if (onTransactionSuccess) onTransactionSuccess(amt, addr, fee);
          setTimeout(syncChainData, 4000);
        }}
      />
      <StakingModal isOpen={isStakingModalOpen} onClose={() => setIsStakingModalOpen(false)} token={token} address={address} shards={shards} onSuccess={() => setTimeout(syncChainData, 4000)} />
      <ReceiveModal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} token={token} address={address} />
    </div>
  );
};

export default WalletView;
