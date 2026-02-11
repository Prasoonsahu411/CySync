
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  PlusCircle, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  BookUser,
  FileText,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  X,
  User,
  Users,
  TrendingUp,
  Shield,
  ExternalLink,
  Zap,
  Globe,
  Check,
  Code,
  Lock,
  MessageSquare,
  ArrowUpRight,
  Info,
  Binary,
  ShoppingBag,
  Coins,
  ArrowRightLeft,
  BookOpen,
  Plus
} from 'lucide-react';
import { ChainType, WalletState, Contact, ImportedAsset, Transaction, ShardStatus, NFT } from './types';
import { TOKENS, INITIAL_SHARDS, CHAIN_IDS } from './constants';
import WalletView from './components/WalletView';
import DashboardOverview from './components/DashboardOverview';
import SetupWizard from './components/SetupWizard';
import AddressBook from './components/AddressBook';
import Documentation from './components/Documentation';
import SettingsPage from './components/SettingsPage';
import ShardAdditionModal from './components/ShardAdditionModal';
import AuthView from './components/AuthView';
import EjectFlow from './components/EjectFlow';
import ShopPage from './components/ShopPage';

interface Account {
  id: number;
  name: string;
  dotAddress: string;
  acaAddress: string;
  ethAddress: string;
  type: 'Substrate' | 'MPC';
}

