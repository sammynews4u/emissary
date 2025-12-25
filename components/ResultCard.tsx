
import React from 'react';
import { EmissaryOption } from '../types';

interface ResultCardProps {
  option: EmissaryOption;
  isSelected: boolean;
  onSelect: () => void;
  showSelectionState: boolean;
  onGenerateImage?: () => Promise<void>;
  isGeneratingImage?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  option, 
  isSelected, 
  onSelect, 
  showSelectionState,
  onGenerateImage,
  isGeneratingImage
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(option.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisualClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerateImage) {
      await onGenerateImage();
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Soft Touch': return 'bg-pink-100 text-pink-700';
      case 'Direct Route': return 'bg-blue-100 text-blue-700';
      case 'Icebreaker': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative bg-white rounded-2xl p-6 border transition-all cursor-pointer flex flex-col h-full ${
        isSelected 
          ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.02]' 
          : 'border-slate-100 shadow-md hover:shadow-lg hover:border-slate-300'
      }`}
    >
      {showSelectionState && isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm z-10">
          Viewing Preview
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getBadgeStyle(option.type)}`}>
          {option.type}
        </span>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
            title="Copy to clipboard"
          >
            {copied ? (
              <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {option.imageUrl ? (
        <div className="mb-4 aspect-square rounded-xl overflow-hidden border border-slate-100 relative group/img">
          <img src={option.imageUrl} alt="AI Visual" className="w-full h-full object-cover" />
          <button 
            onClick={handleVisualClick}
            disabled={isGeneratingImage}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity text-slate-500 hover:text-indigo-600 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      ) : (
        <button 
          onClick={handleVisualClick}
          disabled={isGeneratingImage}
          className={`mb-4 aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-slate-400 hover:text-indigo-500 group ${isGeneratingImage ? 'bg-slate-50' : ''}`}
        >
          {isGeneratingImage ? (
            <>
              <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing...</span>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Add AI Visual</span>
            </>
          )}
        </button>
      )}

      {option.subject && (
        <div className="mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</p>
          <p className="text-slate-900 font-semibold text-sm line-clamp-1 italic">"{option.subject}"</p>
        </div>
      )}
      
      <p className="text-slate-800 text-sm leading-relaxed mb-6 whitespace-pre-wrap font-medium flex-1 overflow-hidden text-ellipsis line-clamp-[8]">
        "{option.message}"
      </p>
      
      <div className="pt-4 border-t border-slate-50 mt-auto">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          Strategy: {option.description}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
