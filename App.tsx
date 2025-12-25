
import React from 'react';
import Header from './components/Header';
import MessageForm from './components/MessageForm';
import ResultCard from './components/ResultCard';
import EmailPreview from './components/EmailPreview';
import WhatsAppPreview from './components/WhatsAppPreview';
import AdminDashboard from './components/AdminDashboard';
import ContactModal from './components/ContactModal';
import MemeSlider from './components/MemeSlider';
import InformationModal from './components/InformationModal';
import { MessageInputs, EmissaryResponse, DeliveryMethod, SendPreference, DispatchLog, Category, SupportRequest } from './types';
import { generateEmissaryMessages, generateEmissaryVisual } from './services/geminiService';

declare var PaystackPop: any;

const AdSpace: React.FC<{ type: 'horizontal' | 'vertical', className?: string }> = ({ type, className }) => (
  <div className={`bg-slate-50 border border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-4 relative overflow-hidden group transition-all hover:bg-white hover:border-indigo-100 ${className} ${type === 'horizontal' ? 'h-32 w-full' : 'h-full min-h-[300px] w-full'}`}>
    <div className="absolute top-2 right-4 text-[8px] font-black text-slate-300 uppercase tracking-widest">Sponsored</div>
    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
      <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Your Placement Here</p>
    <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold group-hover:text-indigo-400 transition-colors">advertise@digital-emissary.com</p>
  </div>
);

