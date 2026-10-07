import React from 'react';
import { MessageCircle, Phone, ExternalLink, Radio, MessageSquare } from 'lucide-react';

interface CustomerCareBannerProps {
  whatsappChannelUrl?: string;
  smsNumber?: string;
  whatsappSupportUrl?: string;
}

export const CustomerCareBanner: React.FC<CustomerCareBannerProps> = ({
  whatsappChannelUrl = 'https://whatsapp.com/channel/0029VbEGCJ3EgGfNE6THN73q',
  smsNumber = '0743697677',
  whatsappSupportUrl = 'https://wa.me/message/EP72QM4VJRTIA1'
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>HUDUMA KWA WATEJA 24/7 (CUSTOMER CARE BADGE)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Wasiliana na Timu Yetu ya Msaada Wakati Wowote
          </h3>
          <p className="text-xs text-slate-300">
            Chagua njia unayopendelea kuwasiliana nasi kwa usaidizi wa haraka na mwongozo wa jukwaa.
          </p>
        </div>

        {/* 3 Customer Care Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. WhatsApp Channel */}
          <a
            href={whatsappChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp Channel
                </div>
                <div className="text-[11px] text-slate-400">
                  Jiunge na channel rasmi ya taarifa
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 transition-colors" />
          </a>

          {/* 2. Send Normal text (SMS) */}
          <a
            href={`sms:${smsNumber}?body=${encodeURIComponent('Habari, ninaomba maelekezo kuhusu Swahili Earn.')}`}
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-blue-400 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                  Send Normal Text
                </div>
                <div className="text-[11px] font-mono text-slate-300 font-bold">
                  {smsNumber}
                </div>
              </div>
            </div>
            <Phone className="w-4 h-4 text-slate-400 group-hover:text-blue-300 transition-colors" />
          </a>

          {/* 3. WhatsApp Direct Chat */}
          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 hover:border-[#25D366] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold shadow-md">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-emerald-200 transition-colors">
                  WhatsApp Support
                </div>
                <div className="text-[11px] text-emerald-200">
                  Ongea moja kwa moja WhatsApp
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-300" />
          </a>

        </div>

      </div>
    </div>
  );
};
