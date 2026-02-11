
import React, { useState } from 'react';
import { Contact, ChainType } from '../types';
import { UserPlus, Search, Edit2, Trash2, BookUser, X, Check, Globe, Shield, Filter } from 'lucide-react';
import { TOKENS } from '../constants';

interface Props {
  contacts: Contact[];
  onUpdate: (contacts: Contact[]) => void;
}

const AddressBook: React.FC<Props> = ({ contacts, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterChain, setFilterChain] = useState<ChainType | 'ALL'>('ALL');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    chain: ChainType.POLKADOT
  });

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterChain === 'ALL' || c.chain === filterChain;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this contact?')) {
      onUpdate(contacts.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = formData.name.trim();
    const trimmedAddress = formData.address.trim();

    if (!trimmedName || !trimmedAddress) {
      return;
    }

    if (isEditing) {
      onUpdate(contacts.map(c => c.id === isEditing ? { ...c, name: trimmedName, address: trimmedAddress, chain: formData.chain } : c));
      setIsEditing(null);
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: trimmedName,
        address: trimmedAddress,
        chain: formData.chain
      };
      onUpdate([...contacts, newContact]);
    }
    setFormData({ name: '', address: '', chain: ChainType.POLKADOT });
    setShowAddForm(false);
  };

  const startEdit = (contact: Contact) => {
    setIsEditing(contact.id);
    setFormData({ name: contact.name, address: contact.address, chain: contact.chain });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Address Book</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your trusted cross-chain recipients.</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(true); setIsEditing(null); setFormData({ name: '', address: '', chain: ChainType.POLKADOT }); }}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-cyan-900/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Add New Contact
        </button>
      </div>

      <div className="bg-[#0d0d11] border border-zinc-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800/60 bg-zinc-900/20 flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-[#0a0a0c] p-1.5 border border-zinc-800 rounded-2xl">
            {(['ALL', ...Object.values(ChainType)] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterChain(type)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterChain === type 
                    ? 'bg-zinc-800 text-white shadow-inner' 
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-zinc-900/50">
          {filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 divide-y divide-zinc-900/50">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="p-8 flex items-center justify-between hover:bg-zinc-900/10 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all shadow-inner">
                      <BookUser className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-xl tracking-tight text-white">{contact.name}</h3>
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: `${TOKENS[contact.chain].color}15`, color: TOKENS[contact.chain].color }}
                        >
                          <Globe className="w-3 h-3" />
                          {TOKENS[contact.chain].name}
                        </div>
                        <span className="text-xs text-zinc-500 mono font-medium">{contact.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => startEdit(contact)}
                      className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all active:scale-90"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="p-3 bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 rounded-xl text-zinc-500 hover:text-red-500 transition-all active:scale-90"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-32 text-center">
              <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-inner">
                <BookUser className="w-12 h-12 text-zinc-800" />
              </div>
              <h3 className="text-xl font-bold text-zinc-400">No contacts found</h3>
              <p className="text-zinc-600 text-sm mt-2">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAddForm(false)} />
          <form 
            onSubmit={handleSubmit}
            className="relative bg-[#0d0d11] border border-zinc-800 w-full max-w-md rounded-[2.2rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-cyan-600/15 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{isEditing ? 'Modify Contact' : 'New Contact'}</h2>
              </div>
              <button type="button" onClick={() => setShowAddForm(false)} className="p-2 text-zinc-600 hover:text-white transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">ALIAS / NAME</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. bitcoin"
                  className="w-full bg-[#0a0a0c] border border-zinc-800/80 rounded-2xl py-4.5 px-6 focus:border-cyan-500/50 outline-none font-bold placeholder:text-zinc-800 transition-all text-white text-base"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">SS58 ADDRESS</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Paste SS58 address here..."
                  className="w-full bg-[#0a0a0c] border border-zinc-800/80 rounded-2xl py-4.5 px-6 focus:border-cyan-500/50 outline-none mono text-sm placeholder:text-zinc-800 resize-none transition-all text-zinc-200 leading-relaxed"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">NETWORK TYPE</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.values(ChainType).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, chain: type })}
                      className={`py-4 px-4 rounded-2xl border transition-all font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 ${
                        formData.chain === type 
                          ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                          : 'border-zinc-800 bg-[#0a0a0c] text-zinc-600 hover:border-zinc-700'
                      }`}
                    >
                      {formData.chain === type && <Check className="w-3.5 h-3.5" />}
                      {TOKENS[type].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-5 rounded-2xl border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs hover:bg-zinc-800/50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-5 rounded-2xl bg-[#00bcd4] hover:bg-[#00acc1] text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#00bcd4]/20 active:scale-95 border border-[#00bcd4]/30"
              >
                {isEditing ? 'Save Changes' : 'Confirm Entry'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
