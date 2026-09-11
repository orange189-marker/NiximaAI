import { NiximaUser } from '../types/user';
import { ModelOption, ThinkingMode } from '../types/chat';
import { getAllUsers, saveUsers, setActiveUser, getActiveUser, isDadAccount } from './auth';

export const DEFAULT_INITIAL_CREDITS = 1000;
export const DAILY_GRANT_AMOUNT = 500;
export const DEVELOPER_TOPUP_AMOUNT = 1000;
export const NIXIMA_CREDITS_EVENT = 'nixima_credits_changed';

export interface CreditCostBreakdown {
  credits: number;
  inputCost: number;
  outputCost: number;
  thinkingCost: number;
  modelMultiplier: number;
  isHardPrompt: boolean;
}

/**
 * Detects if a user is the Creator account (orange17@nixima.ai) or has sovereign infinite credits.
 */
export function isCreatorAccount(user?: NiximaUser | null): boolean {
  if (!user) {
    const active = getActiveUser();
    if (!active) return false;
    return checkCreator(active);
  }
  return checkCreator(user);
}

function checkCreator(user: NiximaUser): boolean {
  const email = (user.email || '').toLowerCase().trim();
  const handle = (user.handle || '').toLowerCase().trim();
  return (
    email === 'orange17@nixima.ai' ||
    handle === 'orange17' ||
    email === 'warexxq@nixima.ai' ||
    handle === 'warexxq' ||
    email === 'roman1980@nixima.ai' ||
    handle === 'roman1980' ||
    isDadAccount(user) ||
    user.isCreator === true ||
    user.isVip === true ||
    user.unlimitedCredits === true ||
    user.role === 'Creator & Lead Architect'
  );
}

/**
 * Checks if an account is a VIP friend or family account (e.g. warexxq, roman1980)
 */
export function isVipAccount(user?: NiximaUser | null): boolean {
  if (!user) user = getActiveUser();
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const handle = (user.handle || '').toLowerCase().trim();
  return (
    email === 'warexxq@nixima.ai' ||
    handle === 'warexxq' ||
    email === 'roman1980@nixima.ai' ||
    handle === 'roman1980' ||
    isDadAccount(user) ||
    user.isVip === true
  );
}

/**
 * Retrieves the current balance for the given user, returning Infinity for the Creator (orange17@nixima.ai).
 */
export function getUserCredits(user?: NiximaUser | null): number {
  if (isCreatorAccount(user)) {
    return Infinity;
  }
  if (!user) {
    const active = getActiveUser();
    if (!active) return DEFAULT_INITIAL_CREDITS;
    if (isCreatorAccount(active)) return Infinity;
    return typeof active.credits === 'number' ? active.credits : DEFAULT_INITIAL_CREDITS;
  }
  return typeof user.credits === 'number' ? user.credits : DEFAULT_INITIAL_CREDITS;
}

/**
 * Calculates a live real-time estimated credit cost for the chat input dock based on:
 * - Current prompt length
 * - Model architecture tier (Flash 0.5x, Default 1.0x, Coder 1.5x, Reasoning 2.5x)
 * - Deep Think flag (additional compute power)
 * - Prompt complexity heuristics (code snippets, mathematical proofs, multiline datasets)
 */
