
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Cpu, 
  Smartphone,
  Globe, 
  Zap, 
  RefreshCw, 
  Lock, 
  Fingerprint, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Plus,
  EyeOff,
  Activity,
  Server,
  Terminal,
  FileText,
  Binary,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Key
} from 'lucide-react';
import { POLKADOT_RPCS, ACALA_RPCS } from '../constants';
import { ShardStatus } from '../types';
import ShardAdditionModal from './ShardAdditionModal';

interface Props {
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  shards: ShardStatus[];
  onAddShard: (label: string, type: 'Card' | 'X1') => void;
}

type SettingsTab = 'security' | 'network' | 'mpc' | 'ai' | 'system';

const SettingsPage: React.FC<Props> = ({ privacyMode, onTogglePrivacy, shards, onAddShard }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShardModal, setShowShardModal] = useState(false);
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  
  const [aiConfig, setAiConfig] = useState({
    enabled: true,
    riskScoring: true,
    derivationAudit: true,
    protocolInsights: true
  });

  const [securityConfig, setSecurityConfig] = useState({
    stealthMode: false,
    autoLock: 5,
    biometricRequired: true,
    enclaveIsolation: true
  });

  // Advanced RPC State
  const [dotRpcs] = useState(POLKADOT_RPCS);
  const [acaRpcs] = useState(ACALA_RPCS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLatencies: Record<string, number> = {};
      [...dotRpcs, ...acaRpcs].forEach(rpc => {
        newLatencies[rpc] = Math.floor(Math.random() * 150) + 20;
      });
      setLatencies(newLatencies);
    }, 3000);
    return () => clearInterval(interval);
  }, [dotRpcs, acaRpcs]);

  const handleSave = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'security', label: 'Vault Security', icon: Shield, desc: 'Biometrics & Stealth' },
    { id: 'network', label: 'Node Registry', icon: Globe, desc: 'RPC Latency & Failover' },
    { id: 'mpc', label: 'MPC Calibration', icon: Layers, desc: 'Shard Thresholds' },
    { id: 'ai', label: 'Gemini Guard', icon: Zap, desc: 'AI Risk Engine' },
    { id: 'system', label: 'System Kernel', icon: Terminal, desc: 'Logs & Diagnostics' },
  ];

  const diagnosticLogs = [
    { time: '10:42:01', event: 'Ed25519 Scalar Mult verified', status: 'success' },
    { time: '10:41:55', event: 'SS58 Prefix 0 Address Derivation', status: 'success' },
    { time: '10:39:12', event: 'WebSocket Handshake (wss://rpc.polkadot.io)', status: 'info' },
    { time: '10:35:04', event: 'Secure Enclave RAM Zero-Out', status: 'success' },
    { time: '09:12:44', event: 'Unauthorized NFC Ping Rejected', status: 'warning' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter uppercase text-white">System <span className="text-zinc-600 font-light">Control</span></h1>
          <p className="text-zinc-500 font-medium text-lg">Configure advanced hardware enclaves and node clusters.</p>
        </div>
        <button onClick={handleSave} disabled={isUpdating} className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 px-12 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-cyan-900/20 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest">
          {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isUpdating ? 'Synchronizing...' : saved ? 'Kernel Updated' : 'Push Changes'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:w-80 space-y-3 shrink-0">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center gap-5 px-8 py-6 rounded-[2rem] transition-all text-left group border ${
                activeTab === tab.id 
                  ? 'bg-zinc-800 border-zinc-700 text-white shadow-xl' 
                  : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <div className={`p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-500' : 'bg-zinc-900 text-zinc-700 group-hover:text-zinc-500'}`}>
                <tab.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">{tab.label}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-zinc-400' : 'text-zinc-700'}`}>{tab.desc}</p>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-[#111115] border border-zinc-800/60 rounded-[3.5rem] p-10 md:p-14 shadow-2xl space-y-12">
            
            {activeTab === 'security' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                      <Shield className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Defense Layers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-6 group hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <h4 className="text-white font-black uppercase text-sm flex items-center gap-2">
                               <EyeOff className="w-4 h-4 text-cyan-500" /> Global Stealth Mode
                            </h4>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Obfuscate Balance Metadata</p>
                         </div>
                         <div 
                           onClick={() => setSecurityConfig({...securityConfig, stealthMode: !securityConfig.stealthMode})}
                           className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${securityConfig.stealthMode ? 'bg-cyan-600' : 'bg-zinc-800'}`}
                         >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${securityConfig.stealthMode ? 'ml-6' : 'ml-0'}`} />
                         </div>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">Forces all balance UI elements to mask immediately upon app inactivity or unauthorized screen capture detection.</p>
                   </div>

                   <div className="p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl space-y-6 group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <h4 className="text-white font-black uppercase text-sm flex items-center gap-2">
                               <Fingerprint className="w-4 h-4 text-indigo-500" /> Biometric Interlock
                            </h4>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Hardware-level Auth</p>
                         </div>
                         <div 
                           onClick={() => setSecurityConfig({...securityConfig, biometricRequired: !securityConfig.biometricRequired})}
                           className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${securityConfig.biometricRequired ? 'bg-indigo-600' : 'bg-zinc-800'}`}
                         >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${securityConfig.biometricRequired ? 'ml-6' : 'ml-0'}`} />
                         </div>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">Require physical fingerprint confirmation on the X1 device for every shard reconstruction operation.</p>
                   </div>
                </div>

                <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-8">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <h4 className="text-white font-black uppercase text-sm">Automated Vault Lockout</h4>
                         <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Inactivity session threshold</p>
                      </div>
                      <div className="flex items-center gap-4">
                         {[1, 5, 15, 60].map(min => (
                           <button 
                             key={min} 
                             onClick={() => setSecurityConfig({...securityConfig, autoLock: min})}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${securityConfig.autoLock === min ? 'bg-cyan-600 text-white shadow-xl' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                           >
                              {min}m
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'network' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                      <Server className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Active Node Cluster</h2>
                  </div>
                  <button className="text-[10px] font-black text-cyan-500 bg-cyan-500/5 px-6 py-3 rounded-full border border-cyan-500/20 uppercase tracking-[0.2em] hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Register Node
                  </button>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Polkadot Relay Chain (Prefix 0)</p>
                   <div className="grid grid-cols-1 gap-3">
                      {dotRpcs.map((rpc, i) => (
                        <div key={rpc} className="p-6 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${latencies[rpc] < 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                              <span className="text-[11px] font-mono text-zinc-400">{rpc}</span>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Latency</p>
                                 <p className={`text-sm font-black mono ${latencies[rpc] < 80 ? 'text-green-500' : 'text-amber-500'}`}>{latencies[rpc] || '--'}ms</p>
                              </div>
                              <button className="p-2 text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'mpc' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                      <Binary className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">MPC Logic Engine</h2>
                </div>

                <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] space-y-10">
                   <div className="space-y-4">
                      <h4 className="text-xl font-black text-white uppercase flex items-center gap-3">
                         <Layers className="w-6 h-6 text-indigo-500" /> SSS Threshold Matrix
                      </h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        Adjust the reconstruction threshold for your master secret shards. High security requires more physical cards to be present for signing.
                      </p>
                   </div>

                   <div className="flex justify-between items-center px-6">
                      <div className="text-center space-y-1">
                         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Shards</p>
                         <p className="text-4xl font-black text-white">{shards.length}</p>
                      </div>
                      <div className="w-24 h-0.5 bg-zinc-800 rounded-full" />
                      <div className="text-center space-y-1">
                         <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Required Quorum</p>
                         <p className="text-4xl font-black text-cyan-500 underline decoration-cyan-500/20 underline-offset-8">{Math.ceil(shards.length / 2)}</p>
                      </div>
                   </div>

                   <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex gap-5">
                      <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                      <div className="space-y-1">
                         <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Critical Dependency</p>
                         <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Changing threshold logic requires a full hardware synchronization cycle across all provisioned X1 cards.</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">Hardware Shard Inventory</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shards.map(s => (
                        <div key={s.id} className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-[2rem] flex justify-between items-center group hover:border-zinc-700 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-600 group-hover:text-cyan-500 transition-colors">
                                 {s.type === 'X1' ? <Cpu className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-white uppercase tracking-tighter">{s.label}</p>
                                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ID: SHARD_0{s.id}</p>
                              </div>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.connected ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-zinc-900 text-zinc-700'}`}>
                              {s.connected ? 'Verified' : 'Provisioning'}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                      <Zap className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Gemini Intelligence Hub</h2>
                </div>

                <div className="p-10 bg-gradient-to-br from-indigo-900/20 to-cyan-900/10 border border-cyan-500/20 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                      <Sparkles className="w-48 h-48 text-white" />
                   </div>
                   <div className="w-24 h-24 bg-zinc-950/80 backdrop-blur-xl rounded-[2.2rem] flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 shrink-0">
                      <Cpu className="w-12 h-12" />
                   </div>
                   <div className="space-y-4 flex-1">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none">AI Adaptive Guardrails</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed font-medium">Enable real-time transaction analysis, risk scoring, and automated SS58 derivation audits powered by Gemini 3 Flash.</p>
                      <div className="flex gap-4 pt-2">
                        <div className="px-3 py-1.5 bg-cyan-500/20 rounded-xl text-[9px] font-black text-cyan-400 uppercase border border-cyan-500/20">L3 Processing</div>
                        <div className="px-3 py-1.5 bg-white/5 rounded-xl text-[9px] font-black text-zinc-500 uppercase border border-white/5">Low Latency</div>
                      </div>
                   </div>
                   <div 
                     onClick={() => setAiConfig({...aiConfig, enabled: !aiConfig.enabled})}
                     className={`w-20 h-10 rounded-full p-1.5 cursor-pointer transition-all duration-300 ${aiConfig.enabled ? 'bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-zinc-800'}`}
                   >
                      <div className={`w-7 h-7 rounded-full bg-white shadow-xl transition-all duration-300 ${aiConfig.enabled ? 'ml-10' : 'ml-0'}`} />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                   {[
                     { id: 'riskScoring', label: 'Predictive Risk Scoring', desc: 'Analyzes destination reputation.', icon: Activity },
                     { id: 'derivationAudit', label: 'Derivation Path Audit', desc: 'Verifies SS58 compliance logic.', icon: Binary },
                     { id: 'protocolInsights', label: 'Protocol Insights', desc: 'Contextual ecosystem updates.', icon: Info }
                   ].map(feat => (
                     <div key={feat.id} className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4 flex justify-between items-start">
                        <div className="space-y-4">
                           <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-600">
                              <feat.icon className="w-5 h-5" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-xs font-black text-white uppercase tracking-tight">{feat.label}</p>
                              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{feat.desc}</p>
                           </div>
                        </div>
                        <div 
                           onClick={() => setAiConfig({...aiConfig, [feat.id]: !aiConfig[feat.id as keyof typeof aiConfig]})}
                           className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-all duration-300 ${aiConfig[feat.id as keyof typeof aiConfig] ? 'bg-zinc-700' : 'bg-zinc-900 border border-zinc-800'}`}
                         >
                            <div className={`w-5 h-5 rounded-full shadow-lg transition-all duration-300 ${aiConfig[feat.id as keyof typeof aiConfig] ? 'ml-5 bg-cyan-500' : 'ml-0 bg-zinc-800'}`} />
                         </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-zinc-500/10 rounded-2xl flex items-center justify-center text-zinc-500 border border-zinc-500/20">
                      <Terminal className="w-7 h-7" />
                   </div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter">System Kernel Logs</h2>
                </div>

                <div className="bg-[#0a0a0c] border border-zinc-900 rounded-[2.5rem] p-4 shadow-inner">
                   <div className="p-4 border-b border-zinc-900 flex justify-between items-center px-8">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Enclave Monitoring Active</span>
                      </div>
                      <button className="text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-all">Clear Session Buffer</button>
                   </div>
                   <div className="p-8 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar mono text-[11px] leading-relaxed">
                      {diagnosticLogs.map((log, i) => (
                        <div key={i} className="flex gap-6 group">
                           <span className="text-zinc-800 font-bold shrink-0">{log.time}</span>
                           <div className="flex-1 flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                log.status === 'success' ? 'bg-green-500/10 text-green-500' : 
                                log.status === 'warning' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                              }`}>
                                {log.status}
                              </span>
                              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">{log.event}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl space-y-4 text-center group hover:bg-zinc-900/50 transition-all">
                      <RefreshCw className="w-8 h-8 text-zinc-700 mx-auto group-hover:text-cyan-500 group-hover:rotate-180 transition-all duration-700" />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Kernel Firmware</p>
                      <p className="text-sm font-black text-white">v2.4.1-PROD</p>
                   </div>
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl space-y-4 text-center group hover:bg-zinc-900/50 transition-all">
                      <Activity className="w-8 h-8 text-zinc-700 mx-auto group-hover:text-indigo-500 transition-colors" />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Heap Usage</p>
                      <p className="text-sm font-black text-white">12.4 KB / 64 KB</p>
                   </div>
                   <div className="p-8 bg-zinc-900/30 border border-zinc-800/60 rounded-3xl space-y-4 text-center group hover:bg-zinc-900/50 transition-all">
                      <Flame className="w-8 h-8 text-zinc-700 mx-auto group-hover:text-red-500 transition-colors" />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Factory Reset</p>
                      <button className="text-[9px] font-black text-red-500 uppercase tracking-widest px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Purge All Data</button>
                   </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <ShardAdditionModal isOpen={showShardModal} onClose={() => setShowShardModal(false)} onAdd={onAddShard} />
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default SettingsPage;
