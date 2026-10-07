import React from 'react';
import { UserProfile } from '../types';
import { Globe, Shield, MessageSquare, Sparkles } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  lang: 'sw' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentTab,
  onNavigate,
  onOpenAuth,
  lang,
  onToggleLang
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#0066FF] flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-extrabold text-xl tracking-tight">
              SE
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  SWAHILI <span className="text-[#0066FF]">EARN</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  OnlinePay Verified
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block font-medium">
                {lang === 'sw' ? 'Lipwa kwa kufundisha wazungu Kiswahili' : 'Get paid tutoring Swahili conversational exchange'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentTab === 'home'
                  ? 'text-[#0066FF] bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {lang === 'sw' ? 'Nyumbani' : 'Home'}
            </button>
            <button
              onClick={() => onNavigate('learners')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentTab === 'learners'
                  ? 'text-[#0066FF] bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {lang === 'sw' ? 'Wazungu Waliopo' : 'Foreign Learners'}
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'text-purple-700 bg-purple-50 border border-purple-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action: Language + User Profile + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Badili Lugha / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* User Profile / Login Avatar */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                {user.fullName || 'Akaunti'}
              </span>
            </button>

            {/* Quick CTA button */}
            <button
              onClick={() => onNavigate('learners')}
              className="hidden xl:inline-flex items-center gap-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Anza Kufundisha' : 'Start Tutoring'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