export function calculateEstimatedCost(
  prompt: string,
  model: ModelOption,
  deepThink: boolean,
  thinkingMode?: ThinkingMode
): { minCost: number; maxCost: number; isHardPrompt: boolean } {
  const modelMult = model.creditMultiplier || 1.0;
  const baseMin = model.baseCreditCost || 5;

  const cleanPrompt = prompt.trim();
  const inputLen = cleanPrompt.length;

  const isThinkingActive = Boolean(thinkingMode === 'basic' || thinkingMode === 'deep' || deepThink);
  const isDeep = thinkingMode === 'deep' || (deepThink && thinkingMode !== 'basic');

  // Detect if the prompt is computationally "hard"
  const hasCode = /```|function|def\s+|class\s+|SELECT\s+|import\s+/i.test(cleanPrompt);
  const hasMath = /\\frac|\\int|\\sum|\\partial|\$|equation|proof|theorem/i.test(cleanPrompt);
  const isLong = inputLen > 350;
  const isHardPrompt = hasCode || hasMath || isLong || isThinkingActive || model.id.includes('reasoning');

  // Input weight
  const inputWeight = Math.max(1, Math.ceil(inputLen / 50));

  // Base estimate
  let estimatedMin = Math.round(baseMin + inputWeight * 0.8 * modelMult);
  let estimatedMax = Math.round(estimatedMin + (isHardPrompt ? 15 : 6) * modelMult);

  if (isDeep) {
    estimatedMin = Math.round(estimatedMin * 1.5);
    estimatedMax = Math.round(estimatedMax * 1.8);
  } else if (thinkingMode === 'basic') {
    estimatedMin = Math.round(estimatedMin * 1.2);
    estimatedMax = Math.round(estimatedMax * 1.35);
  }

  return {
    minCost: Math.max(baseMin, estimatedMin),
    maxCost: Math.max(baseMin + 3, estimatedMax),
    isHardPrompt,
  };
}

/**
 * Calculates the exact final credit cost upon response completion based on:
 * - Input tokens
 * - Output response tokens
 * - Extended reasoning / thinking trace tokens
 * - Model multiplier
 */
export function calculateActualCost(
  prompt: string,
  response: string,
  thinking: string | undefined,
  model: ModelOption,
  deepThink: boolean
): CreditCostBreakdown {
  const modelMult = model.creditMultiplier || 1.0;
  const baseMin = model.baseCreditCost || 5;

  // Approximate token counts (1 token ≈ 4 characters)
  const inputTokens = Math.max(1, Math.round(prompt.length / 4));
  const outputTokens = Math.max(1, Math.round(response.length / 4));
  const thinkingTokens = thinking ? Math.round(thinking.length / 4) : 0;

  // Complexity indicator
  const isHardPrompt =
    inputTokens > 100 ||
    thinkingTokens > 60 ||
    deepThink ||
    model.id.includes('reasoning') ||
    /```|\$|\\int|\\sum/i.test(prompt);

  // Compute components
  const inputCost = Math.ceil((inputTokens / 25) * modelMult);
  const outputCost = Math.ceil((outputTokens / 20) * modelMult);
  // Thinking tokens have a higher compute intensity multiplier
  const thinkingCost = thinkingTokens > 0 ? Math.ceil((thinkingTokens / 15) * modelMult * 1.3) : 0;

  const rawSum = inputCost + outputCost + thinkingCost;
  const difficultySurge = isHardPrompt ? 1.15 : 1.0;

  const finalCredits = Math.max(baseMin, Math.round(rawSum * difficultySurge));

  return {
    credits: finalCredits,
    inputCost,
    outputCost,
    thinkingCost,
    modelMultiplier: modelMult,
    isHardPrompt,
  };
}

/**
 * Deducts credits from a user, updates all local/session storage records, and notifies active listeners.
 */
export function deductUserCredits(
  user: NiximaUser,
  amount: number
): { updatedUser: NiximaUser; remainingCredits: number; deducted: number } {
  if (isCreatorAccount(user)) {
    const creatorUser: NiximaUser = {
      ...user,
      credits: Infinity,
      isCreator: true,
      unlimitedCredits: true,
    };
    return {
      updatedUser: creatorUser,
      remainingCredits: Infinity,
      deducted: 0,
    };
  }

  const currentCredits = getUserCredits(user);
  const remainingCredits = Math.max(0, currentCredits - amount);

  const updatedUser: NiximaUser = {
    ...user,
    credits: remainingCredits,
  };

  // Persist updated user
  const allUsers = getAllUsers();
  const updatedAll = allUsers.map(u => (u.id === user.id ? updatedUser : u));
  saveUsers(updatedAll);
  setActiveUser(updatedUser);

  // Broadcast event across UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(NIXIMA_CREDITS_EVENT, {
        detail: {
          userId: user.id,
          credits: remainingCredits,
          deducted: amount,
        },
      })
    );
  }

  return {
    updatedUser,
    remainingCredits,
    deducted: amount,
  };
}

export const DAILY_GRANT_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface DailyGrantStatus {
  canClaim: boolean;
  timeRemainingMs: number;
  formattedCountdown: string;
  lastClaimedAt?: number;
}

/**
 * Checks if the user is eligible for the once-a-day daily grant (24h cooldown).
 */
