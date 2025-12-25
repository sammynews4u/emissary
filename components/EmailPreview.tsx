
import React from 'react';
import { EmissaryOption } from '../types';

interface EmailPreviewProps {
  option: EmissaryOption;
  receiver: string;
  sender: string;
  isAnonymous: boolean;
  receiverEmail?: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ option, receiver, sender, isAnonymous, receiverEmail }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="mx-auto text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Email Preview
        </div>
      </div>

      <div className="p-6 space-y-3 border-b border-slate-100">
        <div className="flex items-center text-sm">
          <span className="w-16 text-slate-400 font-medium">To:</span>
          <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
            {receiver} {receiverEmail ? `<${receiverEmail}>` : ''}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-16 text-slate-400 font-medium">From:</span>
          <span className="text-slate-900">
            {isAnonymous ? 'Someone Thinking of You' : sender} (via Digital Emissary)
          </span>
        </div>
        <div className="flex items-start text-sm pt-2">
          <span className="w-16 text-slate-400 font-medium">Subject:</span>
          <span className="text-slate-900 font-bold text-base">{option.subject || '(No subject)'}</span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {option.imageUrl && (
          <div className="w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
            <img src={option.imageUrl} alt="Message Visual" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="text-slate-800 leading-relaxed font-light min-h-[120px]">
          <p className="whitespace-pre-wrap">{option.message}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
