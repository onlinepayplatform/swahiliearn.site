import React, { useState, useEffect } from 'react';
import { ForeignLearner, UserProfile, VerifiedAfricanPayout, AdminSettings } from '../types';
import { VirtualAccountSection } from '../components/VirtualAccountSection';
import { VerifiedPayoutsWindow } from '../components/VerifiedPayoutsWindow';
import { HomepageCustomerCarePopup } from '../components/HomepageCustomerCarePopup';
import { WithdrawalModal } from '../components/WithdrawalModal';
import {
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Star,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface HomePageProps {
  learners: ForeignLearner[];
  user: UserProfile;
  verifiedPayouts: VerifiedAfricanPayout[];
  adminSettings: AdminSettings;
  onSelectLearner: (learner: ForeignLearner) => void;
  onNavigate: (tab: string) => void;
  onUserUpdated: (user: UserProfile) => void;
  lang: 'sw' | 'en';
}

export const HomePage: React.FC<HomePageProps> = ({
  learners,
  user,
  verifiedPayouts,
  adminSettings,
  onSelectLearner,
  onNavigate,
  onUserUpdated,
  lang
}) => {
  const [liveChatters, setLiveChatters] = useState(13240);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // Organic fluctuation of live users
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveChatters(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const next = prev + delta;
        return next < 11500 ? 12200 : next > 16500 ? 14800 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:py-16 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#0066FF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            {/* Live Status Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {lang === 'sw'
                  ? `Zaidi ya Wazungumzaji ${liveChatters.toLocaleString()} Hewani Sasa`
                  : `Over ${liveChatters.toLocaleString()} Active Learners Online Now`}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Lipwa kwa Kufundisha <span className="text-[#0066FF]">Wazungu Kiswahili</span>
            </h1>

            {/* Plain Info Paragraph (not in badge form) */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold max-w-3xl mx-auto px-2">
              SWAHILI EARN SITE ni fursa ya kipekee kwa vijana kwa sababu inatoa nafasi za kutengeneza kipato cha ziada au hata kujiajiri kupitia simu yako kwa kufundisha wazungu kama watalii au wanachuo lugha ya kiswahili na kulipwa / kutengeneza hadi Tsh 160,000/= kwa siku ,fursa hii ipo Chini ya ONLINEPAY DIGITAL PLATFORM ilioingia ushirika na wazungu wanaotaka kujifunza kiswahili kutoka mataifa mbali mbali
            </p>

            {/* Call To Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('learners')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{lang === 'sw' ? 'ANZA KUFUNDISHA SASA (CHAGUA MZUNGU)' : 'START TUTORING (CHOOSE LEARNER)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Highlights Checklist */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Malipo ya Moja kwa Moja</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Dakika 10 kwa Kipindi</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Mataifa ya Afrika Mashariki</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">ONLINEPAY Verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VIRTUAL ACCOUNT OPENING & DASHBOARD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VirtualAccountSection
          user={user}
          onOpenWithdrawalModal={() => setShowWithdrawalModal(true)}
          onUserUpdated={onUserUpdated}
        />
      </section>

      {/* 3. ACTIVATION FEE EXPLANATION BOUNCING BADGE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-bounce">
          <div className="bg-white border-2 border-amber-400 p-4 sm:p-5 rounded-2xl shadow-xl shadow-amber-500/10 text-center flex items-center justify-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="font-black text-xs sm:text-sm text-black leading-relaxed">
              Lipia mtaji wa 16,000/= ili kupata akaunti kamili yenye uwezo kutoa pesa zako , pesa ya mtaji ina wezesha mifumo ya miamala na kibenki ya kampuni kufanya kazi
            </p>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED PAYMENTS FROM ACROSS ALL AFRICA (INFINITE VERTICAL SCROLL WINDOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VerifiedPayoutsWindow payouts={verifiedPayouts} />
      </section>

      {/* 5. JINSI YA KUANZA NA KULIPWA (HOW IT WORKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">Mwongozo Rahisi</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Jinsi ya Kuanza na Kulipwa
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Huhitaji ujuzi mgumu. Fuata hatua hizi 3 rahisi:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0066FF] font-extrabold flex items-center justify-center text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chagua Mzungu</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vinjari orodha ya wazungu waliopo hewani kulingana na nchi zao (Marekani, Uingereza, Poland, Sweden), taaluma zao na malipo unayopenda.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0066FF] font-extrabold flex items-center justify-center text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ongea Naye kwa Dakika 10</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jibu maswali yake ya Kiswahili, mfundishe misemo ya kusalimia, kuagiza chakula, na mrekebishe pale anapokosea. Mfumo unahesabu muda moja kwa moja.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-blue-400 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-extrabold flex items-center justify-center text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Kamilisha na Uthibitishe</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Muda wa dakika 10 unapoisha, kipindi kinakamilika kwa ufanisi na mwanafunzi anapata ripoti ya maneno mapya ya Kiswahili aliyojifunza.
            </p>
          </div>

        </div>
      </section>

      {/* 6. FEATURED FOREIGN LEARNERS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">Wageni Waliopo Hewani Sasa</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Wazungu Wanaosubiri Kujifunza Kiswahili
            </h2>
          </div>
          <button
            onClick={() => onNavigate('learners')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:text-[#0052CC] transition-colors cursor-pointer"
          >
            <span>Tazama Orodha Yote ({learners.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learners.slice(0, 4).map(learner => (
            <div
              key={learner.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image and rate overlay */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 flex items-center gap-1 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Yuko Hewani</span>
                  </div>

                  {/* Flag */}
                  <div className="absolute top-3 right-3 text-2xl shadow-xs">
                    {learner.flag}
                  </div>

                  {/* Pay Rate Tag */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-extrabold font-mono shadow-md">
                    TZS {learner.payPer10Min.toLocaleString()} / 10 Min
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">{learner.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">{learner.age} yrs</span>
                  </div>

                  <p className="text-xs font-semibold text-[#0066FF] flex items-center gap-1">
                    <span>{learner.profession}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{learner.location}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    "{learner.bio}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectLearner(learner)}
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>ONGEA NAYE SASA</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 7. HOMEPAGE CUSTOMER CARE BOUNCING POPUP (15s on / 45s off cycle) */}
      <HomepageCustomerCarePopup whatsappUrl={adminSettings.whatsappSupportUrl} />

      {/* 8. LIQUID GLASS WITHDRAWAL MODAL */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        registrationUrl={adminSettings.registrationExternalUrl}
      />

    </div>
  );
};