export function getDailyGrantStatus(user?: NiximaUser | null): DailyGrantStatus {
  if (!user) {
    user = getActiveUser();
  }
  if (!user) {
    return { canClaim: false, timeRemainingMs: DAILY_GRANT_COOLDOWN_MS, formattedCountdown: '24h 00m' };
  }

  if (isCreatorAccount(user)) {
    return { canClaim: false, timeRemainingMs: 0, formattedCountdown: '∞ (Creator)' };
  }

  const storageKey = `nixima_daily_grant_ts_${user.id}`;
  let lastClaimed = user.lastDailyGrantClaimed;
  if (typeof window !== 'undefined' && (!lastClaimed || isNaN(lastClaimed))) {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      lastClaimed = parseInt(raw, 10);
    }
  }

  if (!lastClaimed || isNaN(lastClaimed)) {
    return { canClaim: true, timeRemainingMs: 0, formattedCountdown: '0m' };
  }

  const now = Date.now();
  const elapsed = now - lastClaimed;

  if (elapsed >= DAILY_GRANT_COOLDOWN_MS) {
    return { canClaim: true, timeRemainingMs: 0, formattedCountdown: '0m', lastClaimedAt: lastClaimed };
  }

  const remainingMs = DAILY_GRANT_COOLDOWN_MS - elapsed;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const formattedCountdown = `${hours}h ${minutes}m`;

  return {
    canClaim: false,
    timeRemainingMs: remainingMs,
    formattedCountdown,
    lastClaimedAt: lastClaimed,
  };
}

/**
 * Claims the once-per-day grant (+500 CR). Enforces strict 24-hour cooldown to prevent duplication.
 */
export function claimDailyGrant(user: NiximaUser): {
  success: boolean;
  updatedUser: NiximaUser;
  newBalance: number;
  message?: string;
} {
  const status = getDailyGrantStatus(user);

  if (!status.canClaim) {
    return {
      success: false,
      updatedUser: user,
      newBalance: getUserCredits(user),
      message: `Daily grant already claimed today. Resets in ${status.formattedCountdown}.`,
    };
  }

  const now = Date.now();
  const currentCredits = getUserCredits(user);
  const newBalance = currentCredits + DAILY_GRANT_AMOUNT;

  const updatedUser: NiximaUser = {
    ...user,
    credits: newBalance,
    lastDailyGrantClaimed: now,
  };

  const allUsers = getAllUsers();
  const updatedAll = allUsers.map(u => (u.id === user.id ? updatedUser : u));
  saveUsers(updatedAll);
  setActiveUser(updatedUser);

  if (typeof window !== 'undefined') {
    localStorage.setItem(`nixima_daily_grant_ts_${user.id}`, String(now));
    window.dispatchEvent(
      new CustomEvent(NIXIMA_CREDITS_EVENT, {
        detail: {
          userId: user.id,
          credits: newBalance,
          granted: DAILY_GRANT_AMOUNT,
        },
      })
    );
  }

  return {
    success: true,
    updatedUser,
    newBalance,
  };
}

/**
 * Grants credits to a user (admin / bonus manual grant).
 */
export function grantUserCredits(
  user: NiximaUser,
  amount: number
): { updatedUser: NiximaUser; newBalance: number } {
  const currentCredits = getUserCredits(user);
  const newBalance = currentCredits + amount;

  const updatedUser: NiximaUser = {
    ...user,
    credits: newBalance,
  };

  const allUsers = getAllUsers();
  const updatedAll = allUsers.map(u => (u.id === user.id ? updatedUser : u));
  saveUsers(updatedAll);
  setActiveUser(updatedUser);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(NIXIMA_CREDITS_EVENT, {
        detail: {
          userId: user.id,
          credits: newBalance,
          granted: amount,
        },
      })
    );
  }

  return {
    updatedUser,
    newBalance,
  };
}

/**
 * Checks if the user has sufficient credits to dispatch a prompt with the chosen model.
 */
export function hasSufficientCredits(user: NiximaUser | null, model: ModelOption): boolean {
  if (isCreatorAccount(user)) return true;
  const credits = getUserCredits(user);
  const minCost = model.baseCreditCost || 2;
  return credits >= minCost;
}
