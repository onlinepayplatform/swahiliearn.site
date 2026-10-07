import React from 'react';
import { INITIAL_VERIFIED_PAYOUTS } from '../lib/defaultProfiles';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  return (
    <div className="bg-[#0F172A] text-slate-200 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 pr-4 font-semibold text-emerald-400 whitespace-nowrap shrink-0 border-r border-slate-700">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>MALIPO YALIYOTHIBITISHWA:</span>
        </div>

        {/* Marquee ticker */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5 text-slate-300">
          {INITIAL_VERIFIED_PAYOUTS.map((item, idx) => (
            <div key={item.id + '-' + idx} className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{item.countryFlag}</span>
              <span className="font-bold text-white">{item.name}</span>
              <span className="text-emerald-300 font-extrabold font-mono">
                {item.amount}
              </span>
              <span className="text-slate-400">({item.method} · {item.location})</span>
              <span className="text-slate-500 font-light text-[10px] ml-1">{item.timeAgo}</span>
              <span className="text-slate-600 ml-4">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
