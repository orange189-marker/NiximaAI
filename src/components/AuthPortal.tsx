import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Key, 
  Sparkles, 
  AlertCircle, 
  Check, 
  ChevronLeft,
  ShieldCheck,
  Zap,
  UserCheck,
  RefreshCw,
  Copy,
  Smartphone,
  Laptop,
  Globe,
  X,
  Share2
} from 'lucide-react';
import { NiximaUser } from '../types/user';
import { 
  loginUser, 
  loginUserAsync,
  registerUser, 
  registerUserAsync,
  checkHandleAvailability, 
  checkHandleAvailabilityAsync,
  syncAccountsWithServer,
  exportSovereignSyncKey,
  importSovereignSyncKey,
  getQuickPassUser, 
  saveQuickPassUser, 
  clearQuickPass,
  isQuickPassEnabled, 
  setQuickPassEnabled,
  setActiveUser
} from '../utils/auth';
import { playTypingTick, playCompletionChime, playOpticToggle, playVaultUnlockChord } from '../utils/sound';

import { DynamicWallpaper } from './DynamicWallpaper';
import { AnimatedEye } from './AnimatedEye';
import { NiximaIdLogo } from './NiximaIdLogo';

interface AuthPortalProps {
  onAuthenticated: (user: NiximaUser) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthenticated }) => {
  // Quick Pass state (1-Click Fast Sign-In)
  const [quickPassUser, setQuickPassUser] = useState<NiximaUser | null>(() => getQuickPassUser());
  const [quickPassEnabled, setQuickPassEnabledState] = useState<boolean>(() => isQuickPassEnabled());
  const [showManualAuth, setShowManualAuth] = useState<boolean>(false);

  // Authentication mode and step
  const [mode, setMode] = useState<'register' | 'signin'>('register');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  
  // Sign In form state
  const [loginHandle, setLoginHandle] = useState('');
  const [loginPassphrase, setLoginPassphrase] = useState('');

  // Register form state
  const [regHandle, setRegHandle] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassphrase, setRegPassphrase] = useState('');

  // UI interaction states
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingStep1, setIsVerifyingStep1] = useState(false);

  // Cross-device sync & crossover states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'synced' | 'error'>('idle');
  const [showCrossoverModal, setShowCrossoverModal] = useState(false);
  const [crossoverInputKey, setCrossoverInputKey] = useState('');
  const [crossoverMsg, setCrossoverMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Cinematic launch transition states
  const [launchingUser, setLaunchingUser] = useState<NiximaUser | null>(null);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Normalized handle preview
  const cleanHandle = regHandle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').replace('@nixima.ai', '');
  const [asyncAvailability, setAsyncAvailability] = useState<{ available: boolean; reason?: string } | null>(null);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);

  // Initial accounts sync on mount (connect laptop <-> phone)
  useEffect(() => {
    let isMounted = true;
    setIsSyncing(true);
    syncAccountsWithServer()
      .then(() => {
        if (isMounted) {
          setQuickPassUser(getQuickPassUser());
          setSyncStatus('synced');
          setIsSyncing(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSyncStatus('idle');
          setIsSyncing(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Real-time debounced handle availability check with server
  useEffect(() => {
    if (!cleanHandle || cleanHandle.length < 3) {
      setAsyncAvailability(null);
      return;
    }
    let active = true;
    setIsCheckingHandle(true);
    const timer = setTimeout(async () => {
      try {
        const res = await checkHandleAvailabilityAsync(cleanHandle);
        if (active) {
          setAsyncAvailability(res);
          setIsCheckingHandle(false);
        }
      } catch (e) {
        if (active) {
          setAsyncAvailability(checkHandleAvailability(cleanHandle));
          setIsCheckingHandle(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [cleanHandle]);

  const availability = asyncAvailability || checkHandleAvailability(cleanHandle);

  // Force Mesh Sync trigger
  const handleForceSync = async () => {
    setIsSyncing(true);
    setCrossoverMsg(null);
    try {
      const merged = await syncAccountsWithServer();
      setQuickPassUser(getQuickPassUser());
      setSyncStatus('synced');
      setCrossoverMsg({
        type: 'success',
        text: `Sync complete! Mesh registry active with ${merged.length} registered sovereign accounts.`
      });
    } catch (e: any) {
      setCrossoverMsg({
        type: 'error',
        text: 'Mesh sync network error. Please verify server connectivity.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Copy Sovereign Link Key to clipboard
  const handleCopySovereignKey = () => {
    try {
      const key = exportSovereignSyncKey();
      navigator.clipboard.writeText(key);
      setCopiedKey(true);
      playCompletionChime();
      setTimeout(() => setCopiedKey(false), 2500);
      setCrossoverMsg({
        type: 'success',
        text: 'Sovereign Link Key copied! Paste it into your phone or other device to link accounts.'
      });
    } catch (e) {
      setCrossoverMsg({
        type: 'error',
        text: 'Clipboard access denied. Please copy manually.'
      });
    }
  };

  // Import Sovereign Link Key
  const handleImportSovereignKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crossoverInputKey.trim()) return;

    try {
      const res = await importSovereignSyncKey(crossoverInputKey);
      if (res.success) {
        playVaultUnlockChord();
        const updatedUser = getQuickPassUser();
        setQuickPassUser(updatedUser);
        setCrossoverInputKey('');
        setCrossoverMsg({
          type: 'success',
          text: `Success! Linked ${res.count} accounts into this terminal.`
        });
      } else {
        setCrossoverMsg({
          type: 'error',
          text: res.error || 'Invalid key format.'
        });
      }
    } catch (err: any) {
      setCrossoverMsg({
        type: 'error',
        text: err.message || 'Key import failed.'
      });
    }
  };

  // Silky smooth cinematic launch sequence
  const triggerCinematicLaunch = (user: NiximaUser) => {
    setLaunchingUser(user);
    playVaultUnlockChord();

    // Progress increments for bootup telemetry
    setLaunchProgress(20);
    setTimeout(() => setLaunchProgress(55), 240);
    setTimeout(() => setLaunchProgress(88), 500);
    setTimeout(() => setLaunchProgress(100), 750);

    // Fade out portal
    setTimeout(() => {
      setIsFadingOut(true);
    }, 850);

    // Transition smoothly into main workspace
    setTimeout(() => {
      onAuthenticated(user);
    }, 1250);
  };

  // 1-Click Fast Sign In handler
  const handleQuickPassSignIn = () => {
    if (!quickPassUser) return;
    setError(null);
    setIsSubmitting(true);
    try {
      playTypingTick();
      setActiveUser(quickPassUser);
      triggerCinematicLaunch(quickPassUser);
    } catch (err: any) {
      setError('Quick pass session expired. Please sign in manually.');
      setIsSubmitting(false);
    }
  };

  // Step 1 -> Step 2 transition with async server verification
  const handleProceedToStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cleanHandle) {
      setError('Please choose a handle for your Nixima ID.');
      return;
    }
    if (cleanHandle.length < 3) {
      setError('Nixima handle must be at least 3 characters.');
      return;
    }

    // High-tech verification pulse
    setIsVerifyingStep1(true);
    playOpticToggle(true);

    try {
      const check = await checkHandleAvailabilityAsync(cleanHandle);
      if (!check.available) {
        setIsVerifyingStep1(false);
        setError(check.reason || 'This Nixima handle is already taken on another terminal.');
        return;
      }
    } catch (err) {
      if (!availability.available) {
        setIsVerifyingStep1(false);
        setError(availability.reason || 'This Nixima handle is already taken.');
        return;
      }
    }

    setTimeout(() => {
      setIsVerifyingStep1(false);
      setRegisterStep(2);
    }, 380);
  };

  // Step 2 final registration submission (Async with Server Broadcast)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      playTypingTick();
      const user = await registerUserAsync(regName, cleanHandle, regPassphrase);
      if (quickPassEnabled) {
        saveQuickPassUser(user);
      }
      triggerCinematicLaunch(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  // Standard Sign In submission (Async with Server Sync fallback)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      playTypingTick();
      const user = await loginUserAsync(loginHandle, loginPassphrase);
      if (quickPassEnabled) {
        saveQuickPassUser(user);
      }
      triggerCinematicLaunch(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] text-white p-4 font-sans select-none overflow-hidden">
      {/* Dynamic Interactive Canvas Wallpaper */}
      <DynamicWallpaper />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card with silky smooth fade-out on enter */}
      <div className={`relative z-10 w-full max-w-md my-auto rounded-3xl bg-[#101014]/85 border border-zinc-800/80 shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 backdrop-blur-2xl transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 animate-fade-in'
      }`}>

        {/* ============================================================== */}
        {/* VIEW A: CINEMATIC LAUNCH SEQUENCE                              */}
        {/* ============================================================== */}
        {launchingUser ? (
          <div className="py-8 px-2 text-center space-y-6 animate-fade-in font-mono">
            {/* Luminous Pulsing Emblem with expanding rings */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute -inset-2 rounded-3xl bg-white/10 animate-pulse blur-lg" />
              <div className="relative p-5 rounded-3xl bg-zinc-950 border border-zinc-700/80 shadow-[0_0_40px_rgba(255,255,255,0.22)]">
                <NiximaIdLogo size={56} animated glow />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Identity Authorized</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Welcome, {launchingUser.name}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                {launchingUser.email}
              </p>
            </div>

            {/* Launch Progress & Telemetry */}
            <div className="space-y-2 max-w-xs mx-auto text-left pt-2">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {launchProgress < 40
                      ? 'Decrypting Sovereign Vault...'
                      : launchProgress < 85
                      ? 'Binding Neural Mesh Nodes...'
                      : 'Workspace Initialized'}
                  </span>
                </span>
                <span className="font-bold text-white">{launchProgress}%</span>
              </div>

              {/* Glowing Laser Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-zinc-300 via-white to-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out"
                  style={{ width: `${launchProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW B: PORTAL INTERFACES                                      */
          /* ============================================================== */
          <>
            {/* Nixima Brand Emblem */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-[0_0_35px_rgba(255,255,255,0.14)] mb-3">
                <NiximaIdLogo size={42} animated glow />
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <NiximaIdLogo size={18} glow={false} />
                <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
                  NIXIMA <span className="text-zinc-500 font-normal">ID ACCESS</span>
                </h1>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Frontier Intelligence Mesh • Sovereign Identity Vault
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-start gap-2 animate-fade-in font-mono">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OPTIONABLE 1-CLICK FAST SIGN IN (QUICK PASS) */}
            {quickPassUser && !showManualAuth ? (
              <div className="space-y-4 animate-fade-in font-mono">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-700/80 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-white fill-white" />
                      <span>Ready-Set Fast Sign-In</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[9px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>1-Click Ready</span>
                    </span>
                  </div>

                  {/* Saved User Profile Row */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center shadow-glow-subtle flex-shrink-0">
                      <NiximaIdLogo size={22} glow />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate flex items-center gap-2">
                        <span>{quickPassUser.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-normal">
                          {quickPassUser.role || 'Operator'}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono truncate">
                        {quickPassUser.email}
                      </div>
                    </div>
                  </div>

                  {/* Big 1-Click Fast Sign In Button */}
                  <button
                    type="button"
                    onClick={handleQuickPassSignIn}
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    <span>Fast Sign In as {quickPassUser.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Quick Pass Option Toggle */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={quickPassEnabled}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setQuickPassEnabledState(val);
                          setQuickPassEnabled(val);
                          if (!val) {
                            clearQuickPass();
                            setQuickPassUser(null);
                          }
                        }}
                        className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                      />
                      <span>Enable 1-Click Fast Sign-In</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowManualAuth(true)}
                      className="text-zinc-400 hover:text-white underline transition-colors"
                    >
                      Switch Account
                    </button>
                  </div>
                </div>

                {/* Secondary Option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualAuth(true);
                      setMode('register');
                      setRegisterStep(1);
                    }}
                    className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <NiximaIdLogo size={14} glow={false} />
                    <span>Create a new / different Nixima ID →</span>
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD AUTHENTICATION & STEP-BY-STEP REGISTRATION */
              <div className="space-y-5 animate-fade-in">
                {/* Back to 1-Click Fast Sign In (if saved profile exists) */}
                {quickPassUser && showManualAuth && (
                  <button
                    type="button"
                    onClick={() => setShowManualAuth(false)}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 mb-2 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Return to 1-Click Sign-In ({quickPassUser.name.split(' ')[0]})</span>
                  </button>
                )}

                {/* Mode Switcher Tabs */}
                <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'register'
                        ? 'bg-white text-black font-bold shadow-glow-subtle'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <NiximaIdLogo size={14} glow={false} />
                    <span>Create Nixima ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(null); }}
                    className={`py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'signin'
                        ? 'bg-white text-black font-bold shadow-glow-subtle'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>

                {/* 2-Step Sequential Wizard Indicator (Visible only in register mode) */}
                {mode === 'register' && (
                  <div className="p-2 rounded-xl bg-zinc-950/70 border border-zinc-800/80 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      {/* Step 1 Pill */}
                      <button
                        type="button"
                        onClick={() => {
                          if (registerStep === 2) {
                            setRegisterStep(1);
                            setError(null);
                          }
                        }}
                        className={`flex items-center gap-2 transition-colors ${
                          registerStep === 1
                            ? 'text-white font-bold'
                            : 'text-emerald-400 font-medium hover:underline'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          registerStep === 1
                            ? 'bg-white text-black shadow-glow-subtle'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {registerStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                        </span>
                        <span>01. Create ID</span>
                      </button>

                      {/* Connecting Line */}
                      <div className="flex-1 mx-3 h-[1px] bg-zinc-800 relative">
                        <div className={`h-full transition-all duration-300 ${
                          registerStep === 2 ? 'bg-emerald-500 w-full' : 'bg-zinc-700 w-1/2'
                        }`} />
                      </div>

                      {/* Step 2 Pill */}
                      <div className={`flex items-center gap-2 transition-colors ${
                        registerStep === 2 ? 'text-white font-bold' : 'text-zinc-500'
                      }`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          registerStep === 2
                            ? 'bg-white text-black shadow-glow-subtle'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}>
                          2
                        </span>
                        <span>02. Register Account</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: CREATE NIXIMA ID */}
                {mode === 'register' && registerStep === 1 && (
                  <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1.5">
                          <NiximaIdLogo size={13} glow={false} />
                          <span>Choose Your Nixima Handle</span>
                        </label>
                        {cleanHandle.length >= 3 && (
                          <span className={`text-[10px] font-mono flex items-center gap-1 ${
                            isCheckingHandle ? 'text-zinc-400' : availability.available ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {isCheckingHandle ? (
                              <>
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                <span>Checking mesh...</span>
                              </>
                            ) : availability.available ? (
                              <span>✓ Available</span>
                            ) : (
                              <span>✕ Taken</span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={regHandle}
                          onChange={(e) => {
                            setRegHandle(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="e.g. alex or bogdan"
                          autoFocus
                          required
                          className="w-full pl-3.5 pr-24 py-2.5 bg-[#09090d]/90 border border-zinc-800/90 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:bg-[#0d0d12] transition-all duration-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] font-mono text-xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[11px] pointer-events-none">
                          @nixima.ai
                        </span>
                      </div>
                    </div>

                    {/* Holographic ID Card Preview */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-700/80 p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <NiximaIdLogo size={20} animated glow />
                          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 font-bold">
                            Nixima ID Protocol
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          cleanHandle.length >= 3 && availability.available
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                            : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/80'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cleanHandle.length >= 3 && availability.available ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                          }`} />
                          <span>{cleanHandle.length >= 3 && availability.available ? 'Ready to Claim' : 'Pending Handle'}</span>
                        </span>
                      </div>

                      <div className="py-2 border-y border-zinc-800/80">
                        <div className="text-[10px] text-zinc-500 font-mono uppercase">Assigned Digital Identity</div>
                        <div className="text-sm sm:text-base font-bold text-white font-mono tracking-tight flex items-center gap-1 mt-0.5">
                          <span className={cleanHandle ? 'text-white' : 'text-zinc-600'}>
                            {cleanHandle || 'handle'}
                          </span>
                          <span className="text-zinc-500 font-normal">@nixima.ai</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>SPEC: SOVEREIGN-v0.1</span>
                        <span>VAULT: LOCAL MESH</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cleanHandle.length < 3 || !availability.available || isVerifyingStep1}
                      className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group"
                    >
                      {isVerifyingStep1 ? (
                        <>
                          <NiximaIdLogo size={16} animated className="animate-spin" />
                          <span>Locking Sovereign ID...</span>
                        </>
                      ) : (
                        <>
                          <NiximaIdLogo size={16} glow={false} className="group-hover:scale-110 transition-transform" />
                          <span>Claim Nixima ID & Proceed to Step 2</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: REGISTER NIXIMA ACCOUNT */}
                {mode === 'register' && registerStep === 2 && (
                  <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono animate-fade-in">
                    {/* Locked Claimed Nixima ID Banner */}
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <NiximaIdLogo size={22} glow />
                        <div>
                          <div className="text-[10px] text-zinc-400 font-mono uppercase flex items-center gap-1">
                            <span>Claimed Nixima ID</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                          <div className="text-xs font-bold text-white font-mono">
                            {cleanHandle}@nixima.ai
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setRegisterStep(1); setError(null); }}
                        className="text-[11px] font-mono text-zinc-400 hover:text-white underline px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                      >
                        Change ID
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                        Full Name / Callsign
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Alex Rivera or Bogdan"
                        autoFocus
                        required
                        className="w-full px-3.5 py-2.5 bg-[#09090d]/90 border border-zinc-800/90 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:bg-[#0d0d12] transition-all duration-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                        Create Security Passphrase
                      </label>
                      <div className="relative">
                        <input
                          type={showPassphrase ? "text" : "password"}
                          value={regPassphrase}
                          onChange={(e) => setRegPassphrase(e.target.value)}
                          placeholder="At least 4 characters..."
                          required
                          className="w-full pl-3.5 pr-10 py-2.5 bg-[#09090d]/90 border border-zinc-800/90 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:bg-[#0d0d12] transition-all duration-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = !showPassphrase;
                            setShowPassphrase(next);
                            playOpticToggle(next);
                          }}
                          aria-label={showPassphrase ? "Hide security passphrase" : "Show security passphrase"}
                          title={showPassphrase ? "Hide passphrase" : "Show passphrase"}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-90 transition-all duration-150 focus:outline-none"
                        >
                          <AnimatedEye isShowing={showPassphrase} size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Optionable Quick Pass Toggle on Registration */}
                    <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none pt-0.5">
                      <input
                        type="checkbox"
                        checked={quickPassEnabled}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setQuickPassEnabledState(val);
                          setQuickPassEnabled(val);
                        }}
                        className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                      />
                      <span>Enable 1-Click Fast Sign-In on this terminal</span>
                    </label>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setRegisterStep(1); setError(null); }}
                        className="py-3 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs border border-zinc-800 transition-colors flex items-center justify-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <NiximaIdLogo size={16} glow={false} className="group-hover:scale-110 transition-transform" />
                        <span>Complete Registration & Enter</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </form>
                )}

                {/* SIGN IN VIEW */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4 text-xs font-mono animate-fade-in">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                        Nixima Handle or Email
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={loginHandle}
                          onChange={(e) => setLoginHandle(e.target.value)}
                          placeholder="e.g. bogdan or alex"
                          autoFocus
                          required
                          className="w-full pl-3.5 pr-24 py-2.5 bg-[#09090d]/90 border border-zinc-800/90 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:bg-[#0d0d12] transition-all duration-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] font-mono text-xs"
                        />
                        {!loginHandle.includes('@') && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[11px] pointer-events-none">
                            @nixima.ai
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                        Security Passphrase
                      </label>
                      <div className="relative">
                        <input
                          type={showPassphrase ? "text" : "password"}
                          value={loginPassphrase}
                          onChange={(e) => setLoginPassphrase(e.target.value)}
                          placeholder="Enter passphrase..."
                          required
                          className="w-full pl-3.5 pr-10 py-2.5 bg-[#09090d]/90 border border-zinc-800/90 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-white/20 focus:bg-[#0d0d12] transition-all duration-200 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = !showPassphrase;
                            setShowPassphrase(next);
                            playOpticToggle(next);
                          }}
                          aria-label={showPassphrase ? "Hide security passphrase" : "Show security passphrase"}
                          title={showPassphrase ? "Hide passphrase" : "Show passphrase"}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-90 transition-all duration-150 focus:outline-none"
                        >
                          <AnimatedEye isShowing={showPassphrase} size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Optionable Quick Pass Toggle on Sign In */}
                    <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none pt-0.5">
                      <input
                        type="checkbox"
                        checked={quickPassEnabled}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setQuickPassEnabledState(val);
                          setQuickPassEnabled(val);
                        }}
                        className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                      />
                      <span>Remember for 1-Click Fast Sign-In</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <NiximaIdLogo size={16} glow={false} className="group-hover:scale-110 transition-transform" />
                      <span>Authenticate Nixima ID</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Cross-Device Crossover Bar */}
            <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
              <button
                type="button"
                onClick={() => {
                  setCrossoverMsg(null);
                  setShowCrossoverModal(true);
                }}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
              >
                <Smartphone className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="underline underline-offset-2 decoration-zinc-700 hover:decoration-white">
                  Cross-Device Crossover (Laptop ↔ Phone)
                </span>
              </button>

              <button
                type="button"
                onClick={handleForceSync}
                disabled={isSyncing}
                title="Force refresh account registry from mesh server"
                className="inline-flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Mesh'}</span>
              </button>
            </div>

            {/* Footer info */}
            <div className="mt-3 text-center text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Nixima Sovereign Mesh</span>
              </span>
              <span>•</span>
              <span>nixima.ai</span>
            </div>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* CROSS-DEVICE CROSSOVER MODAL                                    */}
      {/* ============================================================== */}
      {showCrossoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111116] border border-zinc-700 p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5 text-xs text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                    <span>Cross-Device Crossover</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[9px]">
                      Live
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Seamlessly link your accounts between Laptop, Phone, and other terminals.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCrossoverModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert */}
            {crossoverMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 animate-fade-in ${
                crossoverMsg.type === 'success' 
                  ? 'bg-emerald-950/50 border border-emerald-800/80 text-emerald-300' 
                  : 'bg-red-950/50 border border-red-800/80 text-red-300'
              }`}>
                {crossoverMsg.type === 'success' ? (
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{crossoverMsg.text}</span>
              </div>
            )}

            {/* Option 1: Automatic Mesh Sync */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Method 1: Cloud Mesh Sync</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400">
                  Automatic
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Your accounts synchronize automatically with the Nixima mesh cloud whenever you register or sign in across devices.
              </p>
              <button
                type="button"
                onClick={handleForceSync}
                disabled={isSyncing}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isSyncing ? 'Synchronizing with Nixima Cloud...' : 'Force Sync With Nixima Cloud'}</span>
              </button>
            </div>

            {/* Option 2: Sovereign Link Key */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Method 2: Sovereign Link Key (Air-Gapped / Universal)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400">
                  Universal
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Export an encrypted sovereign link key from your laptop and paste it into your phone to instantly merge all accounts without needing shared Wi-Fi.
              </p>

              {/* Copy Key Button */}
              <button
                type="button"
                onClick={handleCopySovereignKey}
                className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-subtle"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Key Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Export & Copy Sovereign Link Key</span>
                  </>
                )}
              </button>

              {/* Paste & Import Form */}
              <form onSubmit={handleImportSovereignKey} className="pt-2 space-y-2">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Or Paste Link Key from Other Device:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={crossoverInputKey}
                    onChange={(e) => setCrossoverInputKey(e.target.value)}
                    placeholder="NXK-..."
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono text-[11px] placeholder-zinc-600 focus:outline-none focus:border-zinc-400"
                  />
                  <button
                    type="submit"
                    disabled={!crossoverInputKey.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Link & Sync
                  </button>
                </div>
              </form>
            </div>

            {/* Modal Close Button */}
            <div className="text-right pt-1">
              <button
                type="button"
                onClick={() => setShowCrossoverModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

