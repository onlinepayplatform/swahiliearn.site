import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Headphones, Clock } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappUrl?: string;
  lang: 'sw' | 'en';
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappUrl = 'https://wa.me/message/EP72QM4VJRTIA1',
  lang
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
        
        {/* Unread teaser tooltip if closed */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="mb-2 bg-white text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-emerald-200 cursor-pointer flex items-center gap-1.5 animate-bounce hover:bg-emerald-50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{lang === 'sw' ? 'Msaada wa WhatsApp 24/7' : '24/7 WhatsApp Support'}</span>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-hidden"
          aria-label="Wasiliana na WhatsApp"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 fill-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                1
              </span>
            </>
          )}
        </button>

        {/* Popup Card */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
            
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">SWAHILI EARN Support</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{lang === 'sw' ? 'Wasaidizi wako hewani' : 'Online agents active'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-200 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 bg-slate-50 space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 shadow-2xs space-y-1">
                <p className="font-semibold text-slate-900">
                  {lang === 'sw' ? 'Habari! Karibu SWAHILI EARN' : 'Hello! Welcome to SWAHILI EARN'}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {lang === 'sw'
                    ? 'Unahitaji msaada kuhusu kuanza mazungumzo na wazungu au mwongozo wa jukwaa? Bonyeza hapa chini tuongee moja kwa moja WhatsApp.'
                    : 'Need guidance starting Swahili conversations with foreign learners? Tap below to chat with our support team on WhatsApp.'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>Jibu la wastani: Chini ya dakika 2</span>
                </div>
              </div>

              {/* Quick Prompt Questions */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'sw' ? 'Maswali ya Haraka:' : 'Quick Questions:'}
                </div>
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent('Habari, ninaomba mwongozo wa kuanza kufundisha Kiswahili')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  👉 {lang === 'sw' ? 'Jinsi ya kuanza kufundisha' : 'How to start tutoring learners'}
                </a>
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent('Habari, ninaomba maelekezo ya jukwaa la SWAHILI EARN')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-left p-2 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  👉 {lang === 'sw' ? 'Mwongozo wa Jukwaa na Huduma' : 'Platform & Tutoring Guide'}
                </a>
              </div>
            </div>

            {/* Direct Open CTA */}
            <div className="p-3 bg-white border-t border-slate-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{lang === 'sw' ? 'Fungua WhatsApp Rasmi Sasa' : 'Open Official WhatsApp Now'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        )}

      </div>
    </>
  );
};
