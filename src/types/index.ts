export type LearnerStatus = 'online' | 'in_chat' | 'offline';
export type LearnerProfession = 'tourist' | 'doctor' | 'college student' | 'researcher' | 'engineer';

export interface ForeignLearner {
  id: string;
  name: string;
  age: number;
  country: string;
  countryCode: string;
  flag: string;
  avatarUrl: string;
  profession: string;
  professionCategory: LearnerProfession;
  location: string; // Origin location like California, USA or London, UK
  bio: string;
  learningGoal: string;
  rating: number;
  reviewsCount: number;
  payPer10Min: number; // in TZS, e.g. 80000
  sessionDurationSeconds: number; // e.g. 600
  status: LearnerStatus;
  languageLevel: 'Beginner (Anayeanza)' | 'Elementary (Msingi)' | 'Novice (Mgeni Kabisa)';
  interests: string[];
  defaultFirstMessage: string;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'learner' | 'system';
  text: string;
  translation?: string;
  timestamp: string;
  isAudio?: boolean;
}

export interface UserSession {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerAvatar: string;
  learnerCountry: string;
  learnerFlag: string;
  startedAt: string;
  durationSeconds: number;
  earnedTzs: number;
  status: 'active' | 'completed' | 'cancelled';
  messagesCount: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  balanceTzs: number;
  totalEarnedTzs: number;
  completedSessionsCount: number;
  isRegistered: boolean;
  joinedDate: string;
}

export interface AdminSettings {
  adminPasscode: string;
  whatsappSupportUrl: string;
  whatsappChannelUrl: string;
  smsSupportNumber: string;
  sponsorName: string;
  sponsorUrl: string;
  registrationExternalUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  capitalFeeNotice: string;
}

export interface VerifiedAfricanPayout {
  id: string;
  name: string;
  amount: string; // e.g. "180,000 Tsh" or "2,000 Ksh"
  location: string; // e.g. "Dar es Salaam, Tanzania"
  country: string;
  countryFlag: string;
  method: string; // e.g. "Halopesa", "Safaricom M-Pesa"
  timeAgo: string; // e.g. "Sasa hivi", "Sekunde 15 zilizopita"
}

export interface RegisteredVirtualAccount {
  id: string;
  fullName: string;
  phone: string;
  registeredAt: string;
  balanceTzs: number;
  status: 'active' | 'pending_capital';
}
