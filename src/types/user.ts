export interface NiximaUser {
  id: string;
  name: string;
  handle: string; // e.g. "bogdan", "alex"
  email: string;  // e.g. "bogdan@nixima.ai", "alex@nixima.ai"
  passphrase: string;
  role: string;   // e.g. "Founding Operator", "Pioneer Researcher"
  createdAt: number;
  avatarBg?: string;
  preferredLanguage?: 'en' | 'uk';
  credits?: number;
  isCreator?: boolean;
  unlimitedCredits?: boolean;
  lastDailyGrantClaimed?: number;
}

export interface AuthSession {
  userId: string;
  token: string;
  timestamp: number;
}
