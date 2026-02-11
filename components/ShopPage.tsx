
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  Cpu, 
  Smartphone, 
  Usb, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  Calendar, 
  Award,
  ChevronRight,
  Package,
  ArrowRight,
  ExternalLink,
  Shield,
  Zap,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  History,
  Tag,
  CircleDot,
  CheckCircle2,
  Plus,
  RefreshCw,
  Box
} from 'lucide-react';

interface Props {
  currencySymbol: string;
  currencyRate: number;
}

type Tier = 'basic' | 'standard' | 'pro';

interface Accessory {
  id: string;
  name: string;
  badge: string;
  price: number;
  icon: any;
  color: string;
}

const ShopPage: React.FC<Props> = ({ currencySymbol, currencyRate }) => {
  const [selectedTier, setSelectedTier] = useState<Tier>('standard');
  const [addons, setAddons] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [liveSales, setLiveSales] = useState<{ id: number; name: string; city: string; time: string }[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const basePrices = {
    basic: 99,
    standard: 179,
    pro: 249
  };

  const addonPrices = {
    'sleeves': 28,
    'hardcase': 59,
    'warranty': 45
  };

  const accessories: Accessory[] = [
    { id: 'acc-1', name: "Carbon Fiber Sleeves", badge: "Elite", price: 28, icon: Shield, color: "text-zinc-400" },
    { id: 'acc-2', name: "Faraday HardCase", badge: "EMP Proof", price: 59, icon: Box, color: "text-cyan-500" },
    { id: 'acc-3', name: "Titanium Recovery Tag", badge: "Industrial", price: 120, icon: Tag, color: "text-amber-500" }
  ];

  const calculatePrice = (tier: Tier) => {
    let total = basePrices[tier];
    if (addons.includes('sleeves')) total += addonPrices.sleeves;
    if (addons.includes('hardcase')) total += addonPrices.hardcase;
    if (addons.includes('warranty')) total += addonPrices.warranty;
    
    // Add cart items
    cart.forEach(itemId => {
      const item = accessories.find(acc => acc.id === itemId);
      if (item) total += item.price;
    });

    return total / 0.012 * currencyRate; 
  };

  const toggleAddon = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const addToCart = (id: string) => {
    setCart(prev => [...prev, id]);
    setRecentlyAdded(id);
    setTimeout(() => setRecentlyAdded(null), 2000);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 5000);
    }, 3000);
  };

  const handlePreOrder = () => {
    // Simulate pre-order logic by defaulting to Pro tier and opening checkout focus
    setSelectedTier('pro');
    const scrollEl = document.getElementById('checkout-card');
    if (scrollEl) scrollEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulated live feed
  useEffect(() => {
    const names = ["Aravind", "Sarah", "Yuki", "Marco", "Elena", "Liam"];
    const cities = ["Dubai", "Singapore", "Zurich", "Bangalore", "New York", "London"];
    
    const interval = setInterval(() => {
      const newSale = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        time: "just now"
      };
      setLiveSales(prev => [newSale, ...prev].slice(0, 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-40">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative min-h-[500px] w-full rounded-[4rem] overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[#070709]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.1),_transparent)] z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center px-10 md:px-20 py-20 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Flash Sale: 20% OFF Limited Time</span>
          </div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85]">
              Own Your <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Security</span>
            </h1>
            <p className="text-zinc-400 text-xl font-medium max-w-lg leading-relaxed">
              Native Substrate Support. Ed25519 MPC Signing. The world's only seedless hardware vault is here.
            </p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={handlePreOrder}
              className="px-10 py-6 bg-white text-black font-black rounded-[2rem] uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
             >
               Pre-Order Now
             </button>
             <button 
              onClick={() => window.open('https://youtube.com', '_blank')}
              className="px-10 py-6 bg-zinc-900/80 backdrop-blur-md text-white font-black rounded-[2rem] border border-zinc-800 uppercase tracking-widest text-sm hover:bg-zinc-800 transition-all flex items-center gap-3"
             >
               Watch Unboxing <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Floating live sale feed */}
        <div className="absolute bottom-10 right-10 z-30 space-y-3 pointer-events-none">
          {liveSales.map(sale => (
            <div key={sale.id} className="bg-black/60 backdrop-blur-xl border border-zinc-800/50 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
               <div className="w-10 h-10 rounded-full bg-cyan-600/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-cyan-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-white uppercase leading-none">{sale.name} from {sale.city}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Purchased X1 Pro • {sale.time}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interactive Configurator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">I. Build your Vault</h2>
            <p className="text-zinc-500 font-medium">Select a security tier and customize your experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['basic', 'standard', 'pro'] as const).map(tier => (
              <button 
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${
                  selectedTier === tier 
                    ? 'bg-cyan-500/5 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.1)]' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                  <Shield className="w-20 h-20" />
                </div>
                <div className={`w-10 h-10 rounded-xl mb-6 flex items-center justify-center ${selectedTier === tier ? 'bg-cyan-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                  {tier === 'basic' ? <Smartphone className="w-5 h-5" /> : tier === 'standard' ? <Cpu className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">{tier}</h4>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                  {tier === 'basic' ? 'Core Security' : tier === 'standard' ? 'Full Setup' : 'Lifetime Defense'}
                </p>
                {selectedTier === tier && (
                  <div className="absolute bottom-4 right-4 animate-in zoom-in">
                    <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-[#111115] border border-zinc-800 rounded-[3rem] p-10 space-y-8">
             <h4 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
               <Package className="w-5 h-5" /> Custom Add-ons
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'sleeves', name: "Card Sleeves", icon: Shield, price: 28 },
                  { id: 'hardcase', name: "Vault HardCase", icon: Box, price: 59 },
                  { id: 'warranty', name: "Extended Warranty", icon: Award, price: 45 }
                ].map(addon => (
                  <div 
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col gap-4 ${
                      addons.includes(addon.id) ? 'bg-indigo-500/10 border-indigo-500/40' : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                       <addon.icon className={`w-5 h-5 ${addons.includes(addon.id) ? 'text-indigo-400' : 'text-zinc-700'}`} />
                       <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${addons.includes(addon.id) ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-800'}`}>
                          {addons.includes(addon.id) && <Check className="w-3 h-3 text-white" />}
                       </div>
                    </div>
                    <div>
                       <p className="text-xs font-black text-white uppercase">{addon.name}</p>
                       <p className="text-[10px] text-zinc-600 font-bold">+{currencySymbol}{(addon.price / 0.012 * currencyRate).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-10" id="checkout-card">
          <div className="bg-gradient-to-br from-[#111115] to-[#0a0a0c] border-2 border-cyan-500/20 rounded-[3.5rem] p-12 shadow-2xl space-y-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
               <Cpu className="w-64 h-64 text-cyan-500" />
             </div>
             
             <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Vault Configuration</p>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Cypherock X1 {selectedTier}</h3>
             </div>

             <div className="space-y-4 relative z-10 border-y border-zinc-900/50 py-8">
                <div className="flex justify-between items-center text-sm font-black uppercase text-zinc-400 tracking-widest">
                   <span>Base Tier</span>
                   <span className="text-white">{currencySymbol}{(basePrices[selectedTier] / 0.012 * currencyRate).toLocaleString()}</span>
                </div>
                {addons.map(a => (
                  <div key={a} className="flex justify-between items-center text-[10px] font-bold uppercase text-indigo-400 tracking-widest animate-in slide-in-from-left-4">
                     <span className="flex items-center gap-2"><Check className="w-3 h-3" /> {a} upgrade</span>
                     <span>+ {currencySymbol}{(addonPrices[a as keyof typeof addonPrices] / 0.012 * currencyRate).toFixed(2)}</span>
                  </div>
                ))}
                {cart.map((itemId, idx) => {
                  const item = accessories.find(acc => acc.id === itemId);
                  return (
                    <div key={`${itemId}-${idx}`} className="flex justify-between items-center text-[10px] font-bold uppercase text-amber-400 tracking-widest animate-in slide-in-from-left-4">
                       <span className="flex items-center gap-2"><Check className="w-3 h-3" /> {item?.name}</span>
                       <span>+ {currencySymbol}{(item!.price / 0.012 * currencyRate).toFixed(2)}</span>
                    </div>
                  );
                })}
             </div>

             <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Aggregate Total</p>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-6xl font-black text-white tracking-tighter">{currencySymbol}{calculatePrice(selectedTier).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
                   <span className="text-zinc-700 text-lg font-black uppercase">{selectedTier} Bundle</span>
                </div>
             </div>

             {checkoutSuccess ? (
                <div className="w-full py-7 bg-green-600 text-white font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 transition-all animate-in zoom-in">
                  <CheckCircle2 className="w-6 h-6" /> Order Confirmed
                </div>
             ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-7 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl shadow-cyan-900/40 transition-all active:scale-95 flex items-center justify-center gap-4 relative z-10"
                >
                  {isCheckingOut ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ShoppingBag className="w-6 h-6" />} 
                  {isCheckingOut ? 'Processing Securely...' : 'Proceed to Checkout'}
                </button>
             )}

             <div className="flex items-center justify-center gap-8 relative z-10 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <ShieldCheck className="w-10 h-10" />
                <Lock className="w-10 h-10" />
                <History className="w-10 h-10" />
             </div>
          </div>
        </div>
      </section>

      {/* 3. Advanced Comparison Matrix */}
      <section className="space-y-10">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight uppercase">II. Performance Comparison</h2>
              <p className="text-zinc-500 font-medium">Why millions trust Cypherock over traditional mnemonic-based wallets.</p>
            </div>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center gap-3"
            >
              {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showComparison ? 'Hide Detailed Specs' : 'Detailed Tech Specs'}
            </button>
         </div>

         {showComparison && (
           <div className="bg-[#111115] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-10 duration-700">
              <table className="w-full text-left">
                 <thead className="bg-zinc-950/50">
                    <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                       <th className="p-8">Feature Domain</th>
                       <th className="p-8">Traditional Hardware</th>
                       <th className="p-8 text-cyan-500 bg-cyan-500/5">Cypherock X1</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-900/50 text-xs font-medium text-zinc-500">
                    {[
                      { f: "Key Recovery", t: "24-Word Paper Mnemonic", c: "4 Distributed MPC Shards" },
                      { f: "Security Model", t: "Single Chip Dependency", c: "SSS-Based Hardware Distribution" },
                      { f: "Substrate Support", t: "Limited (Mostly Ledger Live)", c: "Native SS58 & SCALE Parsing" },
                      { f: "Onboarding", t: "Complex Word Verification", c: "Zero-Seed NFC Pairing" },
                      { f: "Trust Level", t: "Varies by OEM", c: "FIPS 140-2 Level 3 Secure Elements" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-900/20 transition-colors">
                         <td className="p-8 text-white font-black uppercase tracking-tight">{row.f}</td>
                         <td className="p-8">{row.t}</td>
                         <td className="p-8 text-cyan-400 font-bold bg-cyan-500/[0.02]">{row.c}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         )}
      </section>

      {/* 4. Industry Certifications Section */}
      <section className="p-16 bg-[#111115] border border-zinc-800 rounded-[4rem] relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 left-0 p-12 opacity-[0.03] group-hover:scale-105 transition-transform duration-[10s]">
            <Award className="w-64 h-64 text-indigo-500" />
         </div>
         
         <div className="relative z-10 text-center space-y-12">
            <div className="space-y-4">
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Certified Grade Security</h3>
               <p className="text-zinc-500 font-medium max-w-xl mx-auto">Cypherock X1 exceeds global standards for financial hardware security.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { l: "FIPS 140-2", d: "Cryptographic Module Validation", c: "Level 3" },
                 { l: "EAL5+", d: "Common Criteria Certification", c: "Standard" },
                 { l: "Ed25519", d: "Native Elliptic Curve Implementation", c: "Verified" },
                 { l: "AES-256", d: "Military-Grade Shard Encryption", c: "Standard" }
               ].map((cert, i) => (
                 <div key={i} className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] space-y-3 hover:border-cyan-500/40 transition-all group/cert">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-4">{cert.l}</p>
                    <p className="text-white font-black uppercase text-sm">{cert.c}</p>
                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-tight group-hover/cert:text-cyan-500 transition-colors">{cert.d}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Accessories Quick Shop */}
      <section className="space-y-10">
        <h2 className="text-4xl font-black tracking-tight text-white uppercase flex items-center gap-4">
           <Sparkles className="w-8 h-8 text-amber-500" /> Advanced Accessories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {accessories.map((item, i) => (
             <div key={item.id} className="bg-[#111115] border border-zinc-800 rounded-[3rem] p-8 space-y-8 hover:border-zinc-700 transition-all shadow-xl group">
                <div className="h-48 bg-zinc-950 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-zinc-900 transition-colors relative overflow-hidden">
                   <item.icon className={`w-20 h-20 opacity-20 absolute -right-4 -bottom-4 group-hover:scale-125 transition-transform duration-700 ${item.color}`} />
                   <item.icon className={`w-16 h-16 group-hover:scale-110 transition-transform ${item.color}`} />
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h4 className="text-xl font-black text-white uppercase leading-none">{item.name}</h4>
                         <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Professional Grade</span>
                      </div>
                      <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] font-black rounded-lg uppercase">{item.badge}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-zinc-400">5.0</span>
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                   </div>
                   <div className="flex items-center justify-between pt-4">
                      <p className="text-2xl font-black text-white">{currencySymbol}{(item.price / 0.012 * currencyRate).toFixed(2)}</p>
                      <button 
                        onClick={() => addToCart(item.id)}
                        className={`p-3 rounded-xl transition-all shadow-lg active:scale-90 ${
                          recentlyAdded === item.id 
                            ? 'bg-green-600 text-white' 
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-600 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                         {recentlyAdded === item.id ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 6. High-Trust Footer */}
      <section className="p-12 bg-gradient-to-br from-indigo-900/20 to-cyan-900/10 border border-cyan-500/30 rounded-[4rem] flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_0_100px_rgba(6,182,212,0.1)]">
         <div className="space-y-4 text-center md:text-left">
            <h3 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">Security is <br/> a Choice.</h3>
            <p className="text-zinc-400 font-medium max-w-lg">Join 50,000+ pioneers securing their assets with the gold standard of hardware-based MPC.</p>
         </div>
         <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
               <ShieldCheck className="w-6 h-6 text-green-500" />
               <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">30-Day Money-Back Guarantee</p>
            </div>
            <a href="https://www.cypherock.com/shop" target="_blank" rel="noopener noreferrer">
              <button className="w-full px-12 py-6 bg-white text-black font-black rounded-[2.5rem] uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4">
                 Go to Official Website <ExternalLink className="w-5 h-5" />
              </button>
            </a>
         </div>
      </section>
    </div>
  );
};

export default ShopPage;
