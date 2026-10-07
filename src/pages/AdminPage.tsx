import React, { useState } from 'react';
import { ForeignLearner, WithdrawalRequest, AdminSettings, LearnerProfession } from '../types';
import { appStorage, VisitorLead } from '../lib/storage';
import {
  Shield,
  Lock,
  Users,
  ArrowDownToLine,
  Activity,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Upload,
  ExternalLink,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface AdminPageProps {
  learners: ForeignLearner[];
  withdrawals: WithdrawalRequest[];
  adminSettings: AdminSettings;
  leads: VisitorLead[];
  onRefresh: () => void;
  lang: 'sw' | 'en';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  learners,
  withdrawals,
  adminSettings,
  leads,
  onRefresh,
  lang
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'learners' | 'withdrawals' | 'leads' | 'settings'>('learners');

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
    age: 25,
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    avatarUrl: '',
    profession: 'Tourist',
    professionCategory: 'tourist',
    location: 'Arusha',
    bio: '',
    learningGoal: '',
    payPer10Min: 80000,
    defaultFirstMessage: 'Hujambo! Naitwa rafiki yako kutoka nje na niko tayari kujifunza Kiswahili.'
  });

  // Settings state
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

  // Local image file upload handler (converts device photo directly to base64 data URL)
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
      location: 'Serengeti / Arusha',
      bio: 'Msafiri anayetembelea mbuga za wanyama na anataka kujifunza salamu.',
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
        systemPrompt: `You are ${learnerForm.name}, a friendly foreign visitor learning Swahili in East Africa.`
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

  const handleUpdateWithdrawal = (id: string, status: WithdrawalRequest['status']) => {
    appStorage.updateWithdrawalStatus(id, status, `Imebadilishwa na Msimamizi kuwa ${status}`);
    onRefresh();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    appStorage.updateAdminSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
    onRefresh();
  };

  // PASSCODE GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lango la Msimamizi (Admin Portal)
            </h2>
            <p className="text-xs text-slate-500">
              Weka nambari ya siri ya ulinzi (Security Passcode) ili kufungua dashibodi ya usimamizi.
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
                placeholder="Weka passcode (mf. 8998admin)"
                className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm font-mono tracking-widest text-slate-900 outline-hidden"
              />
              {authError && (
                <p className="text-xs text-red-600 font-bold mt-1.5">
                  Passcode si sahihi! Tafadhali jaribu tena.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
            >
              Fungua Dashibodi
            </button>

            <p className="text-[11px] text-slate-400 font-mono">
              (Nambari chaguo-msingi: 8998admin)
            </p>
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
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Dashibodi Kuu ya Msimamizi (Admin Hub)
            </h1>
            <p className="text-xs text-slate-400">
              SWAHILI EARN System Administration & Payouts Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3.5 rounded-xl border border-slate-700 transition-colors"
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
          <span>Wazungu Waliopo ({learners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'withdrawals'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Maombi ya Kutoa ({withdrawals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Wageni & Usajili ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#0066FF] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Mipangilio ya Mfumo</span>
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
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditLearner(learner)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Hariri"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLearner(learner.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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

      {/* TAB 2: WITHDRAWALS MONITOR */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Maombi ya Kutoa Pesa (Withdrawals Queue)</h3>
            <p className="text-xs text-slate-500">Idhinisha au kataa malipo ya simu ya watumiaji.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mtumiaji / Simu</th>
                    <th className="py-3 px-4">Mtandao</th>
                    <th className="py-3 px-4">Kiasi (TZS)</th>
                    <th className="py-3 px-4">Tarehe</th>
                    <th className="py-3 px-4">Hali</th>
                    <th className="py-3 px-4 text-right">Vitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {withdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{w.userName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{w.phone}</div>
                      </td>
                      <td className="py-3 px-4 uppercase font-bold text-slate-700">{w.network}</td>
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900 text-sm">
                        TZS {w.amountTzs.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(w.requestedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            w.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : w.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {w.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateWithdrawal(w.id, 'completed')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded-lg text-[11px]"
                            >
                              Lipa (Pay)
                            </button>
                            <button
                              onClick={() => handleUpdateWithdrawal(w.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2.5 rounded-lg text-[11px]"
                            >
                              Kataa
                            </button>
                          </>
                        )}
                        {w.status === 'completed' && (
                          <span className="text-emerald-600 text-xs font-bold">Imeshakamilika</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADS & VISITORS */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Wageni na Usajili wa Hivi Karibuni</h3>
            <p className="text-xs text-slate-500">Mfuatiliaji wa namba zilizojisajili na watumiaji wapya.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Wageni Hewani (Live Now)</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">
                {adminSettings.liveVisitorsBase.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Namba Zilizorekodiwa</span>
              <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">
                {leads.length}
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Kiwango cha Mafanikio</span>
              <div className="text-2xl font-extrabold font-mono text-purple-600 mt-1">
                98.4%
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="font-bold text-slate-900 text-sm">Orodha ya Watumiaji:</div>
            <div className="space-y-2">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{lead.fullName}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-mono text-slate-600">{lead.phone}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">{lead.region}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{lead.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Mipangilio ya Mfumo (Global Settings)</h3>
            <p className="text-xs text-slate-500">Badilisha namba ya WhatsApp ya usaidizi na viwango vya kutoa.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kiunganishi Rasmi cha WhatsApp (Support Link):
              </label>
              <input
                type="url"
                required
                value={settingsForm.whatsappUrl}
                onChange={e => setSettingsForm({ ...settingsForm, whatsappUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kiwango cha Chini cha Kutoa Pesa (TZS):
              </label>
              <input
                type="number"
                required
                value={settingsForm.minWithdrawalTzs}
                onChange={e => setSettingsForm({ ...settingsForm, minWithdrawalTzs: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ujumbe wa Tangazo (Announcement Banner):
              </label>
              <textarea
                rows={2}
                value={settingsForm.bannerMessage}
                onChange={e => setSettingsForm({ ...settingsForm, bannerMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs"
              >
                Hifadhi Mipangilio Yote
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

              {/* Avatar Upload (File from device or URL) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Picha ya Mzungu (Pakia kutoka kwenye Kifaa au Weka URL):
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

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ujumbe wa Kwanza wa Kuanza:</label>
                <input
                  type="text"
                  required
                  value={learnerForm.defaultFirstMessage}
                  onChange={e => setLearnerForm({ ...learnerForm, defaultFirstMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Hifadhi Mzungu
                </button>
                <button
                  type="button"
                  onClick={() => setShowLearnerModal(false)}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
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
