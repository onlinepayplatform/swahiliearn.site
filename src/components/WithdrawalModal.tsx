import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationUrl: string;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  registrationUrl = 'https://onlinepayplatform.com/register?ref=Didan255'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Liquid Glass Modal Container */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 sm:p-8 text-black overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-700 shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            ILI KUPATA ACTIVE ACCOUNT
          </h2>

          {/* Subtitle in Badge form */}
          <div>
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            >
              <span>Bonyeza hapa kujisajili kikamilifu</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Step by step Instructions list */}
        <div className="mt-6 bg-slate-50/90 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs sm:text-sm font-black text-black">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Weka EMAIL YAKO</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Weka NAMBA YAKO YA SIMU</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Weka MAJINA YAKO MAWILI</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Weka USERNAME YAKO (usiache nafasi bananisha) <span className="font-bold text-slate-600">mfano: eliza07, janeth255, ben77</span>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Weka PASSWORD YAKO <span className="font-bold text-slate-600">mfano: 2025, Tanzania123</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rudia PASSWORD YAKO</span>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2 font-bold text-black text-xs leading-relaxed">
            <p>
              👉 Kisha gusa <strong className="text-emerald-700 font-black">SIGN UP</strong>
            </p>
            <p>
              👉 Baada ya hapo Fata maelekezo ya kulipia mtaji wako automatically
            </p>
            <p>
              👉 Uanze kunufaika na fursa hii
            </p>
          </div>
        </div>

        {/* Company verification notice */}
        <div className="mt-4 p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center">
          <p className="font-black text-xs sm:text-sm text-black">
            📌 Unapolipia hakikisha jina la kampuni ni <span className="text-[#0052CC] font-black underline">ONLINEPAY DIGITAL PLATFORM</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-5">
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white font-black py-3.5 px-6 rounded-2xl shadow-xl text-sm transition-all cursor-pointer"
          >
            <span>ENDELEA KWENYE USAJILI WA ONLINEPAY</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