interface Currency {
  code: string;
  symbol: string;
  rate: number; 
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 0.012 },
  { code: 'INR', symbol: '₹', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.011 },
  { code: 'GBP', symbol: '£', rate: 0.0094 },
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: 1, name: 'Main Vault', dotAddress: '13UVJyLnbvST9XF9sFqndK8E9tTzTiyXhXhK72Tf56xS2KfE', acaAddress: '5H699E2W6635W5888888888888888888888888888888888', ethAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', type: 'MPC' },
  { id: 2, name: 'DeFi Account', dotAddress: '15oF4uV65Yf3r2f4v3u2f4v3u2f4v3u2f4v3u2f4v3u2f4v3', acaAddress: '5E2p9XWv32k1v32k1v32k1v32k1v32k1v32k1v32k1v32k1', ethAddress: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D', type: 'Substrate' },
  { id: 3, name: 'Cold Storage', dotAddress: '14b2xYq91s8q91s8q91s8q91s8q91s8q91s8q91s8q91s8q', acaAddress: '5C4rTf8p9f8p9f8p9f8p9f8p9f8p9f8p9f8p9f8p9f8p9f8p', ethAddress: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', type: 'MPC' }
];

type AuthStatus = 'uninitialized' | 'locked' | 'authenticated';

const App: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('uninitialized');
  const [activeTab, setActiveTab] = useState<ChainType | 'dashboard' | 'address-book' | 'documentation' | 'settings' | 'shop'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [currentAccountIdx, setCurrentAccountIdx] = useState(0);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showCurrencySwitcher, setShowCurrencySwitcher] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showNewIdentityModal, setShowNewIdentityModal] = useState(false);
  const [newIdentityName, setNewIdentityName] = useState('');
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const accountRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const [shards, setShards] = useState<ShardStatus[]>(INITIAL_SHARDS.map((s, idx) => ({
    ...s,
    connected: idx < 2
  })));

  const [showShardModal, setShowShardModal] = useState(false);
  const [showEjectFlow, setShowEjectFlow] = useState(false);
  
  const [prices, setPrices] = useState({ DOT: 123.96, ACA: 0.72, ETH: 215420.50 });
  
  const currentAccount = accounts[currentAccountIdx];

  const [walletState, setWalletState] = useState<WalletState>({
    dotBalance: 1240.52,
    acaBalance: 45200.18,
    ethBalance: 4.825,
    dotStaked: 850.00,
    acaStaked: 12000.00,
    ethStaked: 0,
    dotRewards: 12.45,
    acaRewards: 145.20,
    ethRewards: 0,
    dotAddress: currentAccount.dotAddress,
    acaAddress: currentAccount.acaAddress,
    ethAddress: currentAccount.ethAddress,
    transactions: [
      { id: 'eth-1', type: 'send', amount: 0.5, token: 'ETH', timestamp: Date.now() - 7200000, status: 'confirmed', address: '0x3f2...a941', fee: 0.002, txHash: '0x5e2...9a21', chainId: 1 },
      { id: 'dot-1', type: 'receive', amount: 150, token: 'DOT', timestamp: Date.now() - 3600000, status: 'confirmed', address: '15oF4u...v4v3', fee: 0.0125, txHash: '0x3f2...a941' }
    ],
    contacts: [
      { id: 'c1', name: 'Binance Cold Storage', address: '14b2xYq91s8q91s8q91s8q91s8q91s8q91s8q91s8q91s8q', chain: ChainType.POLKADOT },
      { id: 'c2', name: 'MetaMask Mobile', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', chain: ChainType.ETHEREUM }
    ],
    importedAssets: [],
    nfts: [
      { id: 'nft1', collectionId: '888', tokenId: '1', name: 'Polkadot Pioneer #1', description: 'Exclusive NFT for early Substrate contributors.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=400&auto=format&fit=crop', chain: ChainType.POLKADOT, rarity: 'Legendary' }
    ]
  });

  useEffect(() => {
    const initialized = localStorage.getItem('cysync_initialized');
    if (initialized) setAuthStatus('locked');
    setLoading(false);
  }, []);

  // Update wallet state context when account changes
  useEffect(() => {
    setWalletState(prev => ({
      ...prev,
      dotAddress: currentAccount.dotAddress,
      acaAddress: currentAccount.acaAddress,
      ethAddress: currentAccount.ethAddress,
      // In a real app we would fetch balances here. For simulation we randomize slightly.
      dotBalance: Math.random() * 2000 + 50,
      acaBalance: Math.random() * 50000 + 1000
    }));
  }, [currentAccount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountSwitcher(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencySwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthComplete = () => {
    localStorage.setItem('cysync_initialized', 'true');
    setAuthStatus('authenticated');
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleEjectComplete = () => {
    setShowEjectFlow(false);
    localStorage.removeItem('cysync_initialized');
    setAuthStatus('uninitialized');
  };

  const handleCreateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentityName.trim()) return;

    const newId = accounts.length + 1;
    const newAcc: Account = {
      id: newId,
      name: newIdentityName.trim(),
      dotAddress: `1${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      acaAddress: `5${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      ethAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      type: 'MPC'
    };

    setAccounts([...accounts, newAcc]);
    setCurrentAccountIdx(accounts.length); // Switch to the new one
    setNewIdentityName('');
    setShowNewIdentityModal(false);
    setShowAccountSwitcher(false);
  };

  const handleTransactionSuccess = (amt: number, addr: string, fee: number) => {
    const currentChain = activeTab as ChainType;
    const ticker = TOKENS[currentChain].ticker;
    const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newTx: Transaction = {
      id: `local-${Date.now()}`,
      type: 'send',
      amount: amt,
      token: ticker,
      timestamp: Date.now(),
      status: 'confirmed',
      address: addr,
      fee: fee,
      txHash: txHash,
      chainId: CHAIN_IDS[currentChain]
    };

    setWalletState(prev => ({
      ...prev,
      dotBalance: currentChain === ChainType.POLKADOT ? prev.dotBalance - (amt + fee) : prev.dotBalance,
      acaBalance: currentChain === ChainType.ACALA ? prev.acaBalance - (amt + fee) : prev.acaBalance,
      ethBalance: currentChain === ChainType.ETHEREUM ? prev.ethBalance - (amt + fee) : prev.ethBalance,
      transactions: [newTx, ...prev.transactions]
    }));
  };

  const convertPrice = (priceInINR: number) => priceInINR * selectedCurrency.rate;
  const dotValue = walletState.dotBalance * convertPrice(prices.DOT);
  const acaValue = walletState.acaBalance * convertPrice(prices.ACA);
  const ethValue = walletState.ethBalance * convertPrice(prices.ETH);
  const totalValue = dotValue + acaValue + ethValue;

  const dashboardAssets = useMemo(() => ([
    { name: 'Ethereum', ticker: 'ETH', value: ethValue, color: '#627EEA', chain: ChainType.ETHEREUM },
    { name: 'Polkadot', ticker: 'DOT', value: dotValue, color: '#E6007A', chain: ChainType.POLKADOT },
    { name: 'Acala', ticker: 'ACA', value: acaValue, color: '#645AFF', chain: ChainType.ACALA }
  ]), [dotValue, acaValue, ethValue]);

  const filteredAssets = useMemo(() => {
    return dashboardAssets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [dashboardAssets, searchQuery]);

  if (authStatus !== 'authenticated') return <AuthView status={authStatus} onComplete={handleAuthComplete} />;

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 bg-cyan-600 rounded-3xl flex items-center justify-center animate-bounce shadow-2xl shadow-cyan-600/30">
          <ShieldCheck className="w-9 h-9 text-white" />
        </div>
        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] animate-pulse">Syncing Enclave State</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0c] text-zinc-100 select-none overflow-hidden font-inter animate-in fade-in duration-700">
      <aside className="w-72 bg-[#0d0d11] border-r border-zinc-800/60 flex flex-col shrink-0 shadow-2xl z-20">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-600/20 group-hover:scale-110 transition-all duration-300">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">CySync</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-6 custom-scrollbar scroll-smooth">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('address-book')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'address-book' ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
            <BookUser className="w-5 h-5" /> Address Book
          </button>

          <div className="pt-8 pb-3 px-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">EVM Chains</div>
          <button onClick={() => setActiveTab(ChainType.ETHEREUM)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === ChainType.ETHEREUM ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
            <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: TOKENS[ChainType.ETHEREUM].color + '20' }}><Coins className="w-3 h-3" style={{ color: TOKENS[ChainType.ETHEREUM].color }} /></div>Ethereum</div>
          </button>

          <div className="pt-8 pb-3 px-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">Substrate Ecosystem</div>
          <button onClick={() => setActiveTab(ChainType.POLKADOT)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === ChainType.POLKADOT ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
            <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: TOKENS[ChainType.POLKADOT].color + '20' }}><Wallet className="w-3 h-3" style={{ color: TOKENS[ChainType.POLKADOT].color }} /></div>Polkadot</div>
          </button>
          <button onClick={() => setActiveTab(ChainType.ACALA)} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === ChainType.ACALA ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
            <div className="flex items-center gap-4"><div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: TOKENS[ChainType.ACALA].color + '20' }}><Activity className="w-3 h-3" style={{ color: TOKENS[ChainType.ACALA].color }} /></div>Acala</div>
          </button>
          
          <div className="pt-8 pb-3 px-4 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">System Ops</div>
          <button onClick={() => setActiveTab('documentation')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'documentation' ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-400'}`}>
            <BookOpen className="w-5 h-5" /> Documentation
          </button>
          <button onClick={() => setActiveTab('shop')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'shop' ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-400'}`}>
            <ShoppingBag className="w-5 h-5" /> Store
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-400'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-zinc-800/60 bg-[#0d0d11]">
           <button onClick={() => setShowEjectFlow(true)} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all active:scale-95 group">
            <LogOut className="w-5 h-5" /> Emergency Eject
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0c]">
        <header className="h-24 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center bg-[#0d0d11] border border-zinc-800/60 rounded-2xl px-5 py-2.5 w-[420px] shadow-lg focus-within:border-cyan-500/50 transition-all">
            <Search className="w-5 h-5 text-zinc-600" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Filter assets or contacts..." className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-700 w-full ml-3" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative" ref={currencyRef}>
              <button onClick={() => setShowCurrencySwitcher(!showCurrencySwitcher)} className={`flex items-center gap-2 px-4 py-2 bg-[#0d0d11] border rounded-xl shadow-lg hover:border-indigo-500/50 transition-all ${showCurrencySwitcher ? 'border-indigo-500' : 'border-zinc-800/60'}`}>
                <span className="text-[10px] font-black text-white">{selectedCurrency.code}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${showCurrencySwitcher ? 'rotate-180' : ''}`} />
              </button>
              {showCurrencySwitcher && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-[#111115] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  {CURRENCIES.map(curr => (
                    <button 
                      key={curr.code} 
                      onClick={() => { setSelectedCurrency(curr); setShowCurrencySwitcher(false); }}
                      className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors border-b border-zinc-900/50 last:border-none flex justify-between items-center"
                    >
                      <span className={selectedCurrency.code === curr.code ? 'text-white' : 'text-zinc-500'}>{curr.code}</span>
                      {selectedCurrency.code === curr.code && <Check className="w-3 h-3 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={accountRef}>
              <button onClick={() => setShowAccountSwitcher(!showAccountSwitcher)} className={`flex items-center gap-3 px-5 py-2.5 bg-[#0d0d11] border rounded-2xl shadow-lg hover:border-cyan-500/50 transition-all ${showAccountSwitcher ? 'border-cyan-500' : 'border-zinc-800/60'}`}>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center"><User className="w-4 h-4 text-indigo-400" /></div>
                <div className="text-left hidden lg:block mr-2">
                  <p className="text-[9px] font-black text-zinc-500 uppercase leading-none mb-1">Active</p>
                  <p className="text-[11px] font-black text-white leading-none truncate w-24">{currentAccount.name}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${showAccountSwitcher ? 'rotate-180' : ''}`} />
              </button>
              {showAccountSwitcher && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#111115] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-zinc-800 bg-zinc-900/20">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Vault Identity</p>
                  </div>
                  {accounts.map((acc, i) => (
                    <button 
                      key={acc.id} 
                      onClick={() => { setCurrentAccountIdx(i); setShowAccountSwitcher(false); }}
                      className="w-full p-4 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-900/50 last:border-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${currentAccountIdx === i ? 'bg-cyan-500 text-white' : 'bg-zinc-900 text-zinc-700 group-hover:text-zinc-400'}`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase truncate ${currentAccountIdx === i ? 'text-white' : 'text-zinc-500'}`}>{acc.name}</p>
                          <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">{acc.type} Architecture</p>
                        </div>
                        {currentAccountIdx === i && <Check className="w-4 h-4 text-cyan-500" />}
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={() => { setShowNewIdentityModal(true); setShowAccountSwitcher(false); }}
                    className="w-full p-4 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-700">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-black text-zinc-500 uppercase">Create New Identity</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-10 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col gap-2">
                  <h1 className="text-5xl font-black tracking-tighter text-white uppercase">Portfolio</h1>
                  <p className="text-zinc-500 font-medium">Aggregated data for <span className="text-white font-bold">{currentAccount.name}</span></p>
                </div>
                <DashboardOverview 
                  totalValue={totalValue} 
                  assets={filteredAssets} 
                  shards={shards} 
                  currencySymbol={selectedCurrency.symbol}
                  onNavigate={(chain) => setActiveTab(chain)}
                  onSetupSubstrate={() => setShowSetupWizard(true)}
                />
              </div>
            )}
            {activeTab === 'address-book' && <AddressBook contacts={walletState.contacts} onUpdate={(c) => setWalletState(prev => ({ ...prev, contacts: c }))} />}
            {activeTab === 'documentation' && <Documentation />}
            {activeTab === 'shop' && <ShopPage currencySymbol={selectedCurrency.symbol} currencyRate={selectedCurrency.rate} />}
            {activeTab === 'settings' && <SettingsPage privacyMode={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)} shards={shards} onAddShard={(l, t) => setShards([...shards, { id: shards.length+1, label: l, type: t, connected: true }])} />}
            {(activeTab === ChainType.POLKADOT || activeTab === ChainType.ACALA || activeTab === ChainType.ETHEREUM) && (
              <WalletView 
                token={TOKENS[activeTab as ChainType]} 
                balance={activeTab === ChainType.POLKADOT ? walletState.dotBalance : activeTab === ChainType.ACALA ? walletState.acaBalance : walletState.ethBalance}
                staked={activeTab === ChainType.POLKADOT ? walletState.dotStaked : activeTab === ChainType.ACALA ? walletState.acaStaked : walletState.ethStaked}
                rewards={activeTab === ChainType.POLKADOT ? walletState.dotRewards : activeTab === ChainType.ACALA ? walletState.acaRewards : walletState.ethRewards}
                transactions={walletState.transactions.filter(tx => tx.token === TOKENS[activeTab as ChainType].ticker)}
                address={activeTab === ChainType.POLKADOT ? currentAccount.dotAddress : activeTab === ChainType.ACALA ? currentAccount.acaAddress : currentAccount.ethAddress}
                contacts={walletState.contacts}
                importedAssets={walletState.importedAssets.filter(a => a.chain === activeTab)}
                nfts={walletState.nfts.filter(n => n.chain === activeTab)}
                onImportAsset={(t, c) => {
                  const colors = ['#645AFF', '#E6007A', '#00bcd4', '#FF8A65'];
                  const newAsset: ImportedAsset = { id: `${t}-${Date.now()}`, ticker: t, chain: c, balance: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)] };
                  setWalletState(prev => ({ ...prev, importedAssets: [...prev.importedAssets, newAsset] }));
                }}
                onImportNFT={(n, cId, tId, c) => {
                  const newNFT: NFT = { id: `nft-${Date.now()}`, name: n, collectionId: cId, tokenId: tId, description: `Verified artifact.`, image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&h=400&auto=format&fit=crop', chain: c, rarity: 'Rare' };
                  setWalletState(prev => ({ ...prev, nfts: [...prev.nfts, newNFT] }));
                }}
                privacyMode={privacyMode}
                shards={shards}
                currencySymbol={selectedCurrency.symbol}
                currencyRate={selectedCurrency.rate}
                onAddContact={(name, addr, chain) => setWalletState(prev => ({ ...prev, contacts: [...prev.contacts, { id: Date.now().toString(), name, address: addr, chain }] }))}
                onTransactionSuccess={handleTransactionSuccess}
              />
            )}
          </div>
        </div>
      </main>

      {/* New Identity Modal */}
      {showNewIdentityModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowNewIdentityModal(false)} />
          <form 
            onSubmit={handleCreateIdentity}
            className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">New Vault Identity</h2>
              </div>
              <button type="button" onClick={() => setShowNewIdentityModal(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Identity Label</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newIdentityName}
                  onChange={e => setNewIdentityName(e.target.value)}
                  placeholder="e.g. Savings Vault"
                  className="w-full bg-[#0a0a0c] border border-zinc-800/80 rounded-2xl py-4.5 px-6 focus:border-indigo-500/50 outline-none font-bold placeholder:text-zinc-800 transition-all text-white text-base"
                />
              </div>
              <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex gap-4">
                <Info className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  Creating a new identity generates a distinct set of SS58 and EVM addresses derived from your master hardware secret.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setShowNewIdentityModal(false)}
                className="flex-1 py-5 rounded-2xl border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-900/20"
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      )}

      <SetupWizard isOpen={showSetupWizard} onClose={() => setShowSetupWizard(false)} onComplete={() => setShowSetupWizard(false)} />
      <EjectFlow isOpen={showEjectFlow} onClose={handleEjectComplete} />
    </div>
  );
};

export default App;
