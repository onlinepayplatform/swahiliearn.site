import React, { useState } from 'react';
import { UserProfile } from '../types';
import { appStorage } from '../lib/storage';
import {
  User,
  Phone,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Wallet,
  TrendingUp,
  LogOut
} from 'lucide-react';

interface VirtualAccountSectionProps {
  user: UserProfile;
  onOpenWithdrawalModal: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

export const VirtualAccountSection: React.FC<VirtualAccountSectionProps> = ({
  user,
  onOpenWithdrawalModal,
  onUserUpdated
}) => {
  const [fullNameInput, setFullNameInput] = useState(user.fullName || '');
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullNameInput.trim()) {
      setErrorMsg('Tafadhali weka majina yako kamili.');
      return;
    }
    if (!phoneInput.trim()) {
      setErrorMsg('Tafadhali weka namba yako ya simu.');
      return;
    }

    const updated = appStorage.registerVirtualAccount(fullNameInput.trim(), phoneInput.trim());
    onUserUpdated(updated);
    setJustRegistered(true);
  };

  const handleLogout = () => {
    const updated = appStorage.updateUserProfile({
      fullName: '',
      phone: '',
      isRegistered: false
    });
    setFullNameInput('');
    setPhoneInput('');
    onUserUpdated(updated);
    setJustRegistered(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      
      {!user.isRegistered ? (
        /* 1. REGISTRATION FORM (ONLY PHONE NUMBER & NAMES) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500/30 shadow-xl shadow-blue-500/5">
          <div className="max-w-xl mx-auto space-y-4">
            
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Usajili wa Haraka wa Akaunti ya Mtandaoni</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Fungua Akaunti Yako ya SWAHILI EARN Sasa
              </h2>
              <p className="text-xs text-slate-600">
                Weka majina na namba yako ya simu tu ili kuanza kufundisha na kuona salio lako.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Majina Yako Kamili:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullNameInput}
                    onChange={e => setFullNameInput(e.target.value)}
                    placeholder="mf. Juma Hamisi Bakari"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm font-bold text-slate-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Namba ya Simu:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="mf. 0754892144"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm font-mono font-bold text-slate-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm cursor-pointer"
              >
                FUNGUA AKAUNTI SASA
              </button>
            </form>

          </div>
        </div>
      ) : (
        /* 2. REGISTERED VIRTUAL ACCOUNT DASHBOARD */
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  AKAUNTI YAKO YA MTANDAONI (DASHBOARD)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {user.fullName}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Simu: {user.phone}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Badili Akaunti"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Badili Akaunti</span>
            </button>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Salio Lililopo */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                <span>Salio la Akaunti</span>
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                TZS {user.balanceTzs.toLocaleString()}/=
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                Pesa zilizotengenezwa kupitia mazungumzo
              </span>
            </div>

            {/* Malipo Yaliyopokelewa */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                <span>Malipo Yaliyopokelewa</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                TZS {user.totalEarnedTzs.toLocaleString()}/=
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                Vipindi {user.completedSessionsCount} vimekamilika
              </span>
            </div>

          </div>

          {/* White Background Bold Text Notice */}
          <div className="bg-white text-black p-4 sm:p-5 rounded-2xl shadow-md border-2 border-amber-400">
            <p className="font-black text-xs sm:text-sm text-black leading-relaxed">
              Lipia mtaji wa 16,000/= ili kupata akaunti kamili yenye uwezo kutoa pesa zako , pesa ya mtaji ina wezesha mifumo ya miamala na kibenki ya kampuni kufanya kazi
            </p>
          </div>

          {/* WITHDRAW BUTTON */}
          <div className="pt-2">
            <button
              onClick={onOpenWithdrawalModal}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01]"
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span>TOA PESA (WITHDRAW EARNINGS)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
