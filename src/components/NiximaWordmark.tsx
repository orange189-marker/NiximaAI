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

const BRAND_TOKEN_REGEX = /(?:\b(Nixima(?:\s+AI|-0\.[12]O?(?:\s+(?:Pro|Coder|Flash|Flagship|Omni|\(Omni\)))?|\s+Omni|\s+ID|\s+Credits)?|NIXIMA(?:\s+AI|-0\.[12]O?|\s+ID)?|0\.2O(?:\s+(?:Omni|\(Omni\)))?)(?:\b|(?<=\)))|(Ніксіма(?:\s+ШІ)?\b))/gi;

export interface RenderBrandOptions {
  keyPrefix?: string;
  sheen?: boolean;
}

/**
 * Scans any text string for "Nixima", "Nixima AI", "Nixima-0.2", "Nixima-0.2O", "0.2O Omni", "Nixima ID", etc.
 * and elevates matching brand occurrences into the custom geometric brand typeface with metallic luster.
 */
export function renderWithNiximaBrand(
  text: string,
  options?: RenderBrandOptions
): React.ReactNode {
  if (!text || typeof text !== 'string') return text;
  if (!/Nixima|Ніксіма|0\.2O/i.test(text)) return text;

  const keyPrefix = options?.keyPrefix || 'nb';
  const parts = text.split(BRAND_TOKEN_REGEX);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (/^Nixima\s+AI$/i.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.8em] font-semibold text-zinc-300 ml-1 px-1 py-0.2 rounded bg-zinc-800/80 border border-zinc-700/60 align-baseline">AI</span>
        </span>
      );
    }

    if (/^Ніксіма\s+ШІ$/i.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Ніксіма</span>
          <span className="font-mono text-[0.8em] font-semibold text-zinc-300 ml-1 px-1 py-0.2 rounded bg-zinc-800/80 border border-zinc-700/60 align-baseline">ШІ</span>
        </span>
      );
    }

    // Nixima-0.2O or Nixima-0.2O Omni
    if (/^Nixima-0\.[12]O(?:\s+(?:Omni|\(Omni\)))?$/i.test(part)) {
      const hasOmniWord = /Omni/i.test(part);
      const isParenOmni = /\(Omni\)/i.test(part);
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.85em] font-medium text-zinc-300 ml-0.5">
            -0.2<span className="font-sans font-bold text-cyan-400 ml-[0.5px]" title="Omni">O</span>
          </span>
          {hasOmniWord && (
            <span className="font-mono text-[0.8em] font-semibold text-cyan-400 ml-1">
              {isParenOmni ? '(Omni)' : 'Omni'}
            </span>
          )}
        </span>
      );
    }

    // Nixima Omni (standalone without 0.2)
    if (/^Nixima\s+Omni$/i.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.85em] font-semibold text-cyan-400 ml-1">Omni</span>
        </span>
      );
    }

    // Standalone 0.2O or 0.2O Omni
    if (/^0\.2O(?:\s+(?:Omni|\(Omni\)))?$/i.test(part)) {
      const hasOmniWord = /Omni/i.test(part);
      const isParenOmni = /\(Omni\)/i.test(part);
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline select-none">
          <span className="font-mono text-[0.88em] font-medium text-zinc-300">
            0.2<span className="font-sans font-bold text-cyan-400 ml-[0.5px]" title="Omni">O</span>
          </span>
          {hasOmniWord && (
            <span className="font-mono text-[0.85em] font-semibold text-cyan-400 ml-1">
              {isParenOmni ? '(Omni)' : 'Omni'}
            </span>
          )}
        </span>
      );
    }

    // Other Nixima-0.2 models (Pro, Coder, Flash, Flagship, or default)
    if (/^Nixima-0\.[12](?:\s+(?:Pro|Coder|Flash|Flagship))?$/i.test(part)) {
      const suffix = part.replace(/^Nixima/i, '');
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.85em] font-medium text-zinc-300 ml-0.5">{suffix}</span>
        </span>
      );
    }

    if (/^Nixima\s+ID$/i.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.8em] font-semibold text-zinc-400 uppercase ml-1">ID</span>
        </span>
      );
    }

    if (/^Nixima\s+Credits$/i.test(part)) {
      return (
        <span key={`${keyPrefix}-${idx}`} className="inline-flex items-baseline font-nixima font-extrabold tracking-tight select-none">
          <span className="nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)]">Nixima</span>
          <span className="font-mono text-[0.85em] font-medium text-zinc-300 ml-1">Credits</span>
        </span>
      );
    }

    if (/^(?:Nixima|NIXIMA|Ніксіма)$/i.test(part)) {
      return (
        <span
          key={`${keyPrefix}-${idx}`}
          className="font-nixima font-extrabold tracking-tight nixima-wordmark-sheen drop-shadow-[0_1px_4px_rgba(255,255,255,0.22)] select-none"
        >
          {part}
        </span>
      );
    }

    return part;
  });
}

export const NiximaText: React.FC<{ children: string; className?: string }> = ({
  children,
  className = '',
}) => {
  return <span className={className}>{renderWithNiximaBrand(children)}</span>;
};

