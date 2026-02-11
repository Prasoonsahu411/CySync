
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  HardDrive, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Fingerprint,
  Cpu,
  Lock,
  Wifi,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import { getSecurityAssessment } from '../services/geminiService';

const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string, type: 'Card' | 'X1') => void;
}

const ShardAdditionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'pairing' | 'success'>('intro');
  const [shardLabel, setShardLabel] = useState('X1 Card E');
  const [progress, setProgress] = useState(0);
  const [insight, setInsight] = useState<{ riskLevel: string; summary: string; safetyTip: string } | null>(null);

  useEffect(() => {
    if (isOpen && step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('pairing'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (step === 'pairing') {
      getSecurityAssessment("Pairing a new X1 Secure Card shard for 3-of-5 threshold").then(setInsight);
      setTimeout(() => setStep('success'), 4000);
    }
  }, [step]);

  // Reset steps on open
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setProgress(0);
      setInsight(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-[#111115]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Add Account Shard</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">MPC Shard Provisioning Flow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="p-10 min-h-[400px] flex flex-col justify-center">
          {step === 'intro' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto border border-zinc-800 shadow-inner">
                  <Smartphone className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Provision New Card</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  Connect a new X1 Secure Card via NFC or USB to split your master seed into a new 3-of-5 shard configuration.
                </p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={shardLabel}
                  onChange={e => setShardLabel(e.target.value)}
                  placeholder="Card Label (e.g. Card E)"
                  className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-2xl py-4 px-6 focus:border-cyan-500 outline-none font-bold"
                />
                <button 
                  onClick={() => setStep('scanning')}
                  className="w-full py-5 bg-cyan-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/20 active:scale-95"
                >
                  Start Provisioning
                </button>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="text-center space-y-10 animate-in fade-in">
              <div className="relative inline-block">
                 <div className="w-32 h-32 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                 <Wifi className="w-12 h-12 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] animate-pulse">Detecting Hardware...</p>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden max-w-[200px] mx-auto">
                   <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )}

          {step === 'pairing' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Handshake Exchange</h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">Provisioning secure MPC scalars. Confirm the pairing code on your X1 Vault device.</p>
              </div>
              
              {insight && (
                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Safety Analysis</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase rounded-full">Secure Session</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{insight.summary}</p>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight text-white">Shard Provisioned</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">Your recovery threshold has been updated to 3-of-6 shards.</p>
              </div>
              <button 
                onClick={() => {
                  onAdd(shardLabel, 'Card');
                  onClose();
                }}
                className="w-full py-5 bg-zinc-800 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-zinc-700 transition-all"
              >
                Close & Finish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShardAdditionModal;
