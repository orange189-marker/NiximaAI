import React, { useState, useEffect, useRef } from 'react';
import { NiximaCreditLogo } from './NiximaCreditLogo';
import { InfinitySymbol } from './InfinitySymbol';

interface UseAnimatedNumberOptions {
  duration?: number;
}

/**
 * Custom hook to smoothly interpolate between credit numbers using an ease-out curve.
 * No floating bubbles, no flashing colors — pure fluid number rolling.
 */
export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
) {
  const { duration = 750 } = options;
  const [displayValue, setDisplayValue] = useState<number>(() => {
    return isFinite(targetValue) ? targetValue : 0;
  });

  const prevValueRef = useRef<number>(targetValue);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(targetValue);

  useEffect(() => {
    if (!isFinite(targetValue) || targetValue >= 999999999) {
      setDisplayValue(Infinity);
      prevValueRef.current = Infinity;
      return;
    }

    const prev = prevValueRef.current;
    if (prev !== targetValue) {
      startValueRef.current = isFinite(displayValue) ? displayValue : targetValue;
      startTimeRef.current = performance.now();

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const animate = (now: number) => {
        if (!startTimeRef.current) return;
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out quintic: responsive start, graceful deceleration
        const eased = 1 - Math.pow(1 - progress, 5);
        const currentInterp = Math.round(startValueRef.current + (targetValue - startValueRef.current) * eased);
        setDisplayValue(currentInterp);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
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
  }, [targetValue, duration]);

  return {
    displayValue,
    isInfinite: !isFinite(targetValue) || targetValue >= 999999999,
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
 * Sleek Titanium Header Balance Chip
 * Features the custom geometric Nixima Credit logo and smooth rolling numbers without distracting flashes.
 */
export const CreditBalanceChip: React.FC<CreditBalanceChipProps> = ({
  credits,
  unit = 'CR',
  onClick,
  title,
  className = '',
}) => {
  const { displayValue, isInfinite } = useAnimatedNumber(credits);

  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors text-xs font-mono select-none flex-shrink-0 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/70 hover:border-zinc-500 text-zinc-200 hover:text-white cursor-pointer shadow-inner-light ${className}`}
      title={title}
    >
      <NiximaCreditLogo size={14} />
      <span className="font-semibold tracking-tight tabular-nums font-mono text-zinc-100 inline-flex items-center">
        {isInfinite ? <InfinitySymbol size={13} className="text-zinc-100" /> : displayValue.toLocaleString()}
      </span>
      <span className="text-[10px] text-zinc-400 font-semibold uppercase">
        {unit}
      </span>
      {isInfinite && (
        <span className="ml-0.5 text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-white/10 text-white border border-white/20">
          CREATOR
        </span>
      )}
    </button>
  );
};

interface CreditHeroCounterProps {
  credits: number;
  unit?: string;
  className?: string;
}

/**
 * Minimalist Titanium Hero Counter for Settings Modal
 */
export const CreditHeroCounter: React.FC<CreditHeroCounterProps> = ({
  credits,
  unit = 'CR',
  className = '',
}) => {
  const { displayValue, isInfinite } = useAnimatedNumber(credits, { duration: 800 });

  return (
    <div className={`relative flex items-baseline gap-2 pt-1 ${className}`}>
      <NiximaCreditLogo size={24} className="self-center mr-0.5" />
      <span className="text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums inline-flex items-center">
        {isInfinite ? <InfinitySymbol size={32} glow className="text-white my-auto" /> : displayValue.toLocaleString()}
      </span>
      <span className="text-sm font-bold font-mono text-zinc-400">
        {unit}
      </span>
      {isInfinite && (
        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
          SOVEREIGN CREATOR CLEARANCE
        </span>
      )}
    </div>
  );
};

interface CreditSidebarBadgeProps {
  credits: number;
  unit?: string;
  className?: string;
}

/**
 * Compact Titanium Pill for Sidebar Operator Card
 */
export const CreditSidebarBadge: React.FC<CreditSidebarBadgeProps> = ({
  credits,
  unit = 'CR',
  className = '',
}) => {
  const { displayValue, isInfinite } = useAnimatedNumber(credits, { duration: 600 });

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-zinc-700/60 bg-zinc-900/90 text-zinc-300 flex-shrink-0 tabular-nums select-none ${className}`}
    >
      <NiximaCreditLogo size={11} />
      <span className="inline-flex items-center gap-0.5">
        {isInfinite ? <InfinitySymbol size={10} className="text-zinc-200" /> : displayValue.toLocaleString()} {unit}
      </span>
    </span>
  );
};

interface CreditTelemetryPillProps {
  creditsSpent: number;
  unit?: string;
  className?: string;
}

/**
 * Clean Telemetry Badge in ChatMessage footer
 */
export const CreditTelemetryPill: React.FC<CreditTelemetryPillProps> = ({
  creditsSpent,
  unit = 'CR',
  className = '',
}) => {
  const isZero = creditsSpent === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10.5px] font-mono text-zinc-300 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded select-none animate-telemetry-pill ${className}`}
      title={`Compute deduction: ${creditsSpent} ${unit}`}
    >
      <NiximaCreditLogo size={11} />
      <span className="font-semibold tracking-tight text-zinc-200">
        {isZero ? '0' : `-${creditsSpent}`}
      </span>
      <span className="text-[9px] text-zinc-400 font-semibold">{unit}</span>
    </span>
  );
};
