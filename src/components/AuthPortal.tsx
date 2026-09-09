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
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { NiximaUser } from '../types/user';
import { loginUser, registerUser, getAllUsers } from '../utils/auth';
import { playTypingTick, playCompletionChime } from '../utils/sound';

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

  const existingUsers = getAllUsers();

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

  const handleQuickLogin = (user: NiximaUser) => {
    setError(null);
    try {
      const logged = loginUser(user.handle, user.passphrase);
      playCompletionChime();
      onAuthenticated(logged);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const previewEmail = regHandle.trim() 
    ? `${regHandle.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')}@nixima.ai`
    : 'handle@nixima.ai';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] text-white p-4 font-sans select-none overflow-y-auto">
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md my-auto rounded-3xl bg-[#101014]/90 border border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl animate-fade-in">
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
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassphrase ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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

        {/* Quick Demo Switcher (Effortless Testing) */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-2.5 text-center font-bold">
            Quick Sign In / Switch Account
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {existingUsers.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-left transition-colors flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center font-bold text-xs font-mono group-hover:bg-white group-hover:text-black transition-colors">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-white truncate">{u.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate font-mono">{u.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

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
