
import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, QrCode, Info, Globe, Download } from 'lucide-react';
import { Token } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  address: string;
}

const ReceiveModal: React.FC<Props> = ({ isOpen, onClose, token, address }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-10">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-[#0d0d11] border border-zinc-800/60 w-full max-w-xl max-h-[90vh] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-zinc-800/60 bg-[#0d0d11] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: token.color }}>
              <Download className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight text-white">Receive {token.ticker}</h2>
              <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-1">{token.name} Network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 custom-scrollbar">
          {/* Simulated QR Code Section */}
          <div className="flex justify-center">
            <div className="p-4 md:p-6 bg-white rounded-[2rem] shadow-2xl relative group">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-zinc-100 flex items-center justify-center overflow-hidden rounded-xl border border-zinc-200">
                 <QrCode className="w-32 h-32 md:w-40 md:h-40 text-black opacity-90" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] cursor-pointer" onClick={handleCopy}>
                <div className="p-3 bg-black rounded-full text-white shadow-xl">
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Hardware Verified SS58 Address</p>
              <div 
                onClick={handleCopy}
                className="bg-[#0a0a0c] border border-zinc-800/60 rounded-3xl p-5 md:p-6 relative group cursor-pointer hover:border-cyan-500/30 transition-all shadow-inner"
              >
                <p className="text-xs md:text-sm font-bold text-zinc-300 mono break-all leading-relaxed pr-8">
                  {address}
                </p>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 group-hover:text-cyan-500 transition-colors">
                   {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
               <div className="p-3 md:p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Prefix {token.prefix}</span>
               </div>
               <div className="p-3 md:p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 flex items-center gap-3">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">{token.name} Core</span>
               </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 md:p-5 flex gap-4 items-start">
              <Info className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[9px] md:text-[10px] text-zinc-500 font-medium leading-relaxed">
                Only send <span className="text-white font-bold">{token.ticker}</span> assets to this address. Incorrect network assets will result in permanent loss.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-zinc-800/60 bg-[#0d0d11] shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 md:py-5 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest hover:bg-zinc-700 transition-all active:scale-95 shadow-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
