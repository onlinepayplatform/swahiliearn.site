import React, { useState, useEffect } from 'react';
import { ForeignLearner, UserProfile } from '../types';
import { FREQUENTLY_ASKED_QUESTIONS } from '../lib/defaultProfiles';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  Quote,
  Activity,
  Headphones
} from 'lucide-react';

interface HomePageProps {
  learners: ForeignLearner[];
  user: UserProfile;
  onSelectLearner: (learner: ForeignLearner) => void;
  onNavigate: (tab: string) => void;
  lang: 'sw' | 'en';
}

export const HomePage: React.FC<HomePageProps> = ({
  learners,
  user,
  onSelectLearner,
  onNavigate,
  lang
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [liveChatters, setLiveChatters] = useState(13240);

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
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#0066FF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
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
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {lang === 'sw' ? (
                <>
                  Lipwa kwa Kufundisha <span className="text-[#0066FF]">Wazungu Kiswahili</span> na Ulipwe Papo Hapo
                </>
              ) : (
                <>
                  Earn Guaranteed Cash <span className="text-[#0066FF]">Tutoring Swahili</span> to Foreign Travelers
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              {lang === 'sw'
                ? 'Jukwaa rasmi la Afrika Mashariki linalokuunganisha na watalii, madaktari, na wanafunzi wa vyuo vikuu kutoka nchi za Ulaya na Marekani. Mazungumzo ya dakika 10 tu yanalipa kuanzia TZS 75,000 hadi TZS 95,000 kwenye M-Pesa, Tigo Pesa na Airtel Money.'
                : 'East Africa’s premier language exchange network connecting native Swahili speakers with international tourists, doctors, and researchers. Earn 75,000 to 95,000 TZS per 10-minute session directly to Mobile Money.'}
            </p>

            {/* Call To Action Buttons */}
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
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Malipo ya Moja kwa Moja</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Hakuna Ada ya Kujiunga</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">Dakika 10 kwa Kila Kipindi</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">M-Pesa / Tigo / Airtel</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS & SPONSOR BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                TZS 95,000
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Kiwango cha Juu kwa Dakika 10</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">
                18,450+
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Mazungumzo Yaliyokamilika</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                100%
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">Uhakika wa Malipo ya Simu</p>
            </div>

            <div className="pt-4 lg:pt-0 flex flex-col items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-bold">MFADHILI MKUU:</span>
              <div className="text-sm font-extrabold text-white mt-0.5 tracking-wide">
                ONLINEPAY PLATFORM
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">East Africa Digital Settlement</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3-STEP FLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">Mfumo Rahisi</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Jinsi ya Kuanza na Kulipwa Leo
          </h2>
          <p className="text-sm text-slate-600">
            Huhitaji ujuzi mgumu wala uzoefu wa ualimu. Fuata hatua hizi 3 rahisi:
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

      {/* 4. FEATURED FOREIGN LEARNERS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">Wageni Waliopo Hewani Sasa</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Wazungu Wanaosubiri Kujifunza Kiswahili
            </h2>
          </div>
          <button
            onClick={() => onNavigate('learners')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:text-[#0052CC] transition-colors"
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

      {/* 5. TESTIMONIALS & PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 lg:p-12 shadow-2xl relative">
          
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ushuhuda Halisi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Watanzania na Wakenya Wanaolipwa Kila Siku
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sikia maoni ya walimu wa kawaida waliolipwa kupitia simu zao za mkononi:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-3">
              <Quote className="w-6 h-6 text-emerald-400 opacity-60" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "Nilikuwa na mashaka mwanzoni, lakini nilipoongea na Eliza wa Marekani kwa dakika 10 nikamfundisha salamu za asubuhi, papo hapo TZS 80,000 iliingia mkobani na nikaitoa kwenye M-Pesa."
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Baraka Mwita</h4>
                  <p className="text-[11px] text-slate-400">Dar es Salaam, Mwenge</p>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-xs">+TZS 80,000</span>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-3">
              <Quote className="w-6 h-6 text-emerald-400 opacity-60" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "Dk. Mark kutoka London alikuwa mtulivu sana. Nilimfundisha jinsi ya kuuliza maumivu ya mgonjwa kwa Kiswahili. Nilipata TZS 95,000 mara mbili leo kupitia Tigo Pesa!"
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Halima Athumani</h4>
                  <p className="text-[11px] text-slate-400">Arusha, Sakina</p>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-xs">+TZS 190,000</span>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700 space-y-3">
              <Quote className="w-6 h-6 text-emerald-400 opacity-60" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "Nimekuwa nikifanya mazungumzo jioni nikiwa chumbani. Huduma kwa wateja ya WhatsApp inasaidia haraka sana kama ukipata shida ya kutoa fedha. Mfumo huu ni baraka kubwa."
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Kelvin Otieno</h4>
                  <p className="text-[11px] text-slate-400">Mwanza, Nyegezi</p>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-xs">+TZS 85,000</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SWAHILI FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold text-[#0066FF] tracking-wider uppercase">Maswali ya Kawaida</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Maswali Yanayoulizwa Mara kwa Mara (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#0066FF] transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0066FF]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0052CC] to-[#0066FF] rounded-3xl p-8 lg:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Uko Tayari Kupata Kipato Chako cha Kwanza Leo?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Jiunge na maelfu ya watumiaji wanaozungumza Kiswahili na kupokea pesa zao za M-Pesa kila dakika 10.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('learners')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0052CC] font-extrabold text-sm py-3.5 px-8 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>CHAGUA MZUNGU UONGEE NAYE SASA</span>
            </button>
            <a
              href="https://wa.me/message/EP72QM4VJRTIA1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <Headphones className="w-4 h-4" />
              <span>Msaada wa WhatsApp 24/7</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
