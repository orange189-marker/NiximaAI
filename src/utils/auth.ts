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
    createdAt: 1700000000000,
    avatarBg: 'from-zinc-100 to-zinc-400 text-black',
    credits: 1000,
  },
  {
    id: 'usr-creator-orange17',
    name: 'Orange17 (Creator)',
    handle: 'orange17',
    email: 'orange17@nixima.ai',
    passphrase: 'nixima2026',
    role: 'Creator & Lead Architect',
    createdAt: 1700000000000,
    avatarBg: 'from-amber-500 to-orange-600 text-white',
    credits: Infinity,
    isCreator: true,
    unlimitedCredits: true,
  },
  {
    id: 'usr-vip-warexxq',
    name: 'warexxq',
    handle: 'warexxq',
    email: 'warexxq@nixima.ai',
    passphrase: 'warexxq2026',
    role: 'VIP Friend & Pioneer Architect',
    createdAt: 1700000000000,
    avatarBg: 'from-cyan-500 via-indigo-500 to-purple-600 text-white',
    credits: Infinity,
    isVip: true,
    unlimitedCredits: true,
  },
  {
    id: 'usr-vip-roman1980',
    name: 'roman1980',
    handle: 'roman1980',
    email: 'roman1980@nixima.ai',
    passphrase: '1980roman',
    role: 'VIP Family & Honored Pioneer',
    createdAt: 1700000000000,
    avatarBg: 'from-blue-600 via-indigo-600 to-cyan-500 text-white',
    preferredLanguage: 'uk',
    credits: Infinity,
    isVip: true,
    unlimitedCredits: true,
  }
];

export function getAllUsers(): NiximaUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let users = parsed.map((u: NiximaUser) => {
          const email = (u.email || '').toLowerCase();
          const handle = (u.handle || '').toLowerCase();
          const isCreator = email === 'orange17@nixima.ai' || handle === 'orange17' || u.isCreator === true;
          const isDad = email === 'roman1980@nixima.ai' || handle === 'roman1980';
          const isVip = email === 'warexxq@nixima.ai' || handle === 'warexxq' || isDad || u.isVip === true;
          const hasInfinite = isCreator || isVip || u.unlimitedCredits === true;
          return {
            ...u,
            credits: hasInfinite ? Infinity : (typeof u.credits === 'number' ? u.credits : 1000),
            isCreator: isCreator,
            isVip: isVip,
            unlimitedCredits: hasInfinite,
            preferredLanguage: isDad ? 'uk' : (u.preferredLanguage || 'en'),
            role: isCreator ? 'Creator & Lead Architect' : isDad ? 'VIP Family & Honored Pioneer' : isVip ? (u.role || 'VIP Friend & Pioneer Architect') : u.role,
          };
        });

        // Ensure creator is present
        if (!users.some((u: NiximaUser) => (u.email || '').toLowerCase() === 'orange17@nixima.ai')) {
          users = [...users, DEFAULT_USERS[1]];
        }
        // Ensure warexxq VIP is present
        if (!users.some((u: NiximaUser) => (u.email || '').toLowerCase() === 'warexxq@nixima.ai')) {
          users = [...users, DEFAULT_USERS[2]];
        }
        // Ensure roman1980 VIP Family is present
        if (!users.some((u: NiximaUser) => (u.email || '').toLowerCase() === 'roman1980@nixima.ai')) {
          users = [...users, DEFAULT_USERS[3]];
        }
        return users;
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
  const found = users.find(u => u.id === currentId) || null;
  if (found && ((found.email || '').toLowerCase() === 'orange17@nixima.ai' || (found.handle || '').toLowerCase() === 'orange17')) {
    return {
      ...found,
      credits: Infinity,
      isCreator: true,
      unlimitedCredits: true,
      role: 'Creator & Lead Architect',
    };
  }
  return found;
}

export function setActiveUser(user: NiximaUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_ID, user.id);
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_ID);
  }
}

/**
 * Cross-Device Synchronization with local Vite dev server and remote Vercel API.
 * Ensures accounts created on a laptop are immediately accessible on mobile devices.
 */