const App: React.FC = () => {
  const [results, setResults] = React.useState<EmissaryResponse | null>(null);
  const [lastInputs, setLastInputs] = React.useState<MessageInputs | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sentSuccess, setSentSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imageLoadingIndex, setImageLoadingIndex] = React.useState<number | null>(null);
  
  const [globalLogs, setGlobalLogs] = React.useState<DispatchLog[]>([]);
  const [supportRequests, setSupportRequests] = React.useState<SupportRequest[]>([]);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [isContactOpen, setIsContactOpen] = React.useState(false);

  // New Info Modal States
  const [infoModal, setInfoModal] = React.useState<'about' | 'terms' | 'privacy' | null>(null);

  const handleGenerate = async (inputs: MessageInputs) => {
    setLoading(true);
    setSentSuccess(false);
    setError(null);
    try {
      const response = await generateEmissaryMessages(inputs);
      setResults(response);
      setLastInputs(inputs);
      setSelectedOptionIndex(0); 
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Error generating messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (index: number) => {
    if (!results) return;
    setImageLoadingIndex(index);
    try {
      const option = results.options[index];
      const imageUrl = await generateEmissaryVisual(option.message, option.type);
      
      const newOptions = [...results.options];
      newOptions[index] = { ...option, imageUrl };
      setResults({ ...results, options: newOptions });
    } catch (err: any) {
      console.error("Image generation failed:", err);
      setError("Failed to generate AI visual. Please try again.");
    } finally {
      setImageLoadingIndex(null);
    }
  };

  const dispatchToAdmin = (selected: any, inputs: MessageInputs) => {
    const newLog: DispatchLog = {
      id: Math.random().toString(36).substr(2, 9),
      recipient: inputs.receiver,
      recipientContact: inputs.deliveryMethod === DeliveryMethod.EMAIL 
        ? (inputs.receiverEmail || 'N/A') 
        : (inputs.receiverPhone || 'N/A'),
      senderName: inputs.senderName,
      isAnonymous: inputs.isAnonymous,
      rawTruth: inputs.keyDetails,
      finalMessage: selected.message,
      category: inputs.category,
      method: inputs.deliveryMethod,
      preference: inputs.sendPreference,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
      amount: inputs.sendPreference === SendPreference.EMISSARY ? 500 : 0,
      imageUrl: selected.imageUrl
    };
    setGlobalLogs(prev => [newLog, ...prev]);
    setSentSuccess(true);
    setSending(false);
  };

  const handleSupportSubmit = (data: { name: string; email: string; subject: string; message: string }) => {
    const newRequest: SupportRequest = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      status: 'New'
    };
    setSupportRequests(prev => [newRequest, ...prev]);
  };

  const handleSend = async () => {
    if (!lastInputs || !results) return;
    setSending(true);
    const selected = results.options[selectedOptionIndex];
    const isEmissaryDelivery = lastInputs.sendPreference === SendPreference.EMISSARY;

    if (isEmissaryDelivery) {
      const handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', 
        email: lastInputs.receiverEmail || 'emissary@digital-emissary.com',
        amount: 500 * 100, 
        currency: 'NGN',
        callback: (response: any) => {
          dispatchToAdmin(selected, lastInputs);
        },
        onClose: () => {
          setSending(false);
        }
      });
      handler.openIframe();
    } else {
      if (lastInputs.deliveryMethod === DeliveryMethod.WHATSAPP) {
        const phone = lastInputs.receiverPhone?.replace(/\D/g, '');
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(selected.message)}`;
        window.open(waUrl, '_blank');
      } else if (lastInputs.deliveryMethod === DeliveryMethod.EMAIL) {
        const mailtoUrl = `mailto:${lastInputs.receiverEmail}?subject=${encodeURIComponent(selected.subject || '')}&body=${encodeURIComponent(selected.message)}`;
        window.location.href = mailtoUrl;
      }
      dispatchToAdmin(selected, lastInputs); 
    }
  };

  const updateLogStatus = (id: string, status: DispatchLog['status']) => {
    setGlobalLogs(prev => prev.map(log => log.id === id ? { ...log, status } : log));
  };

  const updateSupportStatus = (id: string, status: SupportRequest['status']) => {
    setSupportRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const deleteLog = (id: string) => {
    setGlobalLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 relative">
      <Header />
      
      <main className="space-y-12 mt-8">
        {/* Ad Placement #1: Top */}
        <AdSpace type="horizontal" className="mb-4" />
        
        {/* Meme Slider */}
        <MemeSlider />

        <MessageForm onGenerate={handleGenerate} isLoading={loading} />
        
        {error && (
          <div className="bg-red-50 text-red-700 p-5 rounded-3xl border border-red-100 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
             <div className="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
             </div>
            <div className="flex-1">
              <p className="font-bold text-sm">System Interruption</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Ad Placement #2: Middle (Before Results) */}
        <AdSpace type="horizontal" className="my-8" />

        {results && lastInputs && (
          <section id="results" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900">Three Distinct Vibes</h2>
              <p className="text-slate-500 font-medium">Add a conceptual AI visual to enhance your message.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.options.map((option, index) => (
                <ResultCard 
                  key={index} 
                  option={option} 
                  isSelected={selectedOptionIndex === index}
                  onSelect={() => setSelectedOptionIndex(index)}
                  showSelectionState={true}
                  onGenerateImage={() => handleGenerateImage(index)}
                  isGeneratingImage={imageLoadingIndex === index}
                />
              ))}
            </div>

            <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 space-y-8 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Final Preview</h3>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              {lastInputs.deliveryMethod === DeliveryMethod.EMAIL ? (
                <EmailPreview 
                  option={results.options[selectedOptionIndex]} 
                  receiver={lastInputs.receiver}
                  sender={lastInputs.senderName}
                  isAnonymous={lastInputs.isAnonymous}
                  receiverEmail={lastInputs.receiverEmail}
                />
              ) : (
                <WhatsAppPreview 
                  option={results.options[selectedOptionIndex]} 
                  receiver={lastInputs.receiver}
                  receiverPhone={lastInputs.receiverPhone}
                />
              )}

              <div className="flex flex-col items-center gap-4">
                {!sentSuccess ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    <button 
                      onClick={handleSend}
                      className={`px-12 py-5 rounded-2xl font-bold text-white shadow-2xl transition-all flex items-center gap-3 ${
                        lastInputs.sendPreference === SendPreference.EMISSARY 
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' 
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                      } hover:scale-105 active:scale-95`}
                    >
                      {sending ? (
                        <span className="flex items-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                          {lastInputs.sendPreference === SendPreference.EMISSARY 
                            ? "Hand over to Emissary (500 ₦)" 
                            : `Send as ${lastInputs.senderName || 'Self'}`}
                        </>
                      )}
                    </button>
                    {lastInputs.sendPreference === SendPreference.EMISSARY && (
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] animate-pulse">
                        Pay 500 ₦ via Paystack to dispatch
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="bg-emerald-100 text-emerald-700 px-10 py-5 rounded-[2rem] font-bold animate-in zoom-in flex items-center gap-3 shadow-sm border border-emerald-200">
                      <div className="p-1.5 bg-emerald-500 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {lastInputs.sendPreference === SendPreference.EMISSARY ? "Transmitted for Emissary Delivery" : "Success!"}
                    </div>
                  </div>
                )}
                <button onClick={() => setResults(null)} className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors py-2 px-4">Start New Draft</button>
              </div>
            </div>
          </section>
        )}

        {/* Ad Placement #3: Bottom */}
        <AdSpace type="horizontal" className="mt-12" />
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200/50 flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
           <button 
            onClick={() => setInfoModal('about')}
            className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2"
          >
            About Us
          </button>
           <button 
            onClick={() => setInfoModal('terms')}
            className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2"
          >
            Terms of Service
          </button>
           <button 
            onClick={() => setInfoModal('privacy')}
            className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2"
          >
            Privacy Policy
          </button>
           <button 
            onClick={() => setIsContactOpen(true)}
            className="text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2"
          >
            Contact
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-slate-300 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2 px-4 bg-slate-50/50 rounded-full border border-slate-100/50"
          >
            Staff Access
          </button>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">© Digital Emissary Operations</p>
        </div>
      </footer>

      {isContactOpen && (
        <ContactModal onClose={() => setIsContactOpen(false)} onSubmit={handleSupportSubmit} />
      )}

      {isAdminOpen && (
        <AdminDashboard 
          logs={globalLogs} 
          supportRequests={supportRequests}
          onUpdateStatus={updateLogStatus}
          onUpdateSupportStatus={updateSupportStatus}
          onDeleteLog={deleteLog}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Organizational Content Modals */}
      {infoModal === 'about' && (
        <InformationModal 
          title="About the Emissary" 
          subtitle="Our Mission & Philosophy" 
          onClose={() => setInfoModal(null)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          <h3 className="text-lg font-black text-slate-900 uppercase">The Gap Between Heart and Voice</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Digital Emissary was founded on a simple realization: the hardest messages to send are often the most important. Whether it's confessing a crush, resigning from a job, or setting a difficult boundary, fear often prevents us from being our best selves.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            We use social intelligence to bridge this gap. Our platform takes your raw, awkward, or intimidating thoughts and refines them into polished communication. We don't change your message; we simply clarify your intent.
          </p>
          <h3 className="text-lg font-black text-slate-900 uppercase pt-4">Why the "Emissary"?</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Sometimes, a direct message carries too much personal "noise." Our Emissary Delivery service acts as a neutral third-party mediator, delivering your words with grace and professional distance, allowing the receiver to focus on the message rather than the tension.
          </p>
        </InformationModal>
      )}

      {infoModal === 'terms' && (
        <InformationModal 
          title="Terms of Service" 
          subtitle="The Rules of Engagement" 
          onClose={() => setInfoModal(null)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
        >
          <h3 className="text-lg font-black text-slate-900 uppercase">1. Use of Service</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            By using Digital Emissary, you agree to generate and send messages that are lawful and respectful. Our service must not be used for harassment, bullying, or deception.
          </p>
          <h3 className="text-lg font-black text-slate-900 uppercase pt-4">2. Responsibility for Content</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The AI generates suggestions based on your input. You are ultimately responsible for any message you choose to send. Digital Emissary holds no liability for the social or professional outcomes of your communications.
          </p>
          <h3 className="text-lg font-black text-slate-900 uppercase pt-4">3. Payments & Fees</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our "Emissary Delivery" service involves a flat fee of 500 ₦, processed via Paystack. Payments are for the successful dispatch of your message via our servers and are non-refundable once the message has been transmitted.
          </p>
        </InformationModal>
      )}

      {infoModal === 'privacy' && (
        <InformationModal 
          title="Privacy Policy" 
          subtitle="Data & Discretion" 
          onClose={() => setInfoModal(null)}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
        >
          <h3 className="text-lg font-black text-slate-900 uppercase">Your "Raw Truth" is Secure</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The text you provide as your "Raw Truth" is processed exclusively to generate your message options using Google's Gemini API. We do not use your private communications to train models or for advertising.
          </p>
          <h3 className="text-lg font-black text-slate-900 uppercase pt-4">Data Retention</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            If you use "Emissary Delivery," we log the final message and recipient contact info to ensure successful dispatch. These logs are stored in a secure admin environment and can be deleted upon request via our support channel.
          </p>
          <h3 className="text-lg font-black text-slate-900 uppercase pt-4">Third-Party Services</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            We use Paystack for payment processing. We never see or store your credit card or bank details. For image generation, we use the Gemini 2.5 Flash model, which receives only the context of your polished message.
          </p>
        </InformationModal>
      )}
    </div>
  );
};

export default App;
