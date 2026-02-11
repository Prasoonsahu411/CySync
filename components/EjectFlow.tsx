
import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Fingerprint, 
  RefreshCw, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  Skull,
  Lock,
  ChevronLeft,
  AlertTriangle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EjectFlow: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'warning' | 'reconstruction' | 'mnemonic'>('warning');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mnemonic = "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual";

  const handleStartReconstruction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('mnemonic');
    }, 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative bg-[#0d0d11] border border-zinc-800/60 w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-zinc-800/40 flex justify-between items-center bg-zinc-950/20 shrink-0">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${step === 'mnemonic' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {step === 'warning' ? <ShieldAlert className="w-7 h-7" /> : step === 'mnemonic' ? <Lock className="w-7 h-7" /> : <RefreshCw className="w-7 h-7 animate-spin" />}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Emergency Mnemonic Recovery</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] leading-none mt-1.5">System Eject Protocol (BIP39)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white transition-all bg-zinc-900/50 rounded-xl hover:scale-110 active:scale-90">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-14 lg:p-16 custom-scrollbar">
          {step === 'warning' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center border-4 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                  <Skull className="w-12 h-12 text-red-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Irreversible Action</h3>
                  <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                    By ejecting, you are choosing to reconstruct your private key as a <span className="text-red-400 font-bold underline underline-offset-4 decoration-red-500/30">24-word seed phrase</span>. 
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 bg-red-500/[0.03] border border-red-500/10 rounded-[2rem] space-y-4">
                    <div className="p-3 bg-red-500/10 rounded-xl w-fit"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">
                      "Exposing your seed to a network-connected computer breaks the air-gap security model."
                    </p>
                 </div>
                 <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2rem] space-y-4">
                    <div className="p-3 bg-zinc-800 rounded-xl w-fit"><Smartphone className="w-5 h-5 text-zinc-500" /></div>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      "Requires **X1 Vault (PIN)** + **1 X1 Card (NFC)** for 2-of-5 reconstruction."
                    </p>
                 </div>
              </div>

              <button 
                onClick={() => setStep('reconstruction')}
                className="w-full py-7 bg-red-600 hover:bg-red-500 text-white font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl shadow-red-900/40 transition-all flex items-center justify-center gap-4 active:scale-95 text-lg"
              >
                Proceed to Reconstruction <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {step === 'reconstruction' && (
            <div className="space-y-12 py-10 text-center animate-in fade-in duration-700 max-w-xl mx-auto">
              <div className="relative inline-block">
                <div className="w-36 h-36 md:w-44 md:h-44 border-8 border-red-500/10 border-t-red-500 rounded-full animate-spin duration-[2s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#0d0d11] rounded-full flex items-center justify-center border border-zinc-800">
                  <Smartphone className="w-12 h-12 text-red-500 animate-bounce" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tight">Handshake Calibration</h3>
                <p className="text-zinc-500 font-medium text-lg max-w-md mx-auto">Place your **X1 Card** against the NFC reader to provide the second MPC Shard.</p>
              </div>
              <div className="pt-8 flex justify-center items-center gap-8 md:gap-14">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                      <ShieldCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vault (OK)</span>
                 </div>
                 <div className="h-[2px] w-12 bg-zinc-800 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500 animate-pulse" />
                 </div>
                 <div className="flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800">
                      <Smartphone className="w-8 h-8 text-zinc-700" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Awaiting Card</span>
                 </div>
              </div>
              <button 
                onClick={handleStartReconstruction}
                disabled={isProcessing}
                className="w-full py-6 border-2 border-zinc-800 hover:bg-zinc-800/50 text-zinc-500 font-black rounded-[2rem] uppercase tracking-widest transition-all active:scale-95"
              >
                {isProcessing ? 'Aggregating Shard Entropy...' : 'Simulate Card NFC Tap'}
              </button>
            </div>
          )}

          {step === 'mnemonic' && (
            <div className="space-y-12 animate-in zoom-in-95 duration-1000 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-amber-500/10 rounded-[2.2rem] flex items-center justify-center text-amber-500 border-2 border-amber-500/20 shadow-2xl shadow-amber-900/10">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white tracking-tighter">Secret Recovered</h3>
                  <p className="text-zinc-500 font-medium text-lg">Write down these 24 words. <span className="text-zinc-300 font-bold italic">Do not store them digitally.</span></p>
                </div>
              </div>

              <div className="relative group min-h-[400px] flex items-center justify-center bg-[#0a0a0c] border border-zinc-800/40 rounded-[3rem] p-2 md:p-6 overflow-hidden">
                <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 p-8 md:p-12 transition-all duration-1000 w-full ${!showWords ? 'blur-3xl grayscale opacity-10 select-none scale-105' : 'scale-100 opacity-100'}`}>
                  {mnemonic.split(' ').map((word, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 md:p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800/40 shadow-inner hover:bg-zinc-800/60 transition-all group/word">
                      <span className="text-[11px] font-black text-zinc-700 w-5 transition-colors group-hover/word:text-amber-500/40">{i+1}</span>
                      <span className="text-sm md:text-base font-bold text-white mono tracking-tight">{word}</span>
                    </div>
                  ))}
                </div>
                {!showWords && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <button 
                      onClick={() => setShowWords(true)}
                      className="group/reveal px-12 py-7 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-[2.5rem] uppercase tracking-[0.3em] shadow-2xl shadow-amber-900/40 flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
                    >
                      <Eye className="w-7 h-7 group-hover/reveal:animate-pulse" /> Reveal Recovery Seed
                    </button>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-8 flex items-center gap-2">
                       <Fingerprint className="w-3 h-3" /> End-to-End Encryption Verified
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button 
                  onClick={handleCopy}
                  className="flex-1 py-6 bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 text-zinc-500 font-black rounded-[2rem] uppercase tracking-widest transition-all flex items-center justify-center gap-4 active:scale-95 hover:text-white"
                >
                  {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-6 bg-white hover:bg-zinc-100 text-black font-black rounded-[2rem] uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 text-lg"
                >
                  Confirm & Eject App
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EjectFlow;
