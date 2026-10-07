/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ForeignLearner,
  UserProfile,
  AdminSettings,
  VerifiedAfricanPayout,
  RegisteredVirtualAccount
} from './types';
import { appStorage } from './lib/storage';
import { LiveTicker } from './components/LiveTicker';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CustomerCareBanner } from './components/CustomerCareBanner';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatScreen } from './pages/ChatScreen';
import { AdminPage } from './pages/AdminPage';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeLearner, setActiveLearner] = useState<ForeignLearner | null>(null);

  // Storage states
  const [user, setUser] = useState<UserProfile>(appStorage.getUserProfile());
  const [learners, setLearners] = useState<ForeignLearner[]>(appStorage.getForeignLearners());
  const [verifiedPayouts, setVerifiedPayouts] = useState<VerifiedAfricanPayout[]>(appStorage.getVerifiedPayouts());
  const [virtualAccounts, setVirtualAccounts] = useState<RegisteredVirtualAccount[]>(appStorage.getVirtualAccounts());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(appStorage.getAdminSettings());
  const [lang, setLang] = useState<'sw' | 'en'>(appStorage.getLanguage());

  // Sync with storage events
  useEffect(() => {
    const unsubscribe = appStorage.subscribe(() => {
      setUser(appStorage.getUserProfile());
      setLearners(appStorage.getForeignLearners());
      setVerifiedPayouts(appStorage.getVerifiedPayouts());
      setVirtualAccounts(appStorage.getVirtualAccounts());
      setAdminSettings(appStorage.getAdminSettings());
    });
    return () => unsubscribe();
  }, []);

  const handleToggleLang = () => {
    const next = lang === 'sw' ? 'en' : 'sw';
    setLang(next);
    appStorage.setLanguage(next);
  };

  const handleSelectLearner = (learner: ForeignLearner) => {
    setActiveLearner(learner);
    setCurrentTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishChatSession = () => {
    setCurrentTab('learners');
    setActiveLearner(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* 1. Verified Live Payouts Ticker */}
      <LiveTicker />

      {/* 2. Global Sticky Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            learners={learners}
            user={user}
            verifiedPayouts={verifiedPayouts}
            adminSettings={adminSettings}
            onSelectLearner={handleSelectLearner}
            onNavigate={handleNavigate}
            onUserUpdated={u => setUser(u)}
            lang={lang}
          />
        )}

        {currentTab === 'learners' && (
          <DiscoverPage
            learners={learners}
            onSelectLearner={handleSelectLearner}
            lang={lang}
          />
        )}

        {currentTab === 'chat' && activeLearner && (
          <ChatScreen
            learner={activeLearner}
            user={user}
            onBack={() => setCurrentTab('learners')}
            onFinishSession={handleFinishChatSession}
            lang={lang}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            learners={learners}
            verifiedPayouts={verifiedPayouts}
            virtualAccounts={virtualAccounts}
            adminSettings={adminSettings}
            onRefresh={() => {
              setLearners(appStorage.getForeignLearners());
              setVerifiedPayouts(appStorage.getVerifiedPayouts());
              setVirtualAccounts(appStorage.getVirtualAccounts());
              setAdminSettings(appStorage.getAdminSettings());
            }}
            lang={lang}
          />
        )}
      </main>

      {/* 4. Customer Care Badge Right on Top of the Webfoot */}
      <CustomerCareBanner
        whatsappChannelUrl={adminSettings.whatsappChannelUrl}
        smsNumber={adminSettings.smsSupportNumber}
        whatsappSupportUrl={adminSettings.whatsappSupportUrl}
      />

      {/* 5. Professional East African Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Glowing Sponsor */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white text-xs">
                  SE
                </div>
                <span>SWAHILI EARN</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Jukwaa la kidijitali la Afrika Mashariki linalowezesha wazungumzaji wa asili wa Kiswahili kupata malipo halisi kwa kufanya mazungumzo na wageni wa kimataifa.
              </p>
              
              {/* Glowing Sponsor Badge with Embed link */}
              <div className="pt-2">
                <a
                  href={adminSettings.sponsorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 glow-orange font-black text-sm tracking-wide hover:underline cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>sponsored by ONLINEPAY DIGITAL PLATFORM</span>
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                </a>
              </div>
            </div>

            {/* Col 2: Viungo vya Haraka */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Viungo vya Haraka</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                    Nyumbani (Home)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('learners')} className="hover:text-white transition-colors cursor-pointer">
                    Orodha ya Wazungu (Learners)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: FOLLOW US ON Social Links */}
            <div className="space-y-3">
              <h4 className="font-black text-white uppercase text-xs tracking-wider">
                FOLLOW US ON
              </h4>
              
              <div className="flex flex-col gap-2.5">
                {/* Instagram */}
                <a
                  href={adminSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-pink-400 transition-colors group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="font-bold">Instagram</span>
                </a>

                {/* TikTok */}
                <a
                  href={adminSettings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48c.04-.04.09-.08.13-.12.04-.04.07-.08.11-.12V11.2a8.16 8.16 0 0 0 5.53 2.15v-3.46a4.84 4.84 0 0 1-3.77-3.2z"/>
                  </svg>
                  <span className="font-bold">TikTok</span>
                </a>

                {/* Facebook */}
                <a
                  href={adminSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-blue-400 transition-colors group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-bold">Facebook</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Footer Bar: Relocated Admin Portal to bottom-left corner */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            {/* Left bottom corner: Admin Portal button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
              <button
                onClick={() => handleNavigate('admin')}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white hover:border-purple-400 font-bold px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Lango la Msimamizi"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Portal</span>
              </button>
              <span className="text-slate-600">·</span>
              <span>© 2026 SWAHILI EARN</span>
            </div>

            {/* Right bottom corner */}
            <div className="flex items-center gap-3 text-slate-500">
              <a
                href={adminSettings.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-orange font-bold hover:underline"
              >
                sponsored by ONLINEPAY DIGITAL PLATFORM
              </a>
              <span>·</span>
              <span>Usalama wa Malipo 100%</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 6. Mobile Sticky Bottom Nav Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        lang={lang}
      />

      {/* 7. Floating WhatsApp Button */}
      <FloatingWhatsApp
        whatsappUrl={adminSettings.whatsappSupportUrl}
        lang={lang}
      />

    </div>
  );
}
