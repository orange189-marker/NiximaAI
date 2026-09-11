import React, { useMemo } from 'react';
import { resolveNiximaProfile } from '../utils/niximaProfile';
import { Crown, Sparkles, Shield, Cpu } from 'lucide-react';

interface NiximaUserMentionProps {
  handle: string;
  onClick: (handle: string) => void;
  className?: string;
}

export const NiximaUserMention: React.FC<NiximaUserMentionProps> = ({
  handle,
  onClick,
  className = ''
}) => {
  const cleanHandle = handle.replace(/^@+/, '').trim();
  const profile = useMemo(() => resolveNiximaProfile(cleanHandle), [cleanHandle]);

  const tierStyles = useMemo(() => {
    switch (profile.tier) {
      case 'creator':
        return {
          container: 'bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-600/15 border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.55)]',
          dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]',
          icon: <Crown className="w-3 h-3 text-amber-300 animate-pulse flex-shrink-0" />
        };
      case 'vip':
        return {
          container: 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/20 to-purple-600/15 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)]',
          dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]',
          icon: <Sparkles className="w-3 h-3 text-cyan-300 flex-shrink-0" />
        };
      case 'family':
        return {
          container: 'bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-cyan-500/15 border-blue-500/40 hover:border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.55)]',
          dot: 'bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)]',
          icon: <Shield className="w-3 h-3 text-blue-300 flex-shrink-0" />
        };
      case 'system':
        return {
          container: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-cyan-600/15 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.55)]',
          dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]',
          icon: <Cpu className="w-3 h-3 text-emerald-300 flex-shrink-0" />
        };
      case 'operator':
      default:
        return {
          container: 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-700/70 hover:border-zinc-500 text-zinc-200 hover:text-white shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]',
          dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]',
          icon: <span className="text-[11px] font-bold text-zinc-400 flex-shrink-0">@</span>
        };
    }
  }, [profile.tier]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(profile.handle);
      }}
      className={`group inline-flex items-center gap-1.5 px-2 py-0.5 mx-0.5 rounded-full border text-xs font-mono font-medium align-baseline cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 select-none ${tierStyles.container} ${className}`}
      title={`Nixima ID: @${profile.handle} • Click to view profile pass`}
    >
      {/* Tier Icon / Symbol */}
      {tierStyles.icon}

      {/* Handle with @ */}
      <span className="tracking-tight font-semibold">
        @{profile.handle}
      </span>

      {/* Live Online / Pulse Indicator */}
      <span className="relative flex h-1.5 w-1.5 ml-0.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${tierStyles.dot}`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${tierStyles.dot}`} />
      </span>
    </button>
  );
};
