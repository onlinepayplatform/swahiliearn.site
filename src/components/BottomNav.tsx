import React from 'react';
import { Home, Users, MessageCircle } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  lang: 'sw' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate, lang }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 shadow-lg">
      <div className="grid grid-cols-3 gap-2 text-center max-w-sm mx-auto">
        
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentTab === 'home' ? 'text-[#0066FF] font-bold bg-blue-50/60' : 'text-slate-500 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'sw' ? 'Nyumbani' : 'Home'}</span>
        </button>

        <button
          onClick={() => onNavigate('learners')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentTab === 'learners' ? 'text-[#0066FF] font-bold bg-blue-50/60' : 'text-slate-500 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'sw' ? 'Wazungu' : 'Learners'}</span>
        </button>

        <a
          href="https://wa.me/message/EP72QM4VJRTIA1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-xl text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">WhatsApp</span>
        </a>

      </div>
    </div>
  );
};
