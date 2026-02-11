
import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  ArrowRight,
  Database,
  RefreshCw,
  LayoutGrid,
  Zap,
  Globe,
  Binary,
  Cpu
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SetupWizard: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Protocol Selection",
      desc: "Select the Substrate-based networks you wish to provision on your Cypherock X1.",
      icon: Globe,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-500">
                <span className="font-black">P</span>
              </div>
              <h4 className="font-black text-white uppercase tracking-tight">Polkadot Relay</h4>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Native DOT support with Ed25519 signing and SS58 Prefix 0 compliance.</p>
            <div className="flex items-center gap-2 text-[8px] font-black text-green-500 uppercase">
              <CheckCircle2 className="w-3 h-3" /> Fully Audited
            </div>
          </div>
          <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-500">
                <span className="font-black">A</span>
              </div>
              <h4 className="font-black text-white uppercase tracking-tight">Acala Parachain</h4>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Advanced DeFi primitives, aUSD integration, and SS58 Prefix 10 support.</p>
            <div className="flex items-center gap-2 text-[8px] font-black text-green-500 uppercase">
              <CheckCircle2 className="w-3 h-3" /> Beta Available
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Address Derivation (SS58)",
      desc: "The X1 Vault will now derive your unique Substrate addresses using the Ed25519 curve.",
      icon: Binary,
      content: (
        <div className="space-y-6 pt-4">
          <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Hardware Derivation Path</p>
              <code className="text-xs text-cyan-500 font-mono">m/44'/354'/0'/0'/0'</code>
            </div>
            <div className="bg-[#0d0d11] p-5 rounded-2xl border border-zinc-800 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-zinc-500 uppercase">DOT Address Preview</span>
                  <span className="text-[8px] font-black text-zinc-700 uppercase">Prefix 0</span>
               </div>
               <p className="text-[11px] text-zinc-400 mono break-all">13UVJyLnbvST9XF9sFqndK8E9tTzTiyXhXhK72Tf56xS2KfE</p>
            </div>
          </div>
          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              <span className="text-white font-bold">Important:</span> Unlike EVM, Substrate addresses change based on the network prefix. CySync handles this normalization automatically.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Existential Deposit Rules",
      desc: "To keep your account active on-chain, you must maintain a minimum balance.",
      icon: Zap,
      content: (
        <div className="space-y-8 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Polkadot (DOT)</p>
              <p className="text-3xl font-black text-white">1.0 <span className="text-xs text-zinc-700">DOT</span></p>
            </div>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Acala (ACA)</p>
              <p className="text-3xl font-black text-white">0.1 <span className="text-xs text-zinc-700">ACA</span></p>
            </div>
          </div>
          <div className="p-8 bg-[#0d0d11] border-2 border-dashed border-zinc-800 rounded-[2.5rem] space-y-4">
             <div className="flex items-center gap-3">
               <Info className="w-5 h-5 text-indigo-500" />
               <h5 className="text-xs font-black text-white uppercase tracking-widest">What happens below minimum?</h5>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed">
               The network will automatically <span className="text-red-500 font-black underline">Reap</span> your account. All remaining dust is burned, and the account is removed from the state ledger. CySync will warn you before any transaction that risks reaping.
             </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setIsProcessing(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setIsProcessing(false);
      }, 800);
    } else {
      onComplete();
      onClose();
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-[#0a0a0c] border border-zinc-800 w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-[#0d0d11]/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{steps[step].title}</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] leading-none mt-1.5">Guided Substrate Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-zinc-700 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar min-h-[450px]">
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-lg">{steps[step].desc}</p>
          {steps[step].content}
        </div>

        <div className="p-10 border-t border-zinc-900 bg-[#0d0d11]/50 flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-cyan-500' : 'w-2 bg-zinc-800'}`} />
            ))}
          </div>
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            className="bg-white text-black font-black px-10 py-5 rounded-[2rem] flex items-center gap-3 uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all hover:bg-zinc-200"
          >
            {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : step === steps.length - 1 ? 'Finish Setup' : 'Continue'}
            {!isProcessing && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
