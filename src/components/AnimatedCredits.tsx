import React, { useState, useEffect, useRef } from 'react';
import { Coins, Zap, Sparkles } from 'lucide-react';
import { playCreditSpendSound, playCreditGrantSound } from '../utils/sound';

interface UseAnimatedNumberOptions {
  duration?: number;
  playSound?: boolean;
}

/**
 * Custom hook to smoothly interpolate between credit values using an ease-out curve
 */
export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
) {
  const { duration = 850, playSound = true } = options;
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const [delta, setDelta] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'spend' | 'grant' | null>(null);

  const prevValueRef = useRef<number>(targetValue);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(targetValue);

  useEffect(() => {
    if (!isFinite(targetValue) || targetValue >= 999999999) {
      setDisplayValue(Infinity);
      setDelta(null);
      prevValueRef.current = Infinity;
      return;
    }

    const prev = prevValueRef.current;
    if (prev !== targetValue) {
      const diff = targetValue - prev;
      setDelta(diff);

      if (diff < 0) {
        setAnimationType('spend');
        if (playSound) {
          playCreditSpendSound();
        }
      } else if (diff > 0) {
        setAnimationType('grant');
        if (playSound) {
          playCreditGrantSound();
        }
      }

      startValueRef.current = displayValue;
      startTimeRef.current = performance.now();

      // Clear previous animation frame if still running
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const animate = (now: number) => {
        if (!startTimeRef.current) return;
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out quintic: fast initial roll, ultra smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 5);
        const currentInterp = Math.round(startValueRef.current + (targetValue - startValueRef.current) * eased);
        setDisplayValue(currentInterp);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
          // Keep the delta badge visible for the full float animation duration (1.35s)
          setTimeout(() => {
            setDelta(null);
            setAnimationType(null);
          }, 1350);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
      prevValueRef.current = targetValue;
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetValue, duration, playSound]);

  return {
    displayValue,
    delta,
    animationType,
  };
}

interface CreditBalanceChipProps {
  credits: number;
  unit?: string;
  onClick?: () => void;
  title?: string;
  className?: string;
}

/**
 * Top Header Balance Chip with floating deduction/grant particles and pulse effects
 */
export const CreditBalanceChip: React.FC<CreditBalanceChipProps> = ({
  credits,
  unit = 'CR',
  onClick,
  title,
  className = '',
}) => {
  const isInfinite = !isFinite(credits) || credits >= 999999999;
  const { displayValue, delta, animationType } = useAnimatedNumber(credits);

  if (isInfinite) {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={onClick}
          type="button"
          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono group shadow-[0_0_16px_rgba(245,158,11,0.3)] border border-amber-400/50 bg-gradient-to-r from-amber-500/25 via-zinc-900 to-amber-500/25 text-amber-200 flex-shrink-0 select-none overflow-hidden hover:border-amber-300 transition-all cursor-pointer ${className}`}
          title="Creator Sovereign Account (orange17@nixima.ai) • Infinite Credits Granted"
        >
          <span className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent pointer-events-none animate-sweep-shine" />
          <Coins className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-base font-black leading-none text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-sans">
            ∞
          </span>
          <span className="text-[10px] text-amber-400 font-bold uppercase">
            {unit}
          </span>
          <span className="ml-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
            CREATOR
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      {/* Floating Delta Badge */}
      {delta !== null && delta !== 0 && (
        <span
          key={`delta-${credits}-${delta}`}
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none z-30 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-xl backdrop-blur-md animate-credit-float border ${
            delta < 0
              ? 'bg-red-950/95 text-red-300 border-red-500/50 shadow-red-950/80'
              : 'bg-emerald-950/95 text-emerald-300 border-emerald-500/50 shadow-emerald-950/80'
          }`}
        >
          {delta < 0 ? (
            <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400 animate-pulse" />
          ) : (
            <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-spin" />
          )}
          <span>{delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()} {unit}</span>
        </span>
      )}

      {/* Main Interactive Button */}
      <button
        onClick={onClick}
        type="button"
        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-300 text-xs font-mono group shadow-inner-light flex-shrink-0 select-none overflow-hidden ${
          animationType === 'spend'
            ? 'animate-credit-deduct border-red-500/60 bg-red-500/15 text-amber-200'
            : animationType === 'grant'
            ? 'animate-credit-grant border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-500/50'
        } ${className}`}
        title={title}
      >
        <Coins
          className={`w-3.5 h-3.5 text-amber-400 transition-transform ${
            animationType ? 'animate-coin-spin text-amber-300' : 'group-hover:scale-110'
          }`}
        />
        <span className="font-bold tracking-tight tabular-nums font-mono">
          {displayValue.toLocaleString()}
        </span>
        <span className="text-[10px] text-amber-400/70 font-semibold uppercase">
          {unit}
        </span>
      </button>
    </div>
  );
};

interface CreditHeroCounterProps {
  credits: number;
  unit?: string;
  className?: string;
}

/**
 * Large Luminous Hero Counter used in Settings Modal
 */
export const CreditHeroCounter: React.FC<CreditHeroCounterProps> = ({
  credits,
  unit = 'CR',
  className = '',
}) => {
  const isInfinite = !isFinite(credits) || credits >= 999999999;
  const { displayValue, delta, animationType } = useAnimatedNumber(credits, { duration: 950 });

  if (isInfinite) {
    return (
      <div className={`relative flex flex-col gap-1.5 pt-1 ${className}`}>
        <div className="flex items-baseline gap-2.5">
          <span className="text-5xl font-black font-sans tracking-tight text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] leading-none">
            ∞
          </span>
          <span className="text-base font-bold font-mono text-amber-400">
            {unit}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            SOVEREIGN CREATOR ACCESS
          </span>
        </div>
        <p className="text-[11px] font-mono text-amber-400/80">
          👑 orange17@nixima.ai • Infinite credits & unlimited reasoning capacity active forever
        </p>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-baseline gap-2 pt-1 ${className}`}>
      {/* Floating Delta Badge */}
      {delta !== null && delta !== 0 && (
        <span
          key={`hero-delta-${credits}-${delta}`}
          className={`absolute -top-4 left-0 pointer-events-none z-30 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-credit-float border ${
            delta < 0
              ? 'bg-red-950/95 text-red-300 border-red-500/50 shadow-red-950/80'
              : 'bg-emerald-950/95 text-emerald-300 border-emerald-500/50 shadow-emerald-950/80'
          }`}
        >
          {delta < 0 ? (
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
          ) : (
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
          )}
          <span>{delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()} {unit}</span>
        </span>
      )}

      <span
        className={`text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums transition-all duration-300 ${
          animationType === 'spend'
            ? 'drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] text-amber-100 scale-[1.02]'
            : animationType === 'grant'
            ? 'drop-shadow-[0_0_25px_rgba(16,185,129,0.7)] text-emerald-100 scale-[1.03]'
            : 'drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]'
        }`}
      >
        {displayValue.toLocaleString()}
      </span>
      <span className="text-sm font-bold font-mono text-amber-400">
        {unit}
      </span>
    </div>
  );
};

