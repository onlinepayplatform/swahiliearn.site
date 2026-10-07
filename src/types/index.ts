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
  location: string;
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

export type MobileNetwork = 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  network: MobileNetwork;
  amountTzs: number;
  feeTzs: number;
  netAmountTzs: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: string;
  transactionId: string;
  note?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  region: string;
  balanceTzs: number;
  totalEarnedTzs: number;
  pendingTzs: number;
  totalWithdrawnTzs: number;
  isActivated: boolean;
  activationFeeTzs: number;
  completedSessionsCount: number;
  joinedDate: string;
}

export interface AdminSettings {
  adminPasscode: string;
  whatsappUrl: string;
  supportPhone: string;
  minWithdrawalTzs: number;
  activationNotice: string;
  bannerMessage: string;
  liveVisitorsBase: number;
  sponsorName: string;
}

export interface RecentPayout {
  id: string;
  name: string;
  amountTzs: number;
  network: string;
  location: string;
  timeAgo: string;
}