export async function syncAccountsWithServer(): Promise<NiximaUser[]> {
  const localUsers = getAllUsers();
  
  if (typeof window === 'undefined') return localUsers;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/accounts', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return localUsers;
    }

    const data = await res.json();
    const serverUsers: NiximaUser[] = Array.isArray(data.users) ? data.users : [];

    // Merge accounts seamlessly:
    // Key by handle.toLowerCase()
    const mergedMap = new Map<string, NiximaUser>();
    
    // Server users first
    for (const u of serverUsers) {
      if (u && u.handle) {
        mergedMap.set(u.handle.toLowerCase(), u);
      }
    }

    // Local users next (if newer or not yet on server, merge in)
    let hasLocalUnsynced = false;
    for (const u of localUsers) {
      if (u && u.handle) {
        const key = u.handle.toLowerCase();
        if (!mergedMap.has(key)) {
          mergedMap.set(key, u);
          hasLocalUnsynced = true;
        } else {
          // If local has newer timestamp, keep local
          const serverU = mergedMap.get(key)!;
          if ((u.createdAt || 0) > (serverU.createdAt || 0)) {
            mergedMap.set(key, u);
            hasLocalUnsynced = true;
          }
        }
      }
    }

    const merged = Array.from(mergedMap.values());
    saveUsers(merged);

    // If local device had accounts the server didn't have, push merged upstream
    if (hasLocalUnsynced) {
      try {
        await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: merged })
        });
      } catch (err) {
        // non-blocking
      }
    }

    return merged;
  } catch (err) {
    // Graceful offline fallback
    return localUsers;
  }
}

export async function loginUserAsync(handleOrEmail: string, passphrase: string): Promise<NiximaUser> {
  const normalized = handleOrEmail.trim().toLowerCase().replace('@nixima.ai', '');

  // 1. Check local storage first
  let users = getAllUsers();
  let matched = users.find(u => 
    u.handle.toLowerCase() === normalized || 
    u.email.toLowerCase() === `${normalized}@nixima.ai`
  );

  // 2. If not found locally, sync with server (in case registered on another device like laptop or phone)
  if (!matched) {
    try {
      users = await syncAccountsWithServer();
      matched = users.find(u => 
        u.handle.toLowerCase() === normalized || 
        u.email.toLowerCase() === `${normalized}@nixima.ai`
      );
    } catch (e) {
      // offline
    }
  }

  if (!matched) {
    throw new Error(`Account "${normalized}@nixima.ai" was not found on this mesh terminal.`);
  }

  if (matched.passphrase !== passphrase.trim()) {
    throw new Error('Incorrect passphrase. Please verify your credentials.');
  }

  setActiveUser(matched);
  saveQuickPassUser(matched);
  return matched;
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
  saveQuickPassUser(matched);
  return matched;
}

export async function registerUserAsync(
  name: string, 
  handle: string, 
  passphrase: string,
  preferredLanguage?: 'en' | 'uk'
): Promise<NiximaUser> {
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

  // Pre-sync with server to make sure another device didn't just register this handle
  let currentUsers = getAllUsers();
  try {
    currentUsers = await syncAccountsWithServer();
  } catch (e) {
    // continue with local check
  }

  const exists = currentUsers.some(u => u.handle.toLowerCase() === cleanHandle);
  if (exists) {
    throw new Error(`The handle "${cleanHandle}@nixima.ai" is already registered.`);
  }

  const isCreator = cleanHandle.toLowerCase() === 'orange17';
  const isDad = cleanHandle.toLowerCase() === 'roman1980';
  const isVip = cleanHandle.toLowerCase() === 'warexxq' || isDad;
  const hasInfinite = isCreator || isVip;
  const newUser: NiximaUser = {
    id: isCreator ? 'usr-creator-orange17' : isDad ? 'usr-vip-roman1980' : isVip ? 'usr-vip-warexxq' : 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: cleanName,
    handle: cleanHandle,
    email: `${cleanHandle}@nixima.ai`,
    passphrase: passphrase.trim(),
    role: isCreator ? 'Creator & Lead Architect' : isDad ? 'VIP Family & Honored Pioneer' : isVip ? 'VIP Friend & Pioneer Architect' : 'Pioneer Researcher',
    createdAt: Date.now(),
    avatarBg: isCreator ? 'from-amber-500 to-orange-600 text-white' : isDad ? 'from-blue-600 via-indigo-600 to-cyan-500 text-white' : isVip ? 'from-cyan-500 via-indigo-500 to-purple-600 text-white' : 'from-zinc-800 to-zinc-950 text-white',
    preferredLanguage: isDad ? 'uk' : (preferredLanguage || 'en'),
    credits: hasInfinite ? Infinity : 1000,
    isCreator: isCreator,
    isVip: isVip,
    unlimitedCredits: hasInfinite,
  };

  const updated = [newUser, ...currentUsers.filter(u => u.handle.toLowerCase() !== cleanHandle)];
  saveUsers(updated);
  setActiveUser(newUser);
  saveQuickPassUser(newUser);

  // Broadcast to mesh server so phone / other terminals immediately get it
  try {
    await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser })
    });
  } catch (err) {
    console.warn('Mesh broadcast deferred; saved locally:', err);
  }

  return newUser;
}

