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
          container: 'bg-white/[0.08] hover:bg-white/[0.14] border-white/30 hover:border-white/60 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]',
          dot: 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]',
          icon: <Crown className="w-3 h-3 text-white flex-shrink-0" />
        };
      case 'vip':
        return {
          container: 'bg-zinc-800/80 hover:bg-zinc-750 border-zinc-600/70 hover:border-zinc-400 text-zinc-100 shadow-[0_0_10px_rgba(255,255,255,0.06)] hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]',
          dot: 'bg-zinc-200 shadow-[0_0_6px_rgba(255,255,255,0.8)]',
          icon: <Sparkles className="w-3 h-3 text-zinc-200 flex-shrink-0" />
        };
      case 'family':
        return {
          container: 'bg-zinc-850/80 hover:bg-zinc-800 border-zinc-700/80 hover:border-zinc-500 text-zinc-200 shadow-sm',
          dot: 'bg-zinc-300 shadow-[0_0_4px_rgba(255,255,255,0.6)]',
          icon: <Shield className="w-3 h-3 text-zinc-300 flex-shrink-0" />
        };
      case 'system':
        return {
          container: 'bg-zinc-850/90 hover:bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-zinc-200 shadow-sm',
          dot: 'bg-zinc-300 shadow-[0_0_4px_rgba(255,255,255,0.6)]',
          icon: <Cpu className="w-3 h-3 text-zinc-300 flex-shrink-0" />
        };
      case 'operator':
      default:
        return {
          container: 'bg-zinc-900/90 hover:bg-zinc-800/90 border-zinc-700/70 hover:border-zinc-500 text-zinc-200 hover:text-white shadow-[0_0_10px_rgba(255,255,255,0.04)]',
          dot: 'bg-zinc-400 shadow-[0_0_4px_rgba(255,255,255,0.5)]',
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
