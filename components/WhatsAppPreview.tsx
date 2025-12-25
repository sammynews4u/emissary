
import React from 'react';
import { EmissaryOption } from '../types';

interface WhatsAppPreviewProps {
  option: EmissaryOption;
  receiver: string;
  receiverPhone?: string;
}

const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ option, receiver, receiverPhone }) => {
  return (
    <div className="bg-[#E5DDD5] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold leading-tight">{receiver}</h3>
          <p className="text-[#9DE1FE] text-xs">online</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="p-4 min-h-[200px] space-y-4">
        {option.imageUrl && (
          <div className="bg-white rounded-lg p-1.5 shadow-sm relative max-w-[85%] self-start animate-in slide-in-from-left-4">
            <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
            <div className="aspect-square rounded-md overflow-hidden bg-slate-50">
              <img src={option.imageUrl} alt="AI Visual" className="w-full h-full object-cover" />
            </div>
            <div className="px-2 pt-2 pb-1 text-[10px] text-slate-400 text-right uppercase font-black tracking-widest">Visual Attachment</div>
          </div>
        )}
        <div className="bg-white rounded-lg p-3 shadow-sm relative max-w-[85%] self-start text-sm text-slate-800">
          {!option.imageUrl && <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>}
          <p className="whitespace-pre-wrap">{option.message}</p>
          <div className="text-right mt-1">
            <span className="text-[10px] text-slate-400">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Input Area (Mock) */}
      <div className="bg-[#F0F0F0] p-2 flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full px-4 py-2 text-slate-300 text-sm italic">
          Type a message
        </div>
        <div className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
