import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Key, 
  User, 
  Sparkles, 
  AlertCircle, 
  Check, 
  AtSign,
  Cpu,
  Lock
} from 'lucide-react';
import { NiximaUser } from '../types/user';
import { loginUser, registerUser } from '../utils/auth';
import { playTypingTick, playCompletionChime, playOpticToggle } from '../utils/sound';

import { DynamicWallpaper } from './DynamicWallpaper';
import { AnimatedEye } from './AnimatedEye';

interface AuthPortalProps {
  onAuthenticated: (user: NiximaUser) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  
  // Sign In state
  const [loginHandle, setLoginHandle] = useState('');
  const [loginPassphrase, setLoginPassphrase] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regHandle, setRegHandle] = useState('');
  const [regPassphrase, setRegPassphrase] = useState('');

  const [showPassphrase, setShowPassphrase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      playTypingTick();
      const user = loginUser(loginHandle, loginPassphrase);
      playCompletionChime();
      onAuthenticated(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      playTypingTick();
      const user = registerUser(regName, regHandle, regPassphrase);
      playCompletionChime();
      onAuthenticated(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewEmail = regHandle.trim() 
    ? `${regHandle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')}@nixima.ai`
    : 'handle@nixima.ai';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] text-white p-4 font-sans select-none overflow-hidden">
      {/* Dynamic Interactive Canvas Wallpaper */}
      <DynamicWallpaper />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md my-auto rounded-3xl bg-[#101014]/85 border border-zinc-800/80 shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 backdrop-blur-2xl animate-fade-in">
        {/* Nixima Brand Emblem */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-black text-xl font-mono shadow-[0_0_30px_rgba(255,255,255,0.25)] mb-3">
            N
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            NIXIMA <span className="text-zinc-500 font-normal">AI ACCESS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Frontier Intelligence Mesh • Secure Identity Vault
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 mb-6 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 rounded-lg font-medium transition-all ${
              mode === 'signin'
                ? 'bg-white text-black font-bold shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-lg font-medium transition-all ${
              mode === 'register'
                ? 'bg-white text-black font-bold shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Nixima ID
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-start gap-2 animate-fade-in font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs font-mono">
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
                  required
                  className="w-full pl-3 pr-24 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-xs"
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
                  className="w-full pl-3 pr-10 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-xs"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* TAB: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                Full Name / Callsign
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className="w-full px-3 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                Desired Nixima Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={regHandle}
                  onChange={(e) => setRegHandle(e.target.value)}
                  placeholder="e.g. alex"
                  required
                  className="w-full pl-3 pr-24 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[11px] pointer-events-none">
                  @nixima.ai
                </span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Assigned Address:</span>
                <span className="text-white font-semibold font-mono">{previewEmail}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                Set Security Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassphrase ? "text" : "password"}
                  value={regPassphrase}
                  onChange={(e) => setRegPassphrase(e.target.value)}
                  placeholder="At least 4 characters..."
                  required
                  className="w-full pl-3 pr-10 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono text-xs"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
            >
              <span>Initialize Nixima ID & Enter</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 text-center text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2">
          <span>Nixima Sovereign Auth</span>
          <span>•</span>
          <span>Port 6001</span>
        </div>
      </div>
    </div>
  );
};
