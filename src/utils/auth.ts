import { NiximaUser } from '../types/user';

const STORAGE_USERS = 'nixima_accounts_registry_v1';
const STORAGE_CURRENT_USER_ID = 'nixima_active_session_user_id';

const DEFAULT_USERS: NiximaUser[] = [
  {
    id: 'usr-founder',
    name: 'Bogdan',
    handle: 'bogdan',
    email: 'bogdan@nixima.ai',
    passphrase: 'nixima2026',
    role: 'Founding Operator',
    createdAt: Date.now() - 86400000 * 7,
    avatarBg: 'from-zinc-100 to-zinc-400 text-black',
  }
];

export function getAllUsers(): NiximaUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  // Initialize default users if empty
  localStorage.setItem(STORAGE_USERS, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function saveUsers(users: NiximaUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function getActiveUser(): NiximaUser | null {
  if (typeof window === 'undefined') return null;
  const users = getAllUsers();
  const currentId = localStorage.getItem(STORAGE_CURRENT_USER_ID);
  if (!currentId) return null;
  return users.find(u => u.id === currentId) || null;
}

export function setActiveUser(user: NiximaUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_ID, user.id);
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_ID);
  }
}

export function loginUser(handleOrEmail: string, passphrase: string): NiximaUser {
  const users = getAllUsers();
  const normalized = handleOrEmail.trim().toLowerCase().replace('@nixima.ai', '');

  const matched = users.find(u => 
    u.handle.toLowerCase() === normalized || 
    u.email.toLowerCase() === `${normalized}@nixima.ai`
  );

  if (!matched) {
    throw new Error(`Account "${normalized}@nixima.ai" was not found.`);
  }

  if (matched.passphrase !== passphrase.trim()) {
    throw new Error('Incorrect passphrase. Please verify your credentials.');
  }

  setActiveUser(matched);
  return matched;
}

export function registerUser(name: string, handle: string, passphrase: string): NiximaUser {
  const users = getAllUsers();
  const cleanName = name.trim();
  const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').replace('@nixima.ai', '');

  if (!cleanName) {
    throw new Error('Please enter your full name or callsign.');
  }

  if (cleanHandle.length < 3) {
    throw new Error('Nixima handle must be at least 3 characters.');
  }

  if (passphrase.trim().length < 4) {
    throw new Error('Passphrase must be at least 4 characters.');
  }

  const exists = users.some(u => u.handle.toLowerCase() === cleanHandle);
  if (exists) {
    throw new Error(`The handle "${cleanHandle}@nixima.ai" is already registered.`);
  }

  const newUser: NiximaUser = {
    id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: cleanName,
    handle: cleanHandle,
    email: `${cleanHandle}@nixima.ai`,
    passphrase: passphrase.trim(),
    role: 'Pioneer Researcher',
    createdAt: Date.now(),
    avatarBg: 'from-zinc-800 to-zinc-950 text-white',
  };

  const updated = [newUser, ...users];
  saveUsers(updated);
  setActiveUser(newUser);
  return newUser;
}

export function logoutUser(): void {
  setActiveUser(null);
}

export function checkHandleAvailability(handle: string): { available: boolean; reason?: string } {
  const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').replace('@nixima.ai', '');
  if (!cleanHandle) {
    return { available: false, reason: 'Enter a handle' };
  }
  if (cleanHandle.length < 3) {
    return { available: false, reason: 'At least 3 characters needed' };
  }
  const users = getAllUsers();
  const exists = users.some(u => u.handle.toLowerCase() === cleanHandle);
  if (exists) {
    return { available: false, reason: 'Handle already taken' };
  }
  return { available: true };
}