interface CreditSidebarBadgeProps {
  credits: number;
  unit?: string;
  className?: string;
}

/**
 * Compact Operator Card pill for Sidebar
 */
export const CreditSidebarBadge: React.FC<CreditSidebarBadgeProps> = ({
  credits,
  unit = 'CR',
  className = '',
}) => {
  const isInfinite = !isFinite(credits) || credits >= 999999999;
  const { displayValue, animationType } = useAnimatedNumber(credits, { duration: 650, playSound: false });

  if (isInfinite) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] flex-shrink-0 ${className}`}
        title="Creator Account (orange17@nixima.ai) • Unlimited Inferences"
      >
        <Coins className="w-2.5 h-2.5 text-amber-400" />
        <span className="text-xs leading-none font-black font-sans">∞</span>
        <span>{unit}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border flex-shrink-0 transition-all duration-300 tabular-nums ${
        animationType === 'spend'
          ? 'bg-red-500/20 text-red-200 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
          : animationType === 'grant'
          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
      } ${className}`}
    >
      <Coins className="w-2.5 h-2.5 text-amber-400" />
      <span>{displayValue.toLocaleString()} {unit}</span>
    </span>
  );
};

interface CreditTelemetryPillProps {
  creditsSpent: number;
  unit?: string;
  className?: string;
}

/**
 * Animated telemetry deduction badge in ChatMessage footer with sweep shine and pop-in
 */
export const CreditTelemetryPill: React.FC<CreditTelemetryPillProps> = ({
  creditsSpent,
  unit = 'CR',
  className = '',
}) => {
  const isZeroOrCreator = creditsSpent === 0;

  return (
    <span
      className={`relative inline-flex items-center gap-1 text-[11px] font-mono ${
        isZeroOrCreator
          ? 'text-amber-300 bg-amber-500/20 border-amber-400/40'
          : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
      } border px-2 py-0.5 rounded shadow-sm overflow-hidden animate-telemetry-pill group ${className}`}
      title={isZeroOrCreator ? 'Creator Sovereign Account (orange17@nixima.ai) • Free Unlimited Inference' : `Deducted ${creditsSpent} ${unit} for computational inference`}
    >
      {/* Light shimmer bar that sweeps across */}
      <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-sweep-shine" />

      <Coins className="w-3 h-3 text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
      <span className="font-bold tracking-tight">
        {isZeroOrCreator ? '0' : `-${creditsSpent}`}
      </span>
      <span className="text-[9px] text-amber-400/80 font-semibold">{unit}</span>
      {isZeroOrCreator && (
        <span className="text-[8px] font-mono text-amber-300 font-bold px-1 py-0.2 rounded bg-amber-400/20 ml-0.5">
          ∞
        </span>
      )}
    </span>
  );
};
