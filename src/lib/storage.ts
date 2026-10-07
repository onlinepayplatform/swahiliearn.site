import { ForeignLearner, UserProfile, WithdrawalRequest, AdminSettings, UserSession } from '../types';
import { DEFAULT_FOREIGN_LEARNERS } from './defaultProfiles';

const KEYS = {
  USER_PROFILE: 'swahiliearn_user_profile',
  FOREIGN_LEARNERS: 'swahiliearn_learners',
  WITHDRAWALS: 'swahiliearn_withdrawals',
  SESSIONS: 'swahiliearn_sessions',
  ADMIN_SETTINGS: 'swahiliearn_admin_settings',
  LEADS: 'swahiliearn_leads',
  LANGUAGE: 'swahiliearn_lang'
};

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-default-01',
  fullName: 'Juma Bakari Mwenda',
  phone: '0754892144',
  region: 'Dar es Salaam',
  balanceTzs: 160000,
  totalEarnedTzs: 320000,
  pendingTzs: 0,
  totalWithdrawnTzs: 160000,
  isActivated: false,
  activationFeeTzs: 18500,
  completedSessionsCount: 4,
  joinedDate: '2026-09-28'
};

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adminPasscode: '8998admin',
  whatsappUrl: 'https://wa.me/message/EP72QM4VJRTIA1',
  supportPhone: '+255 754 892 144',
  minWithdrawalTzs: 50000,
  activationNotice: 'Akaunti yako mpya inahitaji uthibitisho wa kiusalama (Account Activation) kabla ya kutoa fedha kwa mara ya kwanza. Wasiliana na msimamizi kupitia WhatsApp rasmi.',
  bannerMessage: '🔥 PONGEZI: Zaidi ya Watumiaji 14,800 wameshalipwa wiki hii kupitia M-Pesa, Tigo Pesa, na Airtel Money!',
  liveVisitorsBase: 12480,
  sponsorName: 'ONLINEPAY DIGITAL PLATFORM'
};

export interface VisitorLead {
  id: string;
  fullName: string;
  phone: string;
  region: string;
  timestamp: string;
  status: 'new' | 'verified' | 'withdrawn';
}

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
      if (!this.getItem(KEYS.WITHDRAWALS)) {
        const initialWithdrawals: WithdrawalRequest[] = [
          {
            id: 'tx-prev-101',
            userId: 'usr-default-01',
            userName: 'Juma Bakari Mwenda',
            phone: '0754892144',
            network: 'mpesa',
            amountTzs: 160000,
            feeTzs: 2400,
            netAmountTzs: 157600,
            status: 'completed',
            requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            transactionId: 'MPESA-TX948194',
            note: 'Malipo yamekamilika kwa ufanisi'
          }
        ];
        this.setItem(KEYS.WITHDRAWALS, JSON.stringify(initialWithdrawals));
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

  // --- Withdrawals ---
  public getWithdrawals(): WithdrawalRequest[] {
    try {
      const data = this.getItem(KEYS.WITHDRAWALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public requestWithdrawal(req: Omit<WithdrawalRequest, 'id' | 'requestedAt' | 'transactionId' | 'status'>): WithdrawalRequest {
    const user = this.getUserProfile();
    const withdrawals = this.getWithdrawals();
    
    const newReq: WithdrawalRequest = {
      ...req,
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      requestedAt: new Date().toISOString(),
      transactionId: 'SWE-' + Math.floor(100000 + Math.random() * 900000),
      status: 'pending'
    };

    // Deduct available balance
    this.updateUserProfile({
      balanceTzs: Math.max(0, user.balanceTzs - req.amountTzs),
      pendingTzs: user.pendingTzs + req.amountTzs
    });

    withdrawals.unshift(newReq);
    this.setItem(KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    this.notify();
    return newReq;
  }

  public updateWithdrawalStatus(id: string, status: WithdrawalRequest['status'], note?: string) {
    const withdrawals = this.getWithdrawals();
    const target = withdrawals.find(w => w.id === id);
    if (!target) return;

    target.status = status;
    if (note) target.note = note;

    const user = this.getUserProfile();
    if (status === 'completed' || status === 'approved') {
      // Completed payout
      this.updateUserProfile({
        pendingTzs: Math.max(0, user.pendingTzs - target.amountTzs),
        totalWithdrawnTzs: user.totalWithdrawnTzs + target.amountTzs
      });
    } else if (status === 'rejected') {
      // Refund balance
      this.updateUserProfile({
        balanceTzs: user.balanceTzs + target.amountTzs,
        pendingTzs: Math.max(0, user.pendingTzs - target.amountTzs)
      });
    }

    this.setItem(KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
    this.notify();
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

  // --- Leads / Visitor Logs ---
  public getLeads(): VisitorLead[] {
    try {
      const data = this.getItem(KEYS.LEADS);
      if (data) return JSON.parse(data);
      // Default sample leads
      const sample: VisitorLead[] = [
        { id: 'lead-1', fullName: 'Hussein Rashidi', phone: '0712399821', region: 'Dar es Salaam', timestamp: 'Dakika 10 zilizopita', status: 'verified' },
        { id: 'lead-2', fullName: 'Zawadi Mwamburi', phone: '0765991823', region: 'Arusha', timestamp: 'Dakika 25 zilizopita', status: 'new' },
        { id: 'lead-3', fullName: 'Moses Kibona', phone: '0788231902', region: 'Mwanza', timestamp: 'Saa 1 iliyopita', status: 'withdrawn' }
      ];
      this.setItem(KEYS.LEADS, JSON.stringify(sample));
      return sample;
    } catch {
      return [];
    }
  }

  public addLead(lead: Omit<VisitorLead, 'id' | 'timestamp' | 'status'>) {
    const leads = this.getLeads();
    leads.unshift({
      ...lead,
      id: 'lead-' + Math.random().toString(36).substring(2, 8),
      timestamp: 'Sasa hivi',
      status: 'new'
    });
    this.setItem(KEYS.LEADS, JSON.stringify(leads));
    this.notify();
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
