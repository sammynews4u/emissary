
import React, { useState } from 'react';

interface ContactModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; subject: string; message: string }) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
        <header className="bg-slate-50 px-8 py-6 flex justify-between items-center border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Direct Support</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect with our team</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-8">
          {showSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900">Message Received</h3>
              <p className="text-slate-500 font-medium">An emissary will review your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm transition-all text-slate-900"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm transition-all text-slate-900"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm transition-all text-slate-900"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">How can we help?</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm transition-all resize-none text-slate-900"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-slate-200"
              >
                {isSubmitting ? "Transmitting..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
