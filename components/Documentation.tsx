
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Zap, 
  Eye, 
  CheckCircle2, 
  Workflow, 
  Shield, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Terminal, 
  History, 
  ClipboardCheck,
  Layers,
  Code,
  FileText,
  Target,
  ListChecks,
  Search,
  Book,
  PenTool,
  Flag,
  Lightbulb,
  AlertCircle,
  Cpu,
  Smartphone,
  Globe,
  Lock,
  Binary,
  Activity,
  Award,
  ChevronRight,
  Monitor,
  Server,
  Microchip,
  GanttChartSquare,
  Bug,
  AlertOctagon,
  Clock,
  Briefcase,
  GitBranch,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compliance' | 'stories' | 'mapping' | 'document'>('compliance');

  const UserStoriesView = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3"><Users className="w-6 h-6 text-cyan-500" /> Onboarding & Accounts</h3>
          <div className="space-y-4">
            {[
              { s: "Story 1: Native Address Generation", u: "As a Polkadot investor, I want to generate a DOT-specific SS58 address on my Cypherock X1 so that I can receive funds without exposing seed.", ac: ["Ed25519 curve derivation", "SS58 Prefix 0 compliance", "OLED address verification"] },
              { s: "Story 2: Multi-Chain Support", u: "As a DeFi user, I want to add an Acala (ACA) account alongside DOT to manage my portfolio in one place.", ac: ["Add Asset support for ACA", "Distinct derivation paths", "Unified overview"] }
            ].map((item, i) => (
              <div key={i} className="bg-[#111115] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-zinc-700 transition-all">
                <p className="text-xs font-black text-cyan-500 uppercase tracking-widest">{item.s}</p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">"{item.u}"</p>
                <ul className="space-y-2">{item.ac.map((ac, j) => (<li key={j} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase"><CheckCircle2 className="w-3 h-3 text-green-500" /> {ac}</li>))}</ul>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3"><Zap className="w-6 h-6 text-amber-500" /> Transaction Signing</h3>
          <div className="space-y-4">
            {[
              { s: "Story 3: Transparent Verification", u: "As a user, I want to see exact DOT amount and recipient on my Vault screen to verify I am not targeted by hijacking.", ac: ["SCALE extrinsic parsing", "Multi-screen confirmation"] },
              { s: "Story 4: Secure Shard Signing", u: "As a user, I want to sign my DOT transaction by tapping cards so signing key is reconstructed momentarily in RAM.", ac: ["2-of-5 SSS reconstruction", "Immediate memory zeroing post-sig"] }
            ].map((item, i) => (
              <div key={i} className="bg-[#111115] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-zinc-700 transition-all">
                <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{item.s}</p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">"{item.u}"</p>
                <ul className="space-y-2">{item.ac.map((ac, j) => (<li key={j} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase"><CheckCircle2 className="w-3 h-3 text-green-500" /> {ac}</li>))}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-[3rem] p-10 space-y-6">
        <h3 className="text-xl font-black text-white flex items-center gap-3"><Shield className="w-6 h-6 text-indigo-400" /> Safety & Guardrails</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { s: "Story 5: Existential Deposit Warning", u: "As a DOT holder, I want a warning if a transfer drops my balance below 1.0 DOT to prevent account reaping.", ac: ["Balance calculation: (Total - Amount - Fee)", "transfer_allow_death toggle for 'Send All'"] },
            { s: "Story 6: Transaction Expiry Awareness", u: "As a user, I want to be notified if my transaction takes too long to sign so I understand why it might fail.", ac: ["Mortal extrinsic construction (64 blocks)", "Reconstruction prompt after 5 mins"] }
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0c] border border-zinc-800 rounded-3xl p-8 space-y-4 shadow-inner">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{item.s}</p>
              <p className="text-sm text-zinc-400 leading-relaxed italic">"{item.u}"</p>
              <ul className="space-y-2">{item.ac.map((ac, j) => (<li key={j} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase"><CheckCircle2 className="w-3 h-3 text-green-500" /> {ac}</li>))}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FullDocumentView = () => (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-40">
      {/* 1. EXECUTIVE HEADER */}
      <section className="space-y-8 text-center pt-10 border-b border-zinc-900 pb-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-cyan-600/10 rounded-[2.5rem] flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-2xl">
            <Microchip className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">
              PRD: <span className="text-cyan-500">Substrate Native</span>
            </h1>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.8em] ml-2">Polkadot & Acala Integration • Cypherock X1</p>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM ANALYSIS */}
      <section className="space-y-12">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4">
           <AlertOctagon className="w-8 h-8 text-amber-500" /> II. Problem Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Why DOT and Acala?</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed">These tokens underpin Polkadot’s foundational chain and its flagship DeFi parachain. Supporting them natively meets Cypherock user demand for secure, multi-chain DeFi asset management without relying on third-party middleware that could compromise the air-gap.</p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Technical Challenges</h4>
                 <ul className="space-y-3">
                    {[
                      "SS58 addressing demands careful chain-specific encoding/decoding.",
                      "SCALE Codec compactness makes secure, low-footprint parsing challenging on embedded hardware.",
                      "Ed25519 key derivation (SLIP-10) diverges from legacy Bitcoin/Ethereum pathways.",
                      "Existential Deposit exposes users to accidental account loss/reaping."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-xs text-zinc-500">
                        <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
           <div className="bg-[#0a0a0c] border border-zinc-800 rounded-[3rem] p-10 flex flex-col justify-center space-y-6">
              <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Banking Vision</p>
                 <p className="text-xs text-zinc-500 font-medium italic leading-relaxed">"Seamless, robust Substrate support advances Cypherock’s lead in decentralized, user-governed financial security."</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 p-6 bg-cyan-600/5 border border-cyan-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">MPC Focus</p>
                    <p className="text-[9px] text-zinc-600 mt-2">Zero assembled-key memory exposure.</p>
                 </div>
                 <div className="flex-1 p-6 bg-green-600/5 border border-green-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">WYSIWYS</p>
                    <p className="text-[9px] text-zinc-600 mt-2">Hardware-level verification of all data.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. FUNCTIONAL REQUIREMENTS */}
      <section className="space-y-12">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4">
           <ListChecks className="w-8 h-8 text-cyan-500" /> III. Functional Requirements
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Firmware Card */}
           <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Microchip className="w-24 h-24 text-cyan-500" /></div>
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><Terminal className="w-5 h-5 text-cyan-500" /> Firmware (X1)</h3>
              <ul className="space-y-5 relative z-10">
                 {[
                   { t: "SS58 Derivation", d: "On-device Ed25519 per SLIP-10 for prefix 0 and 10." },
                   { t: "SCALE Codec", d: "Full parsing module for extrinsic decoding: recipient, amount, fees." },
                   { t: "MPC Signing", d: "Secure Ed25519 signing without assembling full keys in memory." },
                   { t: "Safety Checks", d: "ED and Mortal Era verification with OLED previews." }
                 ].map((item, i) => (
                   <li key={i} className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{item.t}</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{item.d}</p>
                   </li>
                 ))}
              </ul>
           </div>

           {/* CySync Card */}
           <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Monitor className="w-24 h-24 text-indigo-500" /></div>
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><Smartphone className="w-5 h-5 text-indigo-500" /> Desktop (CySync)</h3>
              <ul className="space-y-5 relative z-10">
                 {[
                   { t: "Wallet Lifecycle", d: "Distinct tabs and color-coded cues for DOT/ACA accounts." },
                   { t: "Real-time Sync", d: "Balance/History polling via RPC with automatic failover." },
                   { t: "Tx Builder", d: "Dynamic fee estimation, nonce lookup, and ED guardrails." },
                   { t: "Error UX", d: "User-centric messaging for network or hardware aborts." }
                 ].map((item, i) => (
                   <li key={i} className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{item.t}</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{item.d}</p>
                   </li>
                 ))}
              </ul>
           </div>

           {/* SDK Card */}
           <div className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Database className="w-24 h-24 text-amber-500" /></div>
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><Layers className="w-5 h-5 text-amber-500" /> Shared SDK</h3>
              <ul className="space-y-5 relative z-10">
                 {[
                   { t: "Coin Metadata", d: "Extended coins.json with Substrate prefixes and RPC nodes." },
                   { t: "Utility Modules", d: "Standardized SS58 encoding/decoding and amount formatting." },
                   { t: "Protocol Buffers", d: "Synchronized message formats across all ecosystem layers." },
                   { t: "Test Vectors", d: "Central registry for RFC 8032 and Substrate cross-validation." }
                 ].map((item, i) => (
                   <li key={i} className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{item.t}</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{item.d}</p>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* 4. CORNER CASES - EXHAUSTIVE LIST */}
      <section className="space-y-12">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4">
           <Bug className="w-8 h-8 text-red-500" /> IV. Corner Cases (Full Coverage)
        </h2>
        <div className="bg-[#0a0a0c] border border-zinc-800 rounded-[3rem] overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-zinc-900">
              {[
                { c: "Invalid SS58 Format", s: "Reject incorrect prefix, invalid checksum, or wrong length on both firmware and desktop." },
                { c: "Unsupported Pallet", s: "Firmware parser detects unknown Pallet ID and safely rejects the extrinsic." },
                { c: "ED Violation", s: "Prevent account reaping unless user toggles 'Force send max' with double hardware confirmation." },
                { c: "Mortal Era Expiry", s: "Prompt user to refresh and re-sign if the 64-block window has passed since construction." },
                { c: "RPC Unavailability", s: "Automatic failover across cluster registry with in-app connectivity alerts." },
                { c: "Partial SCALE Payload", s: "Independent validation of payload length and compact integer structures." },
                { c: "Shard Reconstruction Fail", s: "Tamper detection during MPC/TSS; abort and log cryptographic error." },
                { c: "Dust Amounts", s: "Block and display minimum viable send value to prevent fee/funds evaporation." }
              ].map((item, i) => (
                <div key={i} className="p-8 space-y-2 hover:bg-zinc-900/30 transition-colors">
                   <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{item.c}</p>
                   <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.s}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TECHNICAL IMPLEMENTATION APPENDIX */}
      <section className="space-y-16">
        <div className="space-y-4">
           <h2 className="text-4xl font-black text-white tracking-tight uppercase">V. Technical Appendix</h2>
           <p className="text-zinc-500 font-medium max-w-2xl">Low-level implementation specifications for engineering leads.</p>
        </div>

        <div className="space-y-12">
           {/* Memory Budget */}
           <div className="bg-[#111115] border border-zinc-800 rounded-[3rem] p-12 space-y-10">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><Binary className="w-6 h-6 text-cyan-500" /> Firmware Resource Budget (ARM Cortex-M4)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { l: "Stack Usage", v: "Peak ≤ 4 KB" },
                   { l: "Heap Allocation", v: "0 (Static Only)" },
                   { l: "Max Payload", v: "2048 bytes" },
                   { l: "Crypto Latency", v: "≤ 250ms" }
                 ].map((item, i) => (
                   <div key={i} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.l}</p>
                      <p className="text-xl font-black text-cyan-500">{item.v}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Signing Payload */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Canonical Signing Payload</h4>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-zinc-900/50">
                          <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                             <th className="p-6">Field</th>
                             <th className="p-6">Type</th>
                             <th className="p-6">Purpose</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-900 text-[11px] font-medium text-zinc-400">
                          <tr><td className="p-6 text-white font-black">Method</td><td className="p-6">Call</td><td className="p-6">Balances.transfer</td></tr>
                          <tr><td className="p-6 text-white font-black">Era</td><td className="p-6">Era</td><td className="p-6">64-block window</td></tr>
                          <tr><td className="p-6 text-white font-black">Nonce</td><td className="p-6">Compact</td><td className="p-6">Replay protection</td></tr>
                          <tr><td className="p-6 text-white font-black">Tip</td><td className="p-6">Compact</td><td className="p-6">Priority fee</td></tr>
                          <tr><td className="p-6 text-white font-black">Genesis</td><td className="p-6">H256</td><td className="p-6">Chain isolation</td></tr>
                       </tbody>
                    </table>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div className="p-8 bg-indigo-600/5 border border-indigo-600/20 rounded-[2.5rem] space-y-6">
                    <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Existential Deposit Logic</h4>
                    <ul className="space-y-4">
                       <li className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <p className="text-xs text-zinc-500 leading-relaxed"><span className="text-white font-bold">Default:</span> Use <code className="text-indigo-400">balances.transferKeepAlive</code>. Logic fails at protocol level if balance &lt; 1 DOT.</p>
                       </li>
                       <li className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <p className="text-xs text-zinc-500 leading-relaxed"><span className="text-white font-bold">Advanced:</span> Allow <code className="text-indigo-400">balances.transfer</code> (account death) only via explicit "Force Reap" switch with double confirmation.</p>
                       </li>
                    </ul>
                 </div>
                 <div className="p-8 bg-green-600/5 border border-green-600/20 rounded-[2.5rem] space-y-4">
                    <h4 className="text-sm font-black text-green-500 uppercase tracking-widest">Cryptographic Validation</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">End-to-end Ed25519 implementation verified against <span className="text-white font-bold">RFC 8032</span> test vectors and official Polkadot-JS SDK derivation outputs.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. SUCCESS METRICS */}
      <section className="space-y-12">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4">
           <Activity className="w-8 h-8 text-green-500" /> VI. Success Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { l: "Technical Success", v: "≥99%", d: "Sign & Broadcast completion rate." },
             { l: "Signing Latency", v: "<12s", d: "Median card reconstruction time." },
             { l: "Address Accuracy", v: "100%", d: "Zero derivation checksum errors." },
             { l: "Account Safety", v: "0", d: "Unintended ED-reaped accounts." }
           ].map((m, i) => (
             <div key={i} className="p-8 bg-[#111115] border border-zinc-800 rounded-[2rem] text-center space-y-2">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{m.l}</p>
                <p className="text-3xl font-black text-white tracking-tight">{m.v}</p>
                <p className="text-[9px] text-zinc-700 font-bold uppercase">{m.d}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 7. MILESTONES & NARRATIVE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8 space-y-12">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">VII. Milestones & Delivery</h2>
            <div className="space-y-6">
               {[
                 { w: "Week 1", m: "Research & Architecture", d: "Confirm Secure MPC/TSS flow, SS58/Ed25519 derivation, SCALE parser specs." },
                 { w: "Week 2", m: "Firmware Implementation", d: "Complete address derivation, SCALE parsing, negative-path error handling." },
                 { w: "Week 3", m: "Desktop Integration", d: "Tabbed UI, RPC integration, ED guardrails, device WYSIWYS sync." },
                 { w: "Week 4", m: "Final Testing & QA", d: "Full testnet validation (Westend/Mandala), bugfixes, final documentation." }
               ].map((step, i) => (
                 <div key={i} className="flex gap-8 group">
                    <div className="w-20 shrink-0 text-right">
                       <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{step.w}</p>
                    </div>
                    <div className="relative flex-1 pb-10 border-l border-zinc-900 pl-10">
                       <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 group-hover:bg-cyan-500 transition-colors" />
                       <h4 className="text-sm font-black text-white uppercase mb-2 tracking-tight">{step.m}</h4>
                       <p className="text-xs text-zinc-500 leading-relaxed">{step.d}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="p-10 bg-gradient-to-br from-cyan-600/10 to-indigo-600/5 border border-cyan-500/20 rounded-[3rem] space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><PenTool className="w-32 h-32" /></div>
               <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><GraduationCap className="w-6 h-6" /> User Narrative</h3>
               <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                 "Sarah, a cautious Polkadot DeFi investor, was long unsettled by unexpected account reaping. With CySync’s new native flow, she receives guided onboarding explaining ED risks and sees every critical transaction detail on-device before signing. Her portfolio updates instantly—trustless security with a no-surprises user experience."
               </p>
               <div className="pt-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-cyan-500"><Award className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Persona Path</span>
               </div>
            </div>
         </div>
      </section>

      {/* DEFINITION OF DONE */}
      <section className="bg-amber-500/5 border border-amber-500/20 rounded-[3.5rem] p-16 relative overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><CheckCircle2 className="w-40 h-40 text-amber-500" /></div>
        <div className="w-20 h-20 bg-amber-500/10 rounded-[2.2rem] flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
          <Award className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-white uppercase tracking-tight">Definition of Done (DoD)</h3>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Project moves to "Closed" when code is peer-reviewed by Senior Firmware/SDK Lead, <span className="text-white font-bold">air-gap integrity is verified</span> (no private shards in logs), and <span className="text-white font-bold">cypherock-common Protobufs</span> are updated and synced across the ecosystem.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter flex items-center gap-4 text-white uppercase">
            <BookOpen className="w-16 h-16 text-cyan-500" />
            Project Substrate
          </h1>
          <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed font-medium">Core protocol specifications for Polkadot (DOT) and Acala (ACA) integration.</p>
        </div>
        <div className="flex gap-2 bg-[#111115] p-2 rounded-3xl border border-zinc-800">
          {(['compliance', 'stories', 'mapping', 'document'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'document' ? 'Full PRD' : tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'compliance' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[ { label: 'SCALE Parsing', status: 'Verified', icon: Database, color: 'text-green-500', bg: 'bg-green-500/10' }, { label: 'Ed25519 MPC', status: 'Active', icon: RefreshCw, color: 'text-green-500', bg: 'bg-green-500/10' }, { label: 'WYSIWYS', status: 'L4 Security', icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' }, { label: 'Acala DeFi', status: 'Mapped', icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-500/10' } ].map((item, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border border-zinc-800 ${item.bg} flex flex-col gap-4 shadow-xl`}><div className="flex justify-between items-start"><item.icon className={`w-6 h-6 ${item.color}`} /><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" /></div><div><p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">{item.label}</p><p className={`text-sm font-black ${item.color}`}>{item.status}</p></div></div>
            ))}
          </section>
          <section className="bg-[#111115] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center text-cyan-500"><CheckCircle2 className="w-7 h-7" /></div><h2 className="text-2xl font-black text-white uppercase tracking-tight">Protocol Compliance</h2></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6"><h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"><Workflow className="w-4 h-4" /> Core Architecture</h3><ul className="space-y-5">{ [ { t: "SS58 Normalization", d: "Prefix 0 (DOT) and 10 (ACA) verified correctly via air-gapped SS58 logic." }, { t: "MPC Threshold Logic", d: "2-of-5 shard reconstruction validated in secure hardware RAM." } ].map((item, i) => (<li key={i} className="flex gap-4 group"><div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-green-500" /></div><div><p className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase">{item.t}</p><p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.d}</p></div></li>))}</ul></div>
              <div className="space-y-6"><h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"><Shield className="w-4 h-4" /> Implementation Proofs</h3><ul className="space-y-5">{ [ { t: "Existential Deposit Block", d: "Real-time UI block for transfers dropping balance below 1.0 DOT." }, { t: "SCALE Extrinsic Decoding", d: "Displays recipient and amount directly on X1 OLED screen." } ].map((item, i) => (<li key={i} className="flex gap-4 group"><div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-green-500" /></div><div><p className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase">{item.t}</p><p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.d}</p></div></li>))}</ul></div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'stories' && <UserStoriesView />}
      
      {activeTab === 'mapping' && (
        <div className="bg-[#111115] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-700">
          <div className="p-8 border-b border-zinc-800 bg-zinc-900/30"><h3 className="text-xl font-black text-white flex items-center gap-3"><Terminal className="w-6 h-6 text-cyan-500" /> Logic Layer Mapping</h3></div>
          <table className="w-full text-left">
            <thead className="bg-zinc-950"><tr className="text-[10px] font-black text-zinc-600 uppercase tracking-widest"><th className="p-6">Feature</th><th className="p-6">Execution Context</th><th className="p-6">Logic Path</th></tr></thead>
            <tbody className="text-xs font-medium text-zinc-400 divide-y divide-zinc-900/50">{ [ { f: "Transaction Construct", l: "Desktop (App)", d: "src/services/blockchain/substrate" }, { f: "SS58 Encoding", l: "Hardware (X1)", d: "apps/polkadot/address.c" }, { f: "SCALE Decoding", l: "Hardware (X1)", d: "apps/polkadot/transaction.c" }, { f: "Signing (Ed25519)", l: "Hardware (X1)", d: "common/crypto/ed25519.c" } ].map((row, i) => (<tr key={i} className="hover:bg-zinc-900/20 transition-colors"><td className="p-6 text-white font-black">{row.f}</td><td className="p-6"><span className="px-3 py-1 bg-zinc-900 rounded-lg text-zinc-500">{row.l}</span></td><td className="p-6 font-mono text-cyan-500/80">{row.d}</td></tr>))}</tbody>
          </table>
        </div>
      )}

      {activeTab === 'document' && <FullDocumentView />}
    </div>
  );
};

export default Documentation;
