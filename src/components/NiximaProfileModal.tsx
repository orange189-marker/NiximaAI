import React, { useState, useEffect, useMemo } from 'react';
import { resolveNiximaProfile, NiximaProfileData } from '../utils/niximaProfile';
import { useLanguage } from '../context/LanguageContext';
import { NiximaIdLogo } from './NiximaIdLogo';
import {
  X,
  Copy,
  Check,
  Crown,
  Sparkles,
  Shield,
  ShieldCheck,
  Cpu,
  Zap,
  MessageSquare,
  Activity,
  Wifi,
  Lock,
  ExternalLink
} from 'lucide-react';

interface NiximaProfileModalProps {
  handle: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAskAboutUser?: (prompt: string) => void;
}

export const NiximaProfileModal: React.FC<NiximaProfileModalProps> = ({
  handle,
  isOpen,
  onClose,
  onAskAboutUser
}) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const profile: NiximaProfileData | null = useMemo(() => {
    if (!handle) return null;
    return resolveNiximaProfile(handle);
  }, [handle]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !profile) return null;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.niximaId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleAskAi = () => {
    if (onAskAboutUser) {
      const template = t.niximaProfile.askAiPromptTemplate || 'Tell me more about the sovereign operator @{handle} and their role in the Nixima ecosystem.';
      const prompt = template.replace('{handle}', profile.handle);
      onAskAboutUser(prompt);
      onClose();
    }
  };

  // Visual Theme per Tier
  const tierTheme = (() => {
    switch (profile.tier) {
      case 'creator':
        return {
          border: 'border-white/40',
          shadow: 'shadow-[0_0_50px_rgba(255,255,255,0.12)]',
          badgeBg: 'bg-white/10 text-white border-white/30',
          glowRing: 'ring-2 ring-white/60 shadow-[0_0_25px_rgba(255,255,255,0.3)]',
          primaryBtn: 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]',
          avatarIcon: <Crown className="w-4 h-4 text-white" />,
          accentText: 'text-white',
        };
      case 'vip':
        return {
          border: 'border-zinc-600',
          shadow: 'shadow-[0_0_50px_rgba(255,255,255,0.08)]',
          badgeBg: 'bg-zinc-800 text-zinc-100 border-zinc-600',
          glowRing: 'ring-2 ring-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]',
          primaryBtn: 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]',
          avatarIcon: <Sparkles className="w-4 h-4 text-zinc-200" />,
          accentText: 'text-zinc-100',
        };
      case 'family':
        return {
          border: 'border-zinc-700',
          shadow: 'shadow-[0_0_40px_rgba(0,0,0,0.8)]',
          badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
          glowRing: 'ring-2 ring-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
          primaryBtn: 'bg-white hover:bg-zinc-200 text-black shadow-sm',
          avatarIcon: <Shield className="w-4 h-4 text-zinc-300" />,
          accentText: 'text-zinc-200',
        };
      case 'system':
        return {
          border: 'border-zinc-700',
          shadow: 'shadow-[0_0_40px_rgba(0,0,0,0.8)]',
          badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
          glowRing: 'ring-2 ring-zinc-500 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
          primaryBtn: 'bg-white hover:bg-zinc-200 text-black shadow-sm',
          avatarIcon: <Cpu className="w-4 h-4 text-zinc-300" />,
          accentText: 'text-zinc-200',
        };
      case 'operator':
      default:
        return {
          border: 'border-zinc-750',
          shadow: 'shadow-[0_0_50px_rgba(0,0,0,0.8)]',
          badgeBg: 'bg-zinc-800/80 text-zinc-300 border-zinc-700',
          glowRing: 'ring-2 ring-zinc-600 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
          primaryBtn: 'bg-white hover:bg-zinc-200 text-black shadow-sm',
          avatarIcon: <ShieldCheck className="w-4 h-4 text-zinc-300" />,
          accentText: 'text-zinc-200',
        };
    }
  })();

  const bioText = language === 'uk' ? profile.bioUk : profile.bioEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`max-w-xl w-full rounded-2xl bg-[#0d0d12]/95 border ${tierTheme.border} ${tierTheme.shadow} text-zinc-100 relative overflow-hidden transition-all duration-300 animate-scaleUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Ambient Gradient Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-35 pointer-events-none"
          style={{ background: profile.auraGlow }}
        />

        {/* Top Holographic Security Header */}
        <div className="relative px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <NiximaIdLogo size={20} glow animated />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                {t.niximaProfile.cardBadge}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold tracking-wider uppercase border border-zinc-700 bg-zinc-800 text-zinc-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                {profile.nodeStatus}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label={t.niximaProfile.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Identity Core Presentation */}
        <div className="relative p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Avatar & Clearance Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar with Halo Ring */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${profile.avatarBg} ${tierTheme.glowRing} flex items-center justify-center font-bold text-2xl sm:text-3xl select-none relative overflow-hidden`}
              >
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
                <span>{profile.name.charAt(0).toUpperCase()}</span>
              </div>

              {/* Status Badge Pin */}
              <div
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-zinc-950 border border-zinc-800 shadow-md"
                title={profile.clearanceLevel}
              >
                {tierTheme.avatarIcon}
              </div>
            </div>

            {/* Name, Handle, Role, Clearance */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                  {profile.name}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold tracking-wide uppercase border ${tierTheme.badgeBg}`}>
                  @{profile.handle}
                </span>
              </div>

              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                {profile.role}
              </div>

              {/* Clearance Level Badge */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                  {t.niximaProfile.clearanceLevel}:
                </span>
                <span className={`text-[11px] font-mono font-semibold tracking-tight ${tierTheme.accentText}`}>
                  {profile.clearanceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Nixima ID Box */}
          <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/90 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                {t.niximaProfile.niximaId}
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wider truncate selection:bg-white/20">
                {profile.niximaId}
              </div>
              <div className="text-[10.5px] font-mono text-zinc-500 mt-0.5">
                {profile.registeredEpoch}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyId}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">{t.niximaProfile.copiedId}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{t.niximaProfile.copyId}</span>
                </>
              )}
            </button>
          </div>

          {/* Dossier / Bio Section */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-zinc-500" />
              {t.niximaProfile.bioLabel}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {bioText}
            </p>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* System & Neural Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Compute Quota Tile */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                <Zap className="w-3 h-3 text-zinc-300" />
                {t.niximaProfile.neuralComputeQuota}
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight">
                {profile.credits}
              </div>
            </div>

            {/* Latency Routing Tile */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                <Wifi className="w-3 h-3 text-zinc-300" />
                {t.niximaProfile.latencyRouting}
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-zinc-200 tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white inline-block" />
                {profile.latencyRouting}
              </div>
            </div>

            {/* Authorized Neural Engines */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                <Cpu className="w-3 h-3 text-zinc-300" />
                {t.niximaProfile.neuralPrivileges}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.neuralPrivileges.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Cryptographic Security Protocols */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                <Lock className="w-3 h-3 text-zinc-300" />
                {t.niximaProfile.securityProtocols}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.securityProtocols.map((proto, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950/80 border border-zinc-800/80 text-zinc-400"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Dock */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {/* Ask AI about this operator */}
            {onAskAboutUser && (
              <button
                type="button"
                onClick={handleAskAi}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${tierTheme.primaryBtn}`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span>{t.niximaProfile.askAiAboutUser}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              {t.niximaProfile.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
