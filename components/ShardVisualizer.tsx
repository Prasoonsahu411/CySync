
import React, { useMemo } from 'react';
import { ShardStatus } from '../types';
import { Shield, Smartphone, Cpu, CheckCircle, Lock, Binary, Fingerprint, Zap, Check } from 'lucide-react';

interface Props {
  shards: ShardStatus[];
  signing: boolean;
  reconstructed: boolean;
}

const ShardVisualizer: React.FC<Props> = ({ shards, signing, reconstructed }) => {
  // Calculate dynamic threshold based on PRD logic (2-of-5, 3-of-6)
  const threshold = useMemo(() => Math.floor(shards.length / 2), [shards.length]);
  const connectedCount = useMemo(() => shards.filter(s => s.connected).length, [shards]);

  return (
    <div className="bg-[#0d0d11] border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
      {/* Background Grid Pattern for high-tech look */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/30 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] group">
            <Shield className={`w-6 h-6 text-cyan-500 ${signing ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">Ed25519</h3>
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">MPC</h3>
            <h3 className="text-2xl font-black tracking-tight text-white leading-tight">Protocol</h3>
            <div className="mt-2 space-y-0.5">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Threshold Sig:</p>
              <p className={`text-xs font-black uppercase tracking-[0.1em] transition-colors ${connectedCount >= threshold ? 'text-green-500' : 'text-cyan-500'}`}>
                {threshold}-of-{shards.length} Matrix
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 group transition-all hover:border-cyan-500/30">
            <Binary className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Blake2b</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 group transition-all hover:border-cyan-500/30">
            <Lock className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ed25519</span>
          </div>
        </div>
      </div>

      {/* Shard Grid Layout */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {shards.map((shard) => (
          <div 
            key={shard.id} 
            className={`relative p-4 rounded-[1.8rem] border flex flex-col gap-4 transition-all duration-700 min-h-[120px] justify-between overflow-hidden group ${
              reconstructed && shard.connected
                ? 'bg-green-500/5 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                : shard.connected 
                  ? 'bg-zinc-900/40 border-cyan-500/40 shadow-lg shadow-cyan-900/5' 
                  : 'bg-zinc-950/20 border-zinc-800/40 opacity-40 grayscale'
            } ${signing && shard.connected ? 'ring-2 ring-cyan-500 ring-offset-4 ring-offset-[#0d0d11] scale-105 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : ''}`}
          >
            {/* Shard Scanning Animation */}
            {signing && shard.connected && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="w-full h-1 bg-cyan-500/40 blur-sm absolute top-0 left-0 animate-scan shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full animate-shimmer" />
              </div>
            )}

            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-xl transition-colors duration-500 ${
                reconstructed && shard.connected 
                  ? 'bg-green-500/20 text-green-500' 
                  : shard.type === 'X1' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-indigo-500/10 text-indigo-400'
              }`}>
                {reconstructed && shard.connected ? <Check className="w-4 h-4" /> : shard.type === 'X1' ? <Cpu className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </div>
              {shard.connected && (
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-colors duration-500 ${reconstructed ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`} />
              )}
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-[11px] font-black text-white leading-none tracking-tight group-hover:text-cyan-400 transition-colors">{shard.label}</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">ID: {shard.id.toString().padStart(2, '0')}</p>
            </div>
            
            {/* Validated Shard Indicator */}
            {reconstructed && shard.connected && (
              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 animate-in zoom-in">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-zinc-800/60 grid grid-cols-2 gap-6 relative z-10">
        <div className="flex items-center gap-3 group">
          <div className={`w-1.5 h-3 rounded-sm transition-all duration-500 ${connectedCount >= threshold ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`} />
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-tight">
            Quorum <br/> 
            <span className={connectedCount >= threshold ? 'text-green-500' : 'text-zinc-600'}>
              {connectedCount >= threshold ? 'REACHED' : 'PENDING'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Fingerprint className={`w-4 h-4 transition-colors ${signing ? 'text-cyan-500 animate-pulse' : 'text-zinc-700'}`} />
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-tight">
            Hardware <br/> Interlock
          </p>
        </div>
        <div className="col-span-2 mt-2">
          <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.05em] leading-relaxed italic text-right flex items-center justify-end gap-2">
            <Zap className={`w-2 h-2 ${signing ? 'text-cyan-500 animate-bounce' : 'text-zinc-800'}`} />
            L4 Cryptographic Core: Air-Gapped Key Reconstruction
          </p>
        </div>
      </div>

      {/* Signing Animation Overlay */}
      {signing && (
        <div className="absolute inset-0 bg-[#0d0d11]/80 backdrop-blur-[2px] flex items-center justify-center z-20 animate-in fade-in duration-500">
          <div className="text-center space-y-6">
            <div className="relative inline-block animate-float">
              <div className="w-24 h-24 border-2 border-cyan-500/5 border-t-cyan-500 rounded-full animate-spin duration-[1.5s]"></div>
              <div className="w-20 h-20 border-2 border-cyan-500/10 border-b-cyan-500 rounded-full animate-spin absolute top-2 left-2 duration-[2.5s] direction-reverse"></div>
              <Shield className="w-10 h-10 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] animate-pulse">MPC Handshake</p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-cyan-500/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">Aggregating Shard Entropy</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation Overlay */}
      {reconstructed && (
        <div className="absolute inset-0 bg-green-500/5 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none animate-in fade-in duration-1000">
          <div className="bg-[#0a0a0c]/90 border border-green-500/30 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-green-900/20 transform animate-in zoom-in-95 slide-in-from-bottom-2">
            <CheckCircle className="w-6 h-6 text-green-500 animate-bounce" />
            <div>
              <p className="text-green-500 font-black uppercase tracking-widest text-xs">Scalar Validated</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Ed25519 Sig Generated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShardVisualizer;