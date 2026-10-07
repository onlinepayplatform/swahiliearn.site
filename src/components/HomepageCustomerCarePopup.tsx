import React, { useState, useEffect } from 'react';
import { MessageCircle, ExternalLink, X } from 'lucide-react';

interface HomepageCustomerCarePopupProps {
  whatsappUrl?: string;
}

export const HomepageCustomerCarePopup: React.FC<HomepageCustomerCarePopupProps> = ({
  whatsappUrl = 'https://wa.me/message/EP72QM4VJRTIA1'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  useEffect(() => {
    if (isDismissedByUser) return;

    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible for 15 seconds, then hide
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
    } else {
      // Stay hidden for 45 seconds, then show again
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 45000);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, isDismissedByUser]);

  if (!isVisible || isDismissedByUser) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-10 left-4 sm:left-8 z-50 animate-bounce transition-all duration-500">
      <div className="relative bg-white border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(16,185,129,0.45)] max-w-[340px] sm:max-w-[380px] text-left">
        
        {/* Dismiss 'x' button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-slate-700 transition-colors shadow-md cursor-pointer"
          title="Funga"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Clickable redirection */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>[ SWAHILI EARN HUDUMA KWA WATEJA ]</span>
              </div>
              
              <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
                Habari Karibu Swahili Earn site . Bonyeza hapa kuwasiliana na huduma kwa wateja kwa ajili ya taarifa zaidi .
              </p>

              <div className="pt-1 flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 group-hover:underline">
                <span>Wasiliana Nasi Sasa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </a>

      </div>
    </div>
  );
};
