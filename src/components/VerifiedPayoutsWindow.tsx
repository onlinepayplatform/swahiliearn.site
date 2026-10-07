import React from 'react';
import { VerifiedAfricanPayout } from '../types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VerifiedPayoutsWindowProps {
  payouts: VerifiedAfricanPayout[];
}

export const VerifiedPayoutsWindow: React.FC<VerifiedPayoutsWindowProps> = ({ payouts }) => {
  // Duplicate for seamless infinite loop scroll
  const displayList = [...payouts, ...payouts];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/5 overflow-hidden">
      
      {/* Window Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-300 animate-ping" />
          <div className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <span>MALIPO YALIYOTHIBITISHWA AFRIKA MASHARIKI (LIVE VERIFIED PAYOUTS)</span>
          </div>
        </div>
        <div className="hidden sm:inline-flex text-[11px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-50 uppercase tracking-wider">
          Mataifa Yanayoongea Kiswahili
        </div>
      </div>

      {/* Infinite Vertical Scrolling Container */}
      <div className="relative h-64 overflow-hidden bg-slate-50/70 p-3">
        {/* Subtle top & bottom fade gradient masks */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />

        <div className="animate-marquee-vertical hover:[animation-play-state:paused] space-y-2.5">
          {displayList.map((item, idx) => (
            <div
              key={item.id + '-' + idx}
              className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {item.countryFlag}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>{item.name} Amelipwa</span>
                    <span className="font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {item.amount}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>kutokea {item.location}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-700">via {item.method}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Imethibitishwa</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 text-center text-[11px] font-medium text-slate-500">
        Inaonyesha malipo ya papo hapo kwa wazungumzaji wa Kiswahili Tanzania, Kenya, Uganda, DRC, Rwanda & Burundi.
      </div>

    </div>
  );
};
