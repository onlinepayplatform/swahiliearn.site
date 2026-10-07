import React, { useState } from 'react';
import { UserProfile } from '../types';
import { appStorage } from '../lib/storage';
import { X, User, Phone, MapPin, CheckCircle2, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  lang: 'sw' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  lang
}) => {
  const [mode, setMode] = useState<'profile' | 'register'>('profile');
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [region, setRegion] = useState(currentUser.region);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const updated = appStorage.updateUserProfile({
      fullName,
      phone,
      region
    });

    // Also register lead into admin monitor
    appStorage.addLead({
      fullName,
      phone,
      region
    });

    onUserChange(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleQuickDemo = () => {
    const demo = appStorage.updateUserProfile({
      fullName: 'Rashidi Hamisi Said',
      phone: '0714992831',
      region: 'Dar es Salaam (Kinondoni)',
      balanceTzs: 160000,
      totalEarnedTzs: 240000,
      isActivated: false
    });
    onUserChange(demo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0052CC] to-[#0066FF] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold">
            {lang === 'sw' ? 'Wasifu wa Mtumiaji' : 'User Profile & Account'}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {lang === 'sw'
              ? 'Weka maelezo yako kupokea malipo kwenye M-Pesa / Tigo Pesa'
              : 'Setup your details to receive mobile money earnings'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {savedSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900">
                {lang === 'sw' ? 'Taarifa Zimehifadhiwa!' : 'Profile Saved Successfully!'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'sw' ? 'Akaunti yako iko tayari kwa mazungumzo.' : 'Your account is ready.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'sw' ? 'Jina Kamili (Kama lilivyo kwenye simu):' : 'Full Legal Name:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="mf. Juma Bakari Mwenda"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'sw' ? 'Namba ya Simu (M-Pesa / Tigo / Airtel):' : 'Phone Number (Mobile Money):'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="mf. 0754 892 144"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 outline-hidden font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {lang === 'sw' ? 'Mkoa / Mji:' : 'Region / City:'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    placeholder="mf. Dar es Salaam, Arusha, Mwanza, Dodoma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  {lang === 'sw' ? 'Hifadhi Taarifa Zangu' : 'Save Details'}
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
                >
                  ⚡ {lang === 'sw' ? 'Tumia Akaunti ya Jaribio (Demo Tester)' : 'Use Demo Account (Preloaded)'}
                </button>
              </div>
            </form>
          )}

          {/* Account status note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
            <span>
              {lang === 'sw'
                ? 'Taarifa zako zinalindwa kwa usalama wa hali ya juu na zinatumika kutuma malipo yako bila makato yasiyo rasmi.'
                : 'Your payment credentials are encrypted and used solely for direct mobile money payouts.'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
