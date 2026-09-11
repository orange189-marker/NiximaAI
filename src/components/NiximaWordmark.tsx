import React from 'react';

export type WordmarkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
export type WordmarkVariant = 'sheen' | 'titanium' | 'white' | 'orange' | 'gradient';
export type WordmarkCasing = 'title' | 'upper';
export type AiBadgeStyle = 'subtle' | 'pill' | 'glow' | 'minimal';

export interface NiximaWordmarkProps {
  size?: WordmarkSize;
  variant?: WordmarkVariant;
  casing?: WordmarkCasing;
  withAi?: boolean;
  aiStyle?: AiBadgeStyle;
  subtext?: string;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeConfig: Record<
  WordmarkSize,
  {
    fontSize: string;
    letterSpacing: string;
    aiTextSize: string;
    aiPillClass: string;
    subtextSize: string;
  }
> = {
  xs: {
    fontSize: 'text-xs',
    letterSpacing: 'tracking-tight',
    aiTextSize: 'text-[9px]',
    aiPillClass: 'text-[8px] px-1 py-0.2 rounded',
    subtextSize: 'text-[8px]',
  },
  sm: {
    fontSize: 'text-sm sm:text-base',
    letterSpacing: 'tracking-tight',
    aiTextSize: 'text-[10px]',
    aiPillClass: 'text-[9px] px-1.5 py-0.5 rounded',
    subtextSize: 'text-[9px]',
  },
  md: {
    fontSize: 'text-base sm:text-lg',
    letterSpacing: 'tracking-tight',
    aiTextSize: 'text-xs',
    aiPillClass: 'text-[10px] px-1.5 py-0.5 rounded font-mono',
    subtextSize: 'text-[10px]',
  },
  lg: {
    fontSize: 'text-lg sm:text-xl',
    letterSpacing: 'tracking-tight',
    aiTextSize: 'text-xs sm:text-sm',
    aiPillClass: 'text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-mono',
    subtextSize: 'text-xs',
  },
  xl: {
    fontSize: 'text-2xl sm:text-3xl',
    letterSpacing: 'tracking-tight',
    aiTextSize: 'text-sm sm:text-base',
    aiPillClass: 'text-xs px-2.5 py-0.5 rounded-md font-mono',
    subtextSize: 'text-xs sm:text-sm',
  },
  hero: {
    fontSize: 'text-4xl sm:text-5xl md:text-6xl',
    letterSpacing: '-tracking-wider',
    aiTextSize: 'text-xl sm:text-2xl',
    aiPillClass: 'text-xs sm:text-sm px-3 py-1 rounded-lg font-mono',
    subtextSize: 'text-sm sm:text-base',
  },
};

const variantClasses: Record<WordmarkVariant, string> = {
  sheen: 'nixima-wordmark-sheen font-extrabold',
  titanium: 'text-zinc-100 font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
  white: 'text-white font-extrabold',
  gradient: 'nixima-wordmark-gradient font-extrabold',
  orange: 'nixima-wordmark-orange font-extrabold',
};

/**
 * NiximaWordmark
 * Bespoke geometric brand wordmark inspired by Google's Product Sans
 * and Gemini's titanium liquid metallic luster.
 */
export const NiximaWordmark: React.FC<NiximaWordmarkProps> = ({
  size = 'md',
  variant = 'sheen',
  casing = 'title',
  withAi = false,
  aiStyle = 'subtle',
  subtext,
  glow = false,
  className = '',
  onClick,
}) => {
  const cfg = sizeConfig[size];
  const text = casing === 'upper' ? 'NIXIMA' : 'Nixima';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none font-nixima leading-none transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <span
        className={`relative inline-block font-nixima ${cfg.fontSize} ${cfg.letterSpacing} ${
          variantClasses[variant]
        } ${glow ? 'nixima-wordmark-glow' : 'nixima-wordmark-subtle-glow'}`}
      >
        {text}
      </span>

      {withAi && (
        <span className="inline-flex items-center ml-1.5 flex-shrink-0">
          {aiStyle === 'pill' && (
            <span
              className={`font-mono font-semibold uppercase tracking-wider bg-zinc-800/90 text-zinc-300 border border-zinc-700/80 shadow-inner-light ${cfg.aiPillClass}`}
            >
              AI
            </span>
          )}

          {aiStyle === 'subtle' && (
            <span
              className={`font-mono font-medium text-zinc-400 tracking-normal ${cfg.aiTextSize}`}
            >
              AI
            </span>
          )}

          {aiStyle === 'glow' && (
            <span
              className={`font-mono font-bold text-white tracking-wide shadow-[0_0_8px_rgba(255,255,255,0.4)] ${cfg.aiTextSize}`}
            >
              AI
            </span>
          )}

          {aiStyle === 'minimal' && (
            <span className={`font-nixima font-light text-zinc-500 ${cfg.aiTextSize}`}>
              ai
            </span>
          )}
        </span>
      )}

      {subtext && (
        <span
          className={`ml-2 font-mono font-medium tracking-wider uppercase text-zinc-400 ${cfg.subtextSize}`}
        >
          {subtext}
        </span>
      )}
    </div>
  );
};