export function registerUser(
  name: string, 
  handle: string, 
  passphrase: string,
  preferredLanguage?: 'en' | 'uk'
): NiximaUser {
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

  const isCreatorSync = cleanHandle.toLowerCase() === 'orange17';
  const isDadSync = cleanHandle.toLowerCase() === 'roman1980';
  const isVipSync = cleanHandle.toLowerCase() === 'warexxq' || isDadSync;
  const hasInfiniteSync = isCreatorSync || isVipSync;
  const newUser: NiximaUser = {
    id: isCreatorSync ? 'usr-creator-orange17' : isDadSync ? 'usr-vip-roman1980' : isVipSync ? 'usr-vip-warexxq' : 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    name: cleanName,
    handle: cleanHandle,
    email: `${cleanHandle}@nixima.ai`,
    passphrase: passphrase.trim(),
    role: isCreatorSync ? 'Creator & Lead Architect' : isDadSync ? 'VIP Family & Honored Pioneer' : isVipSync ? 'VIP Friend & Pioneer Architect' : 'Pioneer Researcher',
    createdAt: Date.now(),
    avatarBg: isCreatorSync ? 'from-amber-500 to-orange-600 text-white' : isDadSync ? 'from-blue-600 via-indigo-600 to-cyan-500 text-white' : isVipSync ? 'from-cyan-500 via-indigo-500 to-purple-600 text-white' : 'from-zinc-800 to-zinc-950 text-white',
    preferredLanguage: isDadSync ? 'uk' : (preferredLanguage || 'en'),
    credits: hasInfiniteSync ? Infinity : 1000,
    isCreator: isCreatorSync,
    isVip: isVipSync,
    unlimitedCredits: hasInfiniteSync,
  };

  const updated = [newUser, ...users];
  saveUsers(updated);
  setActiveUser(newUser);
  saveQuickPassUser(newUser);

  // Async push to server in fire-and-forget mode
  if (typeof window !== 'undefined') {
    fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser })
    }).catch(() => {});
  }

  return newUser;
}

/**
 * 1-Click Instant VIP Access for creator's friends and family (warexxq, roman1980)
 */
export function quickLoginVip(handleOrEmail = 'warexxq'): NiximaUser {
  const users = getAllUsers();
  const clean = handleOrEmail.trim().toLowerCase().replace('@nixima.ai', '');
  let matched = users.find(u => u.handle.toLowerCase() === clean || u.email.toLowerCase() === `${clean}@nixima.ai`);
  if (!matched) {
    if (clean === 'warexxq') {
      matched = DEFAULT_USERS[2];
    } else if (clean === 'roman1980') {
      matched = DEFAULT_USERS[3];
    } else {
      throw new Error(`VIP user "${handleOrEmail}" not found.`);
    }
  }
  setActiveUser(matched);
  saveQuickPassUser(matched);
  return matched;
}

export function logoutUser(): void {
  setActiveUser(null);
}

