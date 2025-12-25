
import React from 'react';

const MEMES = [
  "https://images.unsplash.com/photo-1531256456869-ce942a665e80?q=80&w=300&auto=format&fit=crop", // Awkward look
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=300&auto=format&fit=crop", // Confused pug
  "https://images.unsplash.com/photo-1453227588063-bb302b62f50b?q=80&w=300&auto=format&fit=crop", // Grumpy dog
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=300&auto=format&fit=crop", // Cool cat
  "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?q=80&w=300&auto=format&fit=crop", // Little kittens
  "https://images.unsplash.com/photo-1535241749838-299277b6305f?q=80&w=300&auto=format&fit=crop", // Funny face
  "https://images.unsplash.com/photo-1517423440428-a5a00ad1e3e8?q=80&w=300&auto=format&fit=crop", // Happy dog
];

const MemeSlider: React.FC = () => {
  return (
    <div className="w-full overflow-hidden py-4 border-y border-slate-100 bg-white/50 mb-8">
      <div className="flex animate-marquee whitespace-nowrap gap-4">
        {[...MEMES, ...MEMES].map((url, idx) => (
          <div key={idx} className="inline-block h-32 w-48 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img src={url} alt="Funny Communication Meme" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/40 to-transparent">
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Awkwardness Level: {Math.floor(Math.random() * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MemeSlider;
