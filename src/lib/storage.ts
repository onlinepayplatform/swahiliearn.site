import {
  ForeignLearner,
  UserProfile,
  AdminSettings,
  UserSession,
  VerifiedAfricanPayout,
  RegisteredVirtualAccount
} from '../types';
import { DEFAULT_FOREIGN_LEARNERS, INITIAL_VERIFIED_PAYOUTS } from './defaultProfiles';

const KEYS = {
  USER_PROFILE: 'swahiliearn_user_profile',
  FOREIGN_LEARNERS: 'swahiliearn_learners',
  SESSIONS: 'swahiliearn_sessions',
  ADMIN_SETTINGS: 'swahiliearn_admin_settings',
  VERIFIED_PAYOUTS: 'swahiliearn_verified_payouts',
  VIRTUAL_ACCOUNTS: 'swahiliearn_virtual_accounts',
  LANGUAGE: 'swahiliearn_lang'
};

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-guest-01',
  fullName: '',
  phone: '',
  balanceTzs: 160000,
  totalEarnedTzs: 160000,
  completedSessionsCount: 2,
  isRegistered: false,
  joinedDate: new Date().toISOString()
};

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adminPasscode: '8998admin',
  whatsappSupportUrl: 'https://wa.me/message/EP72QM4VJRTIA1',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029VbEGCJ3EgGfNE6THN73q',
  smsSupportNumber: '0743697677',
  sponsorName: 'ONLINEPAY DIGITAL PLATFORM',
  sponsorUrl: 'https://onlinepay-d7wjpyve.manus.space/',
  registrationExternalUrl: 'https://onlinepayplatform.com/register?ref=Didan255',
  instagramUrl: 'https://www.instagram.com/odp_tanzania?stkn=c3M0aDFiajM3Z3J3',
  tiktokUrl: 'https://www.tiktok.com/@swahiliearn.site?_r=1&_t=ZS-9AKTTdEWwMA',
  facebookUrl: 'https://www.facebook.com/share/1HgRiAX6J2/',
  capitalFeeNotice: 'Lipia mtaji wa 16,000/= ili kupata akaunti kamili yenye uwezo kutoa pesa zako , pesa ya mtaji ina wezesha mifumo ya miamala na kibenki ya kampuni kufanya kazi'
};

const INITIAL_VIRTUAL_ACCOUNTS: RegisteredVirtualAccount[] = [
  { id: 'va-1', fullName: 'Hamisi Bakari', phone: '0754892144', registeredAt: 'Dakika 12 zilizopita', balanceTzs: 160000, status: 'active' },
  { id: 'va-2', fullName: 'Rehema Juma', phone: '0714992831', registeredAt: 'Dakika 35 zilizopita', balanceTzs: 80000, status: 'active' },
  { id: 'va-3', fullName: 'Kelvin Mwangi', phone: '0722104599', registeredAt: 'Saa 1 iliyopita', balanceTzs: 240000, status: 'active' },
  { id: 'va-4', fullName: 'Zuhura Ally', phone: '0768400192', registeredAt: 'Saa 2 zilizopita', balanceTzs: 95000, status: 'active' }
];

class AppStorage {
  private listeners: Set<() => void> = new Set();
  private inMemoryStore: Record<string, string> = {};

  constructor() {
    this.initDefaults();
  }

