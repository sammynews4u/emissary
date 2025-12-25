
import React, { useState, useEffect } from 'react';

const QUOTES = [
  "Words are the windows to the soul.",
  "Kindness is the language which the deaf can hear and the blind can see.",
  "Communication is the solvent of all problems.",
  "Speak only if it improves upon the silence.",
  "The art of communication is the language of leadership.",
  "Half the world is composed of people who have something to say and can't, and the other half who have nothing to say and keep on saying it.",
  "Wise men speak because they have something to say; Fools because they have to say something."
];

const Header: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  const formattedDate = dateTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const formattedTime = dateTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="py-8 px-4 text-center relative">
      {/* Left: Quotable Quote */}
      <div className="absolute top-0 left-4 hidden md:flex flex-col items-start opacity-60 max-w-[200px] text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thought of the Day</span>
        <p className="text-[10px] font-medium text-slate-600 italic leading-tight mt-1 transition-all duration-1000">
          "{QUOTES[quoteIndex]}"
        </p>
      </div>

      {/* Right: System Time */}
      <div className="absolute top-0 right-4 flex flex-col items-end opacity-60">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Time</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-900 tabular-nums">{formattedTime}</span>
        </div>
        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{formattedDate}</span>
      </div>

      <div className="inline-flex items-center justify-center p-3 mb-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
        Digital Emissary
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-light">
        Your voice, refined. Turn awkward thoughts into meaningful connections with social intelligence.
      </p>
    </header>
  );
};

export default Header;