const STORAGE_QUICK_PASS_PROFILE = 'nixima_quick_pass_profile_v1';
const STORAGE_QUICK_PASS_ENABLED = 'nixima_quick_pass_enabled_v1';

export function isQuickPassEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_QUICK_PASS_ENABLED);
  return stored !== 'false';
}

export function setQuickPassEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_QUICK_PASS_ENABLED, enabled ? 'true' : 'false');
  if (!enabled) {
    localStorage.removeItem(STORAGE_QUICK_PASS_PROFILE);
  }
}

export function getQuickPassUser(): NiximaUser | null {
  if (typeof window === 'undefined') return null;
  if (!isQuickPassEnabled()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_QUICK_PASS_PROFILE);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    const users = getAllUsers();
    // Validate against user registry
    return users.find(u => u.id === profile.id) || null;
  } catch (e) {
    return null;
  }
}

export function saveQuickPassUser(user: NiximaUser | null): void {
  if (typeof window === 'undefined') return;
  if (user && isQuickPassEnabled()) {
    localStorage.setItem(STORAGE_QUICK_PASS_PROFILE, JSON.stringify(user));
  } else if (!user) {
    localStorage.removeItem(STORAGE_QUICK_PASS_PROFILE);
  }
}

export function clearQuickPass(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_QUICK_PASS_PROFILE);
}

export async function checkHandleAvailabilityAsync(handle: string): Promise<{ available: boolean; reason?: string }> {
  const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').replace('@nixima.ai', '');
  if (!cleanHandle) {
    return { available: false, reason: 'Enter a handle' };
  }
  if (cleanHandle.length < 3) {
    return { available: false, reason: 'At least 3 characters needed' };
  }

  // 1. Fast local check
  const localUsers = getAllUsers();
  if (localUsers.some(u => u.handle.toLowerCase() === cleanHandle)) {
    return { available: false, reason: 'Handle already taken' };
  }

  // 2. Server check
  try {
    const res = await fetch(`/api/accounts/check?handle=${encodeURIComponent(cleanHandle)}`);
    if (res.ok) {
      const data = await res.json();
      if (!data.available) {
        return { available: false, reason: 'Handle already taken' };
      }
    }
  } catch (err) {
    // Offline fallback
  }

  return { available: true };
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

/**
 * Export Sovereign Sync Key (Crossover Link Key)
 * Allows seamless 1-click cross-device crossover even across air-gapped networks.
 */
export function exportSovereignSyncKey(): string {
  const users = getAllUsers();
  const active = getActiveUser();
  const payload = {
    v: 1,
    ts: Date.now(),
    activeId: active?.id,
    users
  };
  const json = JSON.stringify(payload);
  const b64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(json))) : Buffer.from(json).toString('base64');
  return `NXK-${b64}`;
}

export async function importSovereignSyncKey(key: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const clean = key.trim();
    if (!clean.startsWith('NXK-')) {
      throw new Error('Invalid key prefix. Sovereign keys must begin with "NXK-"');
    }
    const b64 = clean.slice(4);
    const json = typeof window !== 'undefined' ? decodeURIComponent(escape(atob(b64))) : Buffer.from(b64, 'base64').toString('utf8');
    const payload = JSON.parse(json);

    if (!payload.users || !Array.isArray(payload.users)) {
      throw new Error('Corrupted or unrecognized key format.');
    }

    const current = getAllUsers();
    const map = new Map<string, NiximaUser>();
    for (const u of current) {
      if (u?.handle) map.set(u.handle.toLowerCase(), u);
    }
    for (const u of payload.users) {
      if (u?.handle) map.set(u.handle.toLowerCase(), u);
    }
    const merged = Array.from(map.values());
    saveUsers(merged);

    // If active user in payload exists, set quick pass / active user
    if (payload.activeId) {
      const active = merged.find(u => u.id === payload.activeId);
      if (active) {
        saveQuickPassUser(active);
        setActiveUser(active);
      }
    }

    // Push to server mesh
    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: merged })
      });
    } catch (e) {
      // offline
    }

    return { success: true, count: merged.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Import failed.' };
  }
}


