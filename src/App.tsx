/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ForeignLearner, UserProfile, WithdrawalRequest, UserSession, AdminSettings } from './types';
import { appStorage, VisitorLead } from './lib/storage';
import { LiveTicker } from './components/LiveTicker';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatScreen } from './pages/ChatScreen';
import { AdminPage } from './pages/AdminPage';
import { Heart, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeLearner, setActiveLearner] = useState<ForeignLearner | null>(null);

  // Storage states
  const [user, setUser] = useState<UserProfile>(appStorage.getUserProfile());
  const [learners, setLearners] = useState<ForeignLearner[]>(appStorage.getForeignLearners());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(appStorage.getWithdrawals());
  const [sessions, setSessions] = useState<UserSession[]>(appStorage.getSessions());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(appStorage.getAdminSettings());
  const [leads, setLeads] = useState<VisitorLead[]>(appStorage.getLeads());
  const [lang, setLang] = useState<'sw' | 'en'>(appStorage.getLanguage());

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync with storage events
  useEffect(() => {
    const unsubscribe = appStorage.subscribe(() => {
      setUser(appStorage.getUserProfile());
      setLearners(appStorage.getForeignLearners());
      setWithdrawals(appStorage.getWithdrawals());
      setSessions(appStorage.getSessions());
      setAdminSettings(appStorage.getAdminSettings());
      setLeads(appStorage.getLeads());
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
        user={user}
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthOpen(true)}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            learners={learners}
            user={user}
            onSelectLearner={handleSelectLearner}
            onNavigate={handleNavigate}
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
            withdrawals={withdrawals}
            adminSettings={adminSettings}
            leads={leads}
            onRefresh={() => {
              setLearners(appStorage.getForeignLearners());
              setWithdrawals(appStorage.getWithdrawals());
              setAdminSettings(appStorage.getAdminSettings());
            }}
            lang={lang}
          />
        )}
      </main>

      {/* 4. Professional East African Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white text-xs">
                  SE
                </div>
                <span>SWAHILI EARN</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Jukwaa la kidijitali la Afrika Mashariki linalowezesha wazungumzaji wa asili wa Kiswahili kupata malipo halisi kwa kufanya mazungumzo na wageni wa kimataifa.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-slate-300 font-semibold">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                <span>ONLINEPAY DIGITAL PLATFORM</span>
              </div>
            </div>

            {/* Col 2: Viungo vya Haraka */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Viungo vya Haraka</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors">
                    Nyumbani (Home)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('learners')} className="hover:text-white transition-colors">
                    Orodha ya Wazungu (Learners)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('admin')} className="hover:text-white transition-colors">
                    Lango la Msimamizi (Admin)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Mitandao ya Malipo */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Mitandao ya Malipo</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Vodacom M-Pesa (Tanzania & Kenya)</li>
                <li>Tigo Pesa / Mixx by Yas</li>
                <li>Airtel Money</li>
                <li>Halopesa Tanzania</li>
              </ul>
            </div>

            {/* Col 4: Msaada & Mawasiliano */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Huduma kwa Wateja 24/7</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tuko tayari kukusaidia wakati wowote kupitia WhatsApp rasmi ya huduma kwa wateja.
              </p>
              <div className="pt-1">
                <a
                  href={adminSettings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2 px-3.5 rounded-xl transition-colors text-xs"
                >
                  <span>Wasiliana na WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 SWAHILI EARN · Haki zote zimehifadhiwa. Powered by ONLINEPAY DIGITAL PLATFORM.
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleNavigate('admin')} className="hover:text-slate-300">
                Lango la Admin
              </button>
              <span>·</span>
              <span>Usalama wa Malipo 100%</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 5. Mobile Sticky Bottom Nav Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        lang={lang}
      />

      {/* 6. Floating WhatsApp Button */}
      <FloatingWhatsApp
        whatsappUrl={adminSettings.whatsappUrl}
        lang={lang}
      />

      {/* 7. Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUserChange={u => setUser(u)}
        lang={lang}
      />

    </div>
  );
}