  private getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // In-memory fallback
    }
    return this.inMemoryStore[key] || null;
  }

  private setItem(key: string, value: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // In-memory fallback
    }
    this.inMemoryStore[key] = value;
  }

  private initDefaults() {
    try {
      if (!this.getItem(KEYS.USER_PROFILE)) {
        this.setItem(KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
      }
      if (!this.getItem(KEYS.FOREIGN_LEARNERS)) {
        this.setItem(KEYS.FOREIGN_LEARNERS, JSON.stringify(DEFAULT_FOREIGN_LEARNERS));
      }
      if (!this.getItem(KEYS.ADMIN_SETTINGS)) {
        this.setItem(KEYS.ADMIN_SETTINGS, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
      }
      if (!this.getItem(KEYS.VERIFIED_PAYOUTS)) {
        this.setItem(KEYS.VERIFIED_PAYOUTS, JSON.stringify(INITIAL_VERIFIED_PAYOUTS));
      }
      if (!this.getItem(KEYS.VIRTUAL_ACCOUNTS)) {
        this.setItem(KEYS.VIRTUAL_ACCOUNTS, JSON.stringify(INITIAL_VIRTUAL_ACCOUNTS));
      }
    } catch (err) {
      console.warn('Storage initialization fallback:', err);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- User Profile ---
  public getUserProfile(): UserProfile {
    try {
      const data = this.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...updates };
    this.setItem(KEYS.USER_PROFILE, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  public registerVirtualAccount(fullName: string, phone: string): UserProfile {
    const user = this.updateUserProfile({
      fullName,
      phone,
      isRegistered: true
    });

    // Save to virtual accounts list for admin portal
    const list = this.getVirtualAccounts();
    const existingIndex = list.findIndex(a => a.phone === phone);
    const newEntry: RegisteredVirtualAccount = {
      id: 'va-' + Math.random().toString(36).substring(2, 9),
      fullName,
      phone,
      registeredAt: 'Sasa hivi',
      balanceTzs: user.balanceTzs,
      status: 'active'
    };

    if (existingIndex >= 0) {
      list[existingIndex] = newEntry;
    } else {
      list.unshift(newEntry);
    }
    this.setItem(KEYS.VIRTUAL_ACCOUNTS, JSON.stringify(list));
    this.notify();
    return user;
  }

  public getVirtualAccounts(): RegisteredVirtualAccount[] {
    try {
      const data = this.getItem(KEYS.VIRTUAL_ACCOUNTS);
      return data ? JSON.parse(data) : INITIAL_VIRTUAL_ACCOUNTS;
    } catch {
      return INITIAL_VIRTUAL_ACCOUNTS;
    }
  }

  public deleteVirtualAccount(id: string) {
    const list = this.getVirtualAccounts().filter(a => a.id !== id);
    this.setItem(KEYS.VIRTUAL_ACCOUNTS, JSON.stringify(list));
    this.notify();
  }

  public creditReward(amountTzs: number): UserProfile {
    const current = this.getUserProfile();
    const updated = {
      ...current,
      balanceTzs: current.balanceTzs + amountTzs,
      totalEarnedTzs: current.totalEarnedTzs + amountTzs,
      completedSessionsCount: current.completedSessionsCount + 1
    };
    this.setItem(KEYS.USER_PROFILE, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  // --- Foreign Learners Catalog ---
  public getForeignLearners(): ForeignLearner[] {
    try {
      const data = this.getItem(KEYS.FOREIGN_LEARNERS);
      return data ? JSON.parse(data) : DEFAULT_FOREIGN_LEARNERS;
    } catch {
      return DEFAULT_FOREIGN_LEARNERS;
    }
  }

  public saveForeignLearners(learners: ForeignLearner[]) {
    this.setItem(KEYS.FOREIGN_LEARNERS, JSON.stringify(learners));
    this.notify();
  }

  public addForeignLearner(learner: ForeignLearner) {
    const list = this.getForeignLearners();
    list.unshift(learner);
    this.saveForeignLearners(list);
  }

  public updateForeignLearner(id: string, updates: Partial<ForeignLearner>) {
    const list = this.getForeignLearners().map(item => item.id === id ? { ...item, ...updates } : item);
    this.saveForeignLearners(list);
  }

  public deleteForeignLearner(id: string) {
    const list = this.getForeignLearners().filter(item => item.id !== id);
    this.saveForeignLearners(list);
  }

  // --- Verified African Payouts ---
  public getVerifiedPayouts(): VerifiedAfricanPayout[] {
    try {
      const data = this.getItem(KEYS.VERIFIED_PAYOUTS);
      return data ? JSON.parse(data) : INITIAL_VERIFIED_PAYOUTS;
    } catch {
      return INITIAL_VERIFIED_PAYOUTS;
    }
  }

  public saveVerifiedPayouts(payouts: VerifiedAfricanPayout[]) {
    this.setItem(KEYS.VERIFIED_PAYOUTS, JSON.stringify(payouts));
    this.notify();
  }

  public addVerifiedPayout(payout: VerifiedAfricanPayout) {
    const list = this.getVerifiedPayouts();
    list.unshift(payout);
    this.saveVerifiedPayouts(list);
  }

  public deleteVerifiedPayout(id: string) {
    const list = this.getVerifiedPayouts().filter(p => p.id !== id);
    this.saveVerifiedPayouts(list);
  }

  // --- Sessions History ---
  public getSessions(): UserSession[] {
    try {
      const data = this.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveSession(session: UserSession) {
    const sessions = this.getSessions();
    sessions.unshift(session);
    this.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    this.notify();
  }

  // --- Admin Settings ---
  public getAdminSettings(): AdminSettings {
    try {
      const data = this.getItem(KEYS.ADMIN_SETTINGS);
      return data ? { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(data) } : DEFAULT_ADMIN_SETTINGS;
    } catch {
      return DEFAULT_ADMIN_SETTINGS;
    }
  }

  public updateAdminSettings(settings: Partial<AdminSettings>) {
    const current = this.getAdminSettings();
    const updated = { ...current, ...settings };
    this.setItem(KEYS.ADMIN_SETTINGS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  // --- Language state ---
  public getLanguage(): 'sw' | 'en' {
    return (this.getItem(KEYS.LANGUAGE) as 'sw' | 'en') || 'sw';
  }

  public setLanguage(lang: 'sw' | 'en') {
    this.setItem(KEYS.LANGUAGE, lang);
    this.notify();
  }
}

export const appStorage = new AppStorage();
