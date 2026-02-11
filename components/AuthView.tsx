
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Fingerprint, 
  Cpu, 
  Wifi, 
  CheckCircle2, 
  Lock, 
  Key, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Layers,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface Props {
  status: 'uninitialized' | 'locked';
  onComplete: () => void;
}

const AuthView: React.FC<Props> = ({ status, onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardTaps, setCardTaps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Signup Flow Steps as per PRD
  const signupSteps = [
    { title: "Device Authentication", desc: "Verifying factory-signed certificate for X1 Vault authenticity.", icon: ShieldCheck },
    { title: "Entropy Generation", desc: "Generating 256-bit offline master key entropy.", icon: Cpu },
    { title: "Shard Distribution", desc: "Distributing SSS shards to 4 physical X1 Cards via NFC.", icon: Layers },
    { title: "App Sync", desc: "Exporting XPUBs to track Substrate balances securely.", icon: RefreshCw },
  ];

  const handleNextSignup = () => {
    setError(null);
    setIsProcessing(true);
    let p = 0;
    
    // Simulate the specific work for step 2 (Shard Distribution)
    if (step === 2 && cardTaps < 4) {
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setCardTaps(prev => prev + 1);
          setProgress(0);
        }
      }, 50);
      return;
    }

    // Standard phase progress
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setProgress(0);
        if (step < signupSteps.length - 1) {
          setStep(s => s + 1);
        } else {
          onComplete();
        }
      }
    }, 30);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 1200);
  };

  if (status === 'locked') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0a0a0c] flex items-center justify-center p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative w-full max-w-md space-y-12 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center mx-auto border border-zinc-800 shadow-2xl relative">
              <Lock className="w-10 h-10 text-zinc-500" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-[#0a0a0c]">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-white">Unlock Vault</h1>
              <p className="text-zinc-500 text-sm font-medium">Hardware Interlock Active</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all duration-300 ${pin.length > i ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-zinc-800 bg-zinc-900/30 text-zinc-800'}`}>
                  {pin.length > i ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((num, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    if (num === 'back') setPin(prev => prev.slice(0, -1));
                    else if (typeof num === 'number' && pin.length < 4) setPin(prev => prev + num);
                  }}
                  className={`py-5 rounded-2xl font-black text-xl transition-all active:scale-90 ${num === '' ? 'opacity-0 cursor-default' : 'bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800 hover:text-white text-zinc-400'}`}
                >
                  {num === 'back' ? '←' : num}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={pin.length < 4 || isProcessing}
              className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl shadow-cyan-900/40 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
              {isProcessing ? 'Authenticating...' : 'Enter PIN'}
            </button>
          </form>

          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 flex items-start gap-4 text-left">
            <ShieldCheck className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed">
              Authentication is performed on air-gapped device RAM. PIN is never shared with the host machine.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Signup Flow
  const currentStep = signupSteps[step];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0c] flex items-center justify-center p-4 md:p-10 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative w-full max-w-4xl bg-[#0d0d11] border border-zinc-800/60 rounded-[3rem] p-8 md:p-14 shadow-2xl flex flex-col gap-10 md:gap-14 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-cyan-600 rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-cyan-600/30">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">X1 Vault Setup</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Seedless Hardware Onboarding</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-4 rounded-2xl text-right">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Initialization Phase</p>
            <p className="text-2xl font-black text-cyan-500">{step + 1} <span className="text-zinc-700 text-sm">/ {signupSteps.length}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Step 0{step + 1} Active</span>
              </div>
              <h3 className="text-4xl font-black text-white leading-tight tracking-tighter">{currentStep.title}</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">{currentStep.desc}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                <span>Phase Progress</span>
                <span className="text-cyan-500">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 shadow-inner">
                <div className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleNextSignup}
                disabled={isProcessing}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                  step === 2 && cardTaps < 4 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20' 
                    : 'bg-white hover:bg-zinc-200 text-black shadow-zinc-900/40'
                }`}
              >
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {step === 2 && cardTaps < 4 ? <Smartphone className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    {step === signupSteps.length - 1 ? 'Go to Dashboard' : step === 2 && cardTaps < 4 ? `Tap Card 0${cardTaps + 1} to Distribute` : 'Confirm and Proceed'}
                  </>
                )}
              </button>
              
              {step === 2 && (
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${cardTaps >= i ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-zinc-900'}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 md:p-12 bg-[#0a0a0c] rounded-[3rem] border border-zinc-800/40 shadow-inner relative overflow-hidden group min-h-[400px]">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05),_transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             {step === 2 ? (
               <div className="space-y-8 text-center animate-in zoom-in-95">
                  <div className="relative inline-block">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-dashed transition-all duration-500 ${isProcessing ? 'border-indigo-500/50 rotate-180' : 'border-zinc-800 rotate-0'}`}>
                      <Smartphone className={`w-14 h-14 ${isProcessing ? 'text-indigo-500 animate-pulse' : 'text-zinc-700'}`} />
                    </div>
                    {isProcessing && <Wifi className="w-8 h-8 text-indigo-500 absolute -top-2 -right-2 animate-ping" />}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">Card 0{cardTaps + 1} Interaction</p>
                    <p className="text-xs text-zinc-600 font-medium">Place card near NFC reader for Shard write.</p>
                  </div>
               </div>
             ) : (
               <div className="space-y-10 text-center animate-in zoom-in-95">
                 <div className={`w-32 h-32 rounded-[2.5rem] bg-zinc-900/40 border-2 flex items-center justify-center mx-auto transition-all duration-700 ${isProcessing ? 'border-cyan-500/50 rotate-12 scale-110 shadow-2xl shadow-cyan-900/20' : 'border-zinc-800 rotate-0'}`}>
                    <StepIcon className={`w-16 h-16 transition-colors duration-700 ${isProcessing ? 'text-cyan-400' : 'text-zinc-700'}`} />
                 </div>
                 <div className="space-y-2">
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">Vault State</p>
                    <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">{isProcessing ? 'Busy: Writing to RAM' : 'Idle: Awaiting Command'}</p>
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/40">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Overall Workflow Compliance</span>
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{Math.round(((step + 1) / signupSteps.length) * 100)}%</span>
           </div>
           <div className="grid grid-cols-4 gap-4">
             {signupSteps.map((s, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-1000 ${i < step ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : i === step ? 'bg-zinc-700' : 'bg-zinc-900'}`} />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
