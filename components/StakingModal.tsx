
import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Shield, Check, Fingerprint, CheckCircle2, Search, 
  UserCheck, Users, Info, AlertCircle, Loader2, Star
} from 'lucide-react';
import { Token, ChainType, ShardStatus } from '../types';
import ShardVisualizer from './ShardVisualizer';
import { INITIAL_SHARDS } from '../constants';
import { fetchValidators, fetchNominations } from '../services/substrateService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  address: string;
  shards: ShardStatus[];
  onSuccess: () => void;
}

const StakingModal: React.FC<Props> = ({ isOpen, onClose, token, address, shards, onSuccess }) => {
  const [step, setStep] = useState<'list' | 'signing' | 'success'>('list');
  const [validators, setValidators] = useState<any[]>([]);
  const [currentNominations, setCurrentNominations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setStep('list');
      setIsDone(false);
      setIsSigning(false);
      Promise.all([
        fetchValidators(token.chain),
        fetchNominations(token.chain, address)
      ]).then(([vals, noms]) => {
        setValidators(vals);
        setCurrentNominations(noms);
        setSelected(noms);
        setLoading(false);
      });
    }
  }, [isOpen, token.chain, address]);

  const filtered = validators.filter(v => 
    v.address.toLowerCase().includes(search.toLowerCase()) || 
    v.identity?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (addr: string) => {
    setSelected(prev => 
      prev.includes(addr) ? prev.filter(a => a !== addr) : [...prev, addr].slice(0, 16)
    );
  };

  const handleNominate = () => {
    setStep('signing');
    setIsSigning(true);
    setIsDone(false);
    setTimeout(() => {
      setIsSigning(false);
      setIsDone(true);
      setTimeout(() => {
        setStep('success');
        onSuccess();
      }, 1500);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-[#111115]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Manage Nominations</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Select up to 16 validators</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {step === 'list' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="Filter by address or identity..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 focus:border-indigo-500/50 outline-none text-sm transition-all"
                />
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Indexing Staking Ledger...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(v => (
                    <div 
                      key={v.address} 
                      onClick={() => toggleSelect(v.address)}
                      className={`p-5 rounded-[1.5rem] border cursor-pointer transition-all flex items-center justify-between ${
                        selected.includes(v.address) 
                          ? 'bg-indigo-500/5 border-indigo-500/40' 
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected.includes(v.address) ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                          {selected.includes(v.address) ? <Check className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{v.identity || 'Anonymous Validator'}</p>
                          <p className="text-[10px] text-zinc-600 mono font-bold">{v.address.slice(0, 24)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Commission</p>
                        <p className="text-sm font-black text-indigo-400">{v.commission || '0.00%'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'signing' && (
            <div className="py-10 space-y-10">
              <div className="text-center space-y-3">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Hardware Consent Required</p>
                <h3 className="text-4xl font-black tracking-tight text-white">Nominate {selected.length} Validators</h3>
                <div className="flex justify-center gap-2 mt-4">
                  {selected.slice(0, 3).map((s, i) => (
                    <div key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-zinc-500 mono">
                      {s.slice(0, 8)}...
                    </div>
                  ))}
                  {selected.length > 3 && <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-zinc-500">+{selected.length - 3} more</div>}
                </div>
              </div>
              <ShardVisualizer shards={shards} signing={isSigning} reconstructed={isDone} />
            </div>
          )}

          {step === 'success' && (
            <div className="py-16 flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-green-500/30">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-4xl font-black tracking-tight mb-4 text-white">Nomination Active</h3>
              <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">
                Your nominations have been updated on-chain. Rewards will accrue after the next era finality (~6-12h).
              </p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-zinc-800 bg-[#111115] flex gap-4">
          {step === 'list' && (
            <>
              <button onClick={onClose} className="flex-1 py-4 border border-zinc-800 text-zinc-500 font-bold rounded-2xl uppercase tracking-widest">Cancel</button>
              <button 
                onClick={handleNominate}
                disabled={selected.length === 0}
                className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-30 active:scale-95 flex items-center justify-center gap-3"
              >
                <UserCheck className="w-5 h-5" /> Confirm {selected.length} Nominations
              </button>
            </>
          )}
          {step === 'success' && (
            <button onClick={onClose} className="w-full py-4 bg-zinc-800 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-zinc-700 active:scale-95 transition-all">Done</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingModal;
