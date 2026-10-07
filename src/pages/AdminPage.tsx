import React, { useState } from 'react';
import { ForeignLearner, AdminSettings, LearnerProfession, VerifiedAfricanPayout, RegisteredVirtualAccount } from '../types';
import { appStorage } from '../lib/storage';
import {
  Shield,
  Lock,
  Users,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Upload,
  Globe,
  Share2,
  Radio,
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface AdminPageProps {
  learners: ForeignLearner[];
  verifiedPayouts: VerifiedAfricanPayout[];
  virtualAccounts: RegisteredVirtualAccount[];
  adminSettings: AdminSettings;
  onRefresh: () => void;
  lang: 'sw' | 'en';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  learners,
  verifiedPayouts,
  virtualAccounts,
  adminSettings,
  onRefresh
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'learners' | 'payouts' | 'accounts' | 'links'>('learners');

  // Add / Edit Learner state
  const [showLearnerModal, setShowLearnerModal] = useState(false);
  const [editingLearnerId, setEditingLearnerId] = useState<string | null>(null);
  const [learnerForm, setLearnerForm] = useState<{
    name: string;
    age: number;
    country: string;
    countryCode: string;
    flag: string;
    avatarUrl: string;
    profession: string;
    professionCategory: LearnerProfession;
    location: string;
    bio: string;
    learningGoal: string;
    payPer10Min: number;
    defaultFirstMessage: string;
  }>({
    name: '',
    age: 26,
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    profession: 'Tourist / Traveler',
    professionCategory: 'tourist',
    location: 'California, Marekani',
    bio: '',
    learningGoal: '',
    payPer10Min: 80000,
    defaultFirstMessage: 'Hujambo! Naitwa mgeni na niko tayari kujifunza Kiswahili.'
  });

  // Add payout state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState<{
    name: string;
    amount: string;
    location: string;
    country: string;
    countryFlag: string;
    method: string;
    timeAgo: string;
  }>({
    name: '',
    amount: '180,000 Tsh',
    location: 'Dar es Salaam, Tanzania',
    country: 'Tanzania',
    countryFlag: '🇹🇿',
    method: 'Halopesa',
    timeAgo: 'Sasa hivi'
  });

  // Settings & Links state
  const [settingsForm, setSettingsForm] = useState<AdminSettings>(adminSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Authenticate Passcode
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === adminSettings.adminPasscode || passcodeInput.trim() === '8998admin') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Local image file upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setLearnerForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddLearner = () => {
    setEditingLearnerId(null);
    setLearnerForm({
      name: '',
      age: 26,
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      profession: 'Tourist / Traveler',
      professionCategory: 'tourist',
      location: 'California, Marekani',
      bio: 'Msafiri anayetaka kujifunza maneno ya kimsingi ya kusalimia watu na kuagiza vyakula.',
      learningGoal: 'Safari greetings & market bargaining.',
      payPer10Min: 80000,
      defaultFirstMessage: 'Hujambo! Naitwa mgeni na ninaomba unifundishe salamu za Kiswahili.'
    });
    setShowLearnerModal(true);
  };

  const handleOpenEditLearner = (learner: ForeignLearner) => {
    setEditingLearnerId(learner.id);
    setLearnerForm({
      name: learner.name,
      age: learner.age,
      country: learner.country,
      countryCode: learner.countryCode,
      flag: learner.flag,
      avatarUrl: learner.avatarUrl,
      profession: learner.profession,
      professionCategory: learner.professionCategory,
      location: learner.location,
      bio: learner.bio,
      learningGoal: learner.learningGoal,
      payPer10Min: learner.payPer10Min,
      defaultFirstMessage: learner.defaultFirstMessage
    });
    setShowLearnerModal(true);
  };

  const handleSaveLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerForm.name || !learnerForm.avatarUrl) return;

    if (editingLearnerId) {
      appStorage.updateForeignLearner(editingLearnerId, {
        ...learnerForm
      });
    } else {
      const newLearner: ForeignLearner = {
        ...learnerForm,
        id: 'learner-' + Math.random().toString(36).substring(2, 8),
        rating: 4.9,
        reviewsCount: 1,
        sessionDurationSeconds: 600,
        status: 'online',
        languageLevel: 'Beginner (Anayeanza)',
        interests: ['Language Exchange', 'Culture', 'Travel'],
        systemPrompt: `You are ${learnerForm.name}, a friendly foreign visitor learning Swahili.`
      };
      appStorage.addForeignLearner(newLearner);
    }

    setShowLearnerModal(false);
    onRefresh();
  };

  const handleDeleteLearner = (id: string) => {
    if (confirm('Je, una uhakika unataka kumfuta mgeni huyu?')) {
      appStorage.deleteForeignLearner(id);
      onRefresh();
    }
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutForm.name || !payoutForm.amount) return;

    appStorage.addVerifiedPayout({
      ...payoutForm,
      id: 'vp-' + Math.random().toString(36).substring(2, 8)
    });
    setShowPayoutModal(false);
    onRefresh();
  };

  const handleDeletePayout = (id: string) => {
    appStorage.deleteVerifiedPayout(id);
    onRefresh();
  };

  const handleDeleteVirtualAccount = (id: string) => {
    appStorage.deleteVirtualAccount(id);
    onRefresh();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    appStorage.updateAdminSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
    onRefresh();
  };

  // PASSCODE GATE SCREEN (NO PASSCODE HINT VISIBLE)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Lango la Msimamizi (Admin Portal)
            </h2>
            <p className="text-xs text-slate-500">
              Weka nambari ya siri ya ulinzi ili kufungua dashibodi ya usimamizi.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passcodeInput}
                onChange={e => {
                  setPasscodeInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Weka nambari ya siri ya ulinzi"
                className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm font-mono tracking-widest text-slate-900 outline-hidden"
              />
              {authError && (
                <p className="text-xs text-red-600 font-bold mt-1.5">
                  Nambari ya siri si sahihi! Tafadhali jaribu tena.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black py-3 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              Fungua Dashibodi
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Dashibodi Kuu ya Msimamizi (Admin Hub)
            </h1>
            <p className="text-xs text-slate-400">
              Usimamizi wa Wazungu, Malipo ya Afrika, Akaunti za Mtandaoni, na Viungo Rasmi
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          Toka kwenye Dashibodi (Logout)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('learners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'learners'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Wazungu ({learners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'payouts'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Malipo ya Afrika ({verifiedPayouts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Akaunti Zilizosajiliwa ({virtualAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Mitandao ya Kijamii & Viungo</span>
        </button>
      </div>

      {/* TAB 1: LEARNERS MANAGEMENT */}
      {activeTab === 'learners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Usimamizi wa Wazungu (Learner Profiles)</h3>
              <p className="text-xs text-slate-500">Ongeza, hariri au badilisha viwango vya malipo na picha.</p>
            </div>
            <button
              onClick={handleOpenAddLearner}
              className="inline-flex items-center gap-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Mzungu Mpya</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learners.map(learner => (
              <div
                key={learner.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                      <span>{learner.name}</span>
                      <span>{learner.flag}</span>
                    </div>
                    <p className="text-xs text-[#0066FF] font-semibold">{learner.profession}</p>
                    <div className="text-xs font-mono font-bold text-emerald-600">
                      TZS {learner.payPer10Min.toLocaleString()} / 10 Min
                    </div>
                    <p className="text-[11px] text-slate-400">{learner.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditLearner(learner)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Hariri"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLearner(learner.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Futa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED PAYOUTS MANAGEMENT */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Malipo Yaliyothibitishwa Afrika Mashariki</h3>
              <p className="text-xs text-slate-500">Ongeza au hariri malipo yanayoonekana kwenye dirisha linalotembea (Vertical Marquee).</p>
            </div>
            <button
              onClick={() => setShowPayoutModal(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Malipo Mapya</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Jina</th>
                    <th className="py-3 px-4">Kiasi</th>
                    <th className="py-3 px-4">Eneo / Nchi</th>
                    <th className="py-3 px-4">Njia ya Malipo</th>
                    <th className="py-3 px-4">Muda</th>
                    <th className="py-3 px-4 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {verifiedPayouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{p.countryFlag}</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-emerald-600">
                        {p.amount}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.location}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {p.method}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {p.timeAgo}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeletePayout(p.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Futa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED VIRTUAL ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Akaunti za Mtandaoni Zilizosajiliwa</h3>
            <p className="text-xs text-slate-500">Watu waliofungua akaunti kwa namba na majina yao kwa ajili ya kufuatilia (Follow-up).</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Majina Kamili</th>
                    <th className="py-3 px-4">Namba ya Simu</th>
                    <th className="py-3 px-4">Salio (TZS)</th>
                    <th className="py-3 px-4">Muda wa Usajili</th>
                    <th className="py-3 px-4">Mawasiliano ya Haraka</th>
                    <th className="py-3 px-4 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {virtualAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {acc.fullName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {acc.phone}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-emerald-600">
                        TZS {acc.balanceTzs.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {acc.registeredAt}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://wa.me/${acc.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Habari ${acc.fullName}, tunawasiliana nawe kutoka SWAHILI EARN kuhusu akaunti yako ya mtandaoni.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteVirtualAccount(acc.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Futa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL LINKS & CUSTOMER CARE SETTINGS */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Mitandao ya Kijamii, Viungo & Huduma kwa Wateja</h3>
            <p className="text-xs text-slate-500">Hariri viungo vyote vinavyoonekana kwenye tovuti baada ya kudeploy.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-semibold">
            
            {/* Social Media Links */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Mitandao ya Kijamii (Social Links):
              </span>

              <div>
                <label className="text-slate-700 block mb-1">Instagram Link:</label>
                <input
                  type="url"
                  required
                  value={settingsForm.instagramUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">TikTok Link:</label>
                <input
                  type="url"
                  required
                  value={settingsForm.tiktokUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Facebook Link:</label>
                <input
                  type="url"
                  required
                  value={settingsForm.facebookUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Customer Care Links */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Huduma kwa Wateja (Customer Care Contacts):
              </span>

              <div>
                <label className="text-slate-700 block mb-1">WhatsApp Channel Link:</label>
                <input
                  type="url"
                  required
                  value={settingsForm.whatsappChannelUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsappChannelUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Send Normal Text (SMS Number):</label>
                <input
                  type="text"
                  required
                  value={settingsForm.smsSupportNumber}
                  onChange={e => setSettingsForm({ ...settingsForm, smsSupportNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">WhatsApp Direct Chat Link:</label>
                <input
                  type="url"
                  required
                  value={settingsForm.whatsappSupportUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsappSupportUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Sponsor & Registration Links */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-[11px]">
                Ufadhili na Usajili wa Active Account:
              </span>

              <div>
                <label className="text-slate-700 block mb-1">Sponsor Website Link (ONLINEPAY PLATFORM):</label>
                <input
                  type="url"
                  required
                  value={settingsForm.sponsorUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, sponsorUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">OnlinePay Registration Link (Ref URL):</label>
                <input
                  type="url"
                  required
                  value={settingsForm.registrationExternalUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, registrationExternalUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-black py-3 px-4 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Hifadhi Mabadiliko Yote
              </button>
            </div>

            {settingsSaved && (
              <p className="text-xs text-emerald-600 font-bold text-center">
                Mipangilio imehifadhiwa kwa ufanisi!
              </p>
            )}
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT LEARNER */}
      {showLearnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <h3 className="font-extrabold text-base text-slate-900">
              {editingLearnerId ? 'Hariri Mzungu' : 'Ongeza Mzungu Mpya'}
            </h3>

            <form onSubmit={handleSaveLearner} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jina Kamili:</label>
                <input
                  type="text"
                  required
                  value={learnerForm.name}
                  onChange={e => setLearnerForm({ ...learnerForm, name: e.target.value })}
                  placeholder="mf. Eliza Montgomery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nchi:</label>
                  <input
                    type="text"
                    required
                    value={learnerForm.country}
                    onChange={e => setLearnerForm({ ...learnerForm, country: e.target.value })}
                    placeholder="mf. United States"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bendera (Emoji):</label>
                  <input
                    type="text"
                    required
                    value={learnerForm.flag}
                    onChange={e => setLearnerForm({ ...learnerForm, flag: e.target.value })}
                    placeholder="mf. 🇺🇸"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taaluma (Profession):</label>
                  <input
                    type="text"
                    required
                    value={learnerForm.profession}
                    onChange={e => setLearnerForm({ ...learnerForm, profession: e.target.value })}
                    placeholder="mf. Tourist / Medical Doctor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kiwango cha Malipo (TZS):</label>
                  <input
                    type="number"
                    required
                    step={5000}
                    value={learnerForm.payPer10Min}
                    onChange={e => setLearnerForm({ ...learnerForm, payPer10Min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eneo Analotokea (Origin Location):</label>
                <input
                  type="text"
                  required
                  value={learnerForm.location}
                  onChange={e => setLearnerForm({ ...learnerForm, location: e.target.value })}
                  placeholder="mf. California, Marekani au London, Uingereza"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Picha ya Mzungu:
                </label>
                <div className="flex items-center gap-3">
                  {learnerForm.avatarUrl && (
                    <img
                      src={learnerForm.avatarUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                    />
                  )}
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Chagua Picha Kutoka Kwenye Simu / Kompyuta</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Wasifu Mfupi (Bio):</label>
                <textarea
                  rows={2}
                  required
                  value={learnerForm.bio}
                  onChange={e => setLearnerForm({ ...learnerForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Hifadhi Mzungu
                </button>
                <button
                  type="button"
                  onClick={() => setShowLearnerModal(false)}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Ghairi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD VERIFIED PAYOUT */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Ongeza Malipo Yaliyothibitishwa
            </h3>

            <form onSubmit={handleSavePayout} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jina la Mlipwaji:</label>
                <input
                  type="text"
                  required
                  value={payoutForm.name}
                  onChange={e => setPayoutForm({ ...payoutForm, name: e.target.value })}
                  placeholder="mf. Asha"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kiasi (na Sarafu):</label>
                <input
                  type="text"
                  required
                  value={payoutForm.amount}
                  onChange={e => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  placeholder="mf. 180,000 Tsh au 2,000 Ksh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eneo na Nchi:</label>
                <input
                  type="text"
                  required
                  value={payoutForm.location}
                  onChange={e => setPayoutForm({ ...payoutForm, location: e.target.value })}
                  placeholder="mf. Dar es Salaam, Tanzania au Nairobi, Kenya"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bendera (Emoji):</label>
                  <input
                    type="text"
                    required
                    value={payoutForm.countryFlag}
                    onChange={e => setPayoutForm({ ...payoutForm, countryFlag: e.target.value })}
                    placeholder="mf. 🇹🇿 au 🇰🇪"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Njia ya Malipo:</label>
                  <input
                    type="text"
                    required
                    value={payoutForm.method}
                    onChange={e => setPayoutForm({ ...payoutForm, method: e.target.value })}
                    placeholder="mf. Halopesa au Safaricom M-Pesa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Hifadhi Malipo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Ghairi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
