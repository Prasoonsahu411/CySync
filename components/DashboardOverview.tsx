
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  Info, 
  Lock, 
  Layers, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint,
  Cpu,
  Binary,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ChainType, ShardStatus } from '../types';

interface Props {
  totalValue: number;
  assets: any[];
  shards: ShardStatus[];
  currencySymbol: string;
  onNavigate: (chain: ChainType) => void;
  onSetupSubstrate: () => void;
}

const DashboardOverview: React.FC<Props> = ({ totalValue, assets, shards, currencySymbol, onNavigate, onSetupSubstrate }) => {
  const [showEducation, setShowEducation] = useState<'SS58' | 'ED' | null>(null);

  const mpcHealth = useMemo(() => {
    const connected = shards.filter(s => s.connected).length;
    const threshold = Math.ceil(shards.length / 2);
    return {
      percentage: Math.round((connected / shards.length) * 100),
      status: connected >= threshold ? 'Operational' : 'Degraded',
      connected,
      threshold
    };
  }, [shards]);

  const performanceData = [
    { name: 'Mon', value: totalValue * 0.92 },
    { name: 'Tue', value: totalValue * 0.95 },
    { name: 'Wed', value: totalValue * 0.94 },
    { name: 'Thu', value: totalValue * 0.98 },
    { name: 'Fri', value: totalValue * 0.97 },
    { name: 'Sat', value: totalValue * 1.02 },
    { name: 'Sun', value: totalValue },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Portfolio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-gradient-to-br from-[#111115] to-[#0a0a0c] p-10 rounded-[3rem] border border-zinc-800/60 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.05),_transparent)] pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Aggregate Portfolio Value</p>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-7xl font-black tracking-tighter text-white">
                    {currencySymbol}{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </h2>
                  <span className="text-green-500 font-black text-lg flex items-center gap-1">
                    <TrendingUp className="w-5 h-5" /> +4.2%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onSetupSubstrate} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20 flex items-center gap-2 active:scale-95">
                  <Plus className="w-4 h-4" /> Setup Substrate
                </button>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d11', border: '1px solid #27272a', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-900/50">
              {assets.map(asset => (
                <div key={asset.ticker} onClick={() => onNavigate(asset.chain)} className="space-y-1 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{asset.name}</p>
                  </div>
                  <p className="text-lg font-black text-white">{currencySymbol}{asset.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Health Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl space-y-8 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-500" /> Security Health
              </h3>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${mpcHealth.status === 'Operational' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                {mpcHealth.status}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                  <span>MPC Shard Quorum</span>
                  <span>{mpcHealth.connected}/{shards.length} Cards</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${mpcHealth.percentage}%` }} />
                </div>
              </div>

              <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Air-Gap Integrity</p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">L4 Kernel Verified</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Live Node Status</p>
                <div className="flex flex-wrap gap-2">
                  {['Polkadot-RPC', 'Acala-WS', 'Indexer-v2'].map(node => (
                    <div key={node} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-zinc-400 uppercase">{node}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-[2.5rem] p-8 shadow-xl group hover:bg-indigo-600/10 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Active Yield Hub</h3>
                <p className="text-3xl font-black text-white tracking-tighter">7.4% <span className="text-xs text-zinc-600 uppercase font-bold">avg apr</span></p>
                <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  View Nominations <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced PRD Features: Substrate Knowledge Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Binary className="w-24 h-24 text-cyan-500" /></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">What is SS58?</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Unlike Ethereum's fixed address format, Substrate uses SS58—a versioned address format that identifies which chain an address belongs to using a unique prefix.
          </p>
          <div className="pt-2 flex gap-3">
             <span className="px-2 py-1 bg-zinc-900 rounded-md text-[8px] font-black text-zinc-600 uppercase">Prefix 0 (DOT)</span>
             <span className="px-2 py-1 bg-zinc-900 rounded-md text-[8px] font-black text-zinc-600 uppercase">Prefix 10 (ACA)</span>
          </div>
        </div>

        <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity className="w-24 h-24 text-amber-500" /></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Existential Deposit</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            To prevent "dust" accounts from bloating the state, Substrate chains require a minimum balance. If your balance drops below this, your account is <span className="text-amber-500 font-bold">reaped (deleted)</span>.
          </p>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Threshold: 1.0 DOT / 0.1 ACA</p>
        </div>

        <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Fingerprint className="w-24 h-24 text-indigo-500" /></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">MPC Signing Flow</h4>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Your DOT private key is never assembled in one place. Cypherock uses Multi-Party Computation to generate a signature using shards from multiple X1 Cards.
          </p>
          <div className="flex items-center gap-2 text-green-500">
             <CheckCircle2 className="w-4 h-4" />
             <span className="text-[9px] font-black uppercase tracking-widest">Ed25519 Native Support</span>
          </div>
        </div>
      </div>

      {/* Transaction Feed Mini */}
      <div className="bg-[#111115] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <Clock className="w-6 h-6 text-zinc-600" /> Recent Network Activity
          </h3>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Across all chains</span>
        </div>
        <div className="divide-y divide-zinc-900/50">
          {[
            { chain: 'Polkadot', hash: '0x7e2...a12', type: 'Staking', time: '12m ago', amt: '+0.42 DOT' },
            { chain: 'Acala', hash: '0x3a4...f92', type: 'DEX Swap', time: '1h ago', amt: '-1,240 aUSD' },
            { chain: 'Ethereum', hash: '0x9f1...e01', type: 'Contract Call', time: '3h ago', amt: '0 ETH' }
          ].map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-600 group-hover:text-cyan-500 transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">{item.chain} • {item.type}</p>
                  <p className="text-[9px] text-zinc-600 mono font-bold uppercase tracking-tighter">Extrinsic: {item.hash}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-zinc-200">{item.amt}</p>
                <p className="text-[9px] text-zinc-700 font-bold uppercase">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
