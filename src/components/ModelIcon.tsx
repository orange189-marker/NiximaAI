import React from 'react';

export type ModelIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface ModelIconProps {
  modelId: string;
  size?: ModelIconSize;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

interface ModelTheme {
  name: string;
  containerBg: string;
  borderClass: string;
  glowClass: string;
  accentColor: string;
  renderGlyph: (s: number, animated?: boolean) => React.ReactNode;
}

/**
 * Returns pixel dimensions for standardized size tokens
 */
function resolveSizePx(size: ModelIconSize): number {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'xs': return 18;
    case 'sm': return 24;
    case 'md': return 32;
    case 'lg': return 40;
    case 'xl': return 48;
    default: return 24;
  }
}

/**
 * Model Icon themes with bespoke vector glyphs tailored to each engine's personality:
 * - 0.2O Omni: Multimodal Sovereign Core (Interconnected orbital rings & central diamond star)
 * - 0.3 Coder: Cyber Titan Code Architect (Matrix terminal brackets, glowing silicon diamond & 0.3 pip)
 * - 0.2 Pro: Quantum Epistemic Dialectic (Dual-synapse neural dialectic core with counter-example nodes)
 * - 0.2 Flagship: Sovereign Synthetic Platinum (Faceted titanium crown star with SRA rotary geometry)
 * - 0.2 Coder: Systems Developer (High-concurrency logic CPU chip & terminal glyphs)
 * - 0.2 Flash: Hyper-Throughput Plasma (Dual lightning velocity surges & sub-millisecond core)
 */
function getModelTheme(id: string): ModelTheme {
  const norm = (id || '').toLowerCase();

  // 1. NIXIMA 0.2O OMNI
  if (norm.includes('omni')) {
    return {
      name: 'Omni',
      containerBg: 'bg-gradient-to-br from-cyan-950/90 via-[#061826]/90 to-[#020b12]/95',
      borderClass: 'border-cyan-500/50 hover:border-cyan-400/80',
      glowClass: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
      accentColor: '#06b6d4',
      renderGlyph: (s, animated) => (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
          <defs>
            <linearGradient id="omni-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <radialGradient id="omni-core" cx="12" cy="12" r="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#0891b2" />
            </radialGradient>
          </defs>
          {/* Orbital Ellipse 1 */}
          <ellipse
            cx="12"
            cy="12"
            rx="8.5"
            ry="3.5"
            transform="rotate(-30 12 12)"
            stroke="url(#omni-grad)"
            strokeWidth="1.3"
            strokeDasharray="2 1"
            className={animated ? 'animate-spin opacity-85' : 'opacity-75'}
            style={animated ? { animationDuration: '6s' } : undefined}
          />
          {/* Orbital Ellipse 2 */}
          <ellipse
            cx="12"
            cy="12"
            rx="8.5"
            ry="3.5"
            transform="rotate(45 12 12)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.6"
          />
          {/* Central Sovereign Omni Diamond */}
          <path
            d="M12 5.5L14.5 12L12 18.5L9.5 12Z"
            fill="url(#omni-core)"
            filter="drop-shadow(0 0 4px rgba(6,182,212,0.8))"
          />
          <circle cx="12" cy="12" r="1.8" fill="#ffffff" />
          {/* Four Guiding Micro-Nodes */}
          <circle cx="12" cy="3" r="1" fill="#67e8f9" />
          <circle cx="21" cy="12" r="1" fill="#38bdf8" />
          <circle cx="12" cy="21" r="1" fill="#0284c7" />
          <circle cx="3" cy="12" r="1" fill="#06b6d4" />
        </svg>
      )
    };
  }

  // 2. NIXIMA 0.3 CODER (TITAN)
  if (norm.includes('0.3') && norm.includes('coder')) {
    return {
      name: '0.3 Titan Coder',
      containerBg: 'bg-gradient-to-br from-emerald-950/90 via-[#031d13]/90 to-[#010c08]/95',
      borderClass: 'border-emerald-500/60 hover:border-emerald-400/90',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      accentColor: '#10b981',
      renderGlyph: (s, animated) => (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
          <defs>
            <linearGradient id="coder03-grad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Outer Cyber Shield / Diamond Bounds */}
          <path
            d="M12 2.5L20.5 7V17L12 21.5L3.5 17V7L12 2.5Z"
            stroke="url(#coder03-grad)"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          {/* Left Code Bracket < */}
          <path
            d="M8.5 8.5L5.5 12L8.5 15.5"
            stroke="url(#coder03-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Code Bracket > */}
          <path
            d="M15.5 8.5L18.5 12L15.5 15.5"
            stroke="url(#coder03-grad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central DeepThinking V2.1 Neon Diamond Core */}
          <path
            d="M12 8L14 12L12 16L10 12Z"
            fill="#34d399"
            filter="drop-shadow(0 0 5px rgba(16,185,129,0.9))"
            className={animated ? 'animate-pulse' : ''}
          />
          <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
          {/* 0.3 Titanium Marker Pip */}
          <circle cx="17.5" cy="5" r="1.2" fill="#a7f3d0" />
        </svg>
      )
    };
  }

  // 3. NIXIMA 0.2 PRO (ULTRA REASONING PRO)
  if (norm.includes('pro') || norm.includes('reasoning')) {
    return {
      name: '0.2 Pro',
      containerBg: 'bg-gradient-to-br from-purple-950/90 via-[#18092a]/90 to-[#0a0314]/95',
      borderClass: 'border-purple-500/60 hover:border-purple-400/90',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      accentColor: '#a855f7',
      renderGlyph: (s, animated) => (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
          <defs>
            <linearGradient id="pro-violet-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <radialGradient id="pro-pulse-core" cx="12" cy="12" r="5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </radialGradient>
          </defs>
          {/* Left Brain Synapse Hemisphere */}
          <path
            d="M10 5C7.2 5 5 7.2 5 10C5 11.2 5.4 12.3 6.1 13.1C5.4 13.9 5 15 5 16.2C5 18.3 6.7 20 8.8 20C9.6 20 10.3 19.7 10.9 19.2"
            stroke="url(#pro-violet-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Right Brain Synapse Hemisphere */}
          <path
            d="M14 5C16.8 5 19 7.2 19 10C19 11.2 18.6 12.3 17.9 13.1C18.6 13.9 19 15 19 16.2C19 18.3 17.3 20 15.2 20C14.4 20 13.7 19.7 13.1 19.2"
            stroke="url(#pro-violet-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Quantum Dialectic Cross-Synapses */}
          <line x1="10" y1="9" x2="14" y2="9" stroke="#c084fc" strokeWidth="1.3" strokeDasharray="1.5 1" />
          <line x1="9" y1="13" x2="15" y2="13" stroke="#c084fc" strokeWidth="1.3" strokeDasharray="1.5 1" />
          <line x1="10" y1="17" x2="14" y2="17" stroke="#c084fc" strokeWidth="1.3" strokeDasharray="1.5 1" />
          {/* Central Epistemic Sovereign Node */}
          <circle
            cx="12"
            cy="13"
            r="2.2"
            fill="url(#pro-pulse-core)"
            filter="drop-shadow(0 0 5px rgba(168,85,247,0.9))"
            className={animated ? 'animate-pulse' : ''}
          />
          <circle cx="12" cy="13" r="0.9" fill="#ffffff" />
        </svg>
      )
    };
  }

  // 4. NIXIMA 0.2 CODER (SYSTEMS DEV)
  if (norm.includes('coder')) {
    return {
      name: '0.2 Coder',
      containerBg: 'bg-gradient-to-br from-blue-950/90 via-[#0c1830]/90 to-[#040a14]/95',
      borderClass: 'border-blue-500/50 hover:border-blue-400/80',
      glowClass: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
      accentColor: '#3b82f6',
      renderGlyph: (s) => (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
          <defs>
            <linearGradient id="coder02-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          {/* Silicon Systems Chip Frame */}
          <rect x="5.5" y="5.5" width="13" height="13" rx="2.5" stroke="url(#coder02-grad)" strokeWidth="1.4" />
          {/* Bus Pins */}
          <line x1="9" y1="2.5" x2="9" y2="5.5" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="15" y1="2.5" x2="15" y2="5.5" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="9" y1="18.5" x2="9" y2="21.5" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="15" y1="18.5" x2="15" y2="21.5" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2.5" y1="9" x2="5.5" y2="9" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2.5" y1="15" x2="5.5" y2="15" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="18.5" y1="9" x2="21.5" y2="9" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="18.5" y1="15" x2="21.5" y2="15" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" />
          {/* Core Processor Logic Glyphs */}
          <path d="M9.5 10L8 12L9.5 14" stroke="#bfdbfe" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 10L16 12L14.5 14" stroke="#bfdbfe" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="1.3" fill="#60a5fa" />
        </svg>
      )
    };
  }

  // 5. NIXIMA 0.2 FLASH (HYPER SPEED)
  if (norm.includes('flash')) {
    return {
      name: '0.2 Flash',
      containerBg: 'bg-gradient-to-br from-amber-950/90 via-[#261505]/90 to-[#0e0702]/95',
      borderClass: 'border-amber-500/50 hover:border-amber-400/80',
      glowClass: 'shadow-[0_0_14px_rgba(245,158,11,0.35)]',
      accentColor: '#f59e0b',
      renderGlyph: (s, animated) => (
        <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
          <defs>
            <linearGradient id="flash-solar-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* High-Voltage Velocity Sparks */}
          <path
            d="M13 2.5L4.5 13H11.5L9.5 21.5L19.5 9.5H12.5L14.5 2.5Z"
            fill="url(#flash-solar-grad)"
            filter="drop-shadow(0 0 4px rgba(245,158,11,0.85))"
            className={animated ? 'animate-pulse' : ''}
          />
          {/* White Core Filament */}
          <path
            d="M12.5 5.5L7.5 12H11.5L10.5 17.5L16.5 10.5H12L13.5 5.5Z"
            fill="#ffffff"
            opacity="0.75"
          />
        </svg>
      )
    };
  }

  // 6. NIXIMA 0.2 (FLAGSHIP DEFAULT)
  return {
    name: '0.2 Flagship',
    containerBg: 'bg-gradient-to-br from-zinc-800/90 via-[#18181b]/95 to-[#09090b]/98',
    borderClass: 'border-zinc-500/60 hover:border-white/80',
    glowClass: 'shadow-[0_0_12px_rgba(255,255,255,0.2)]',
    accentColor: '#ffffff',
    renderGlyph: (s, animated) => (
      <svg viewBox="0 0 24 24" width={s} height={s} fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="flagship-silver" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#e4e4e7" />
            <stop offset="100%" stopColor="#71717a" />
          </linearGradient>
        </defs>
        {/* Diamond Outer Orbit Facet */}
        <polygon
          points="12,2.5 21.5,12 12,21.5 2.5,12"
          stroke="url(#flagship-silver)"
          strokeWidth="1.3"
          strokeOpacity="0.6"
        />
        {/* Inner Sovereign Star / Rotary Attention Core */}
        <path
          d="M12 4.5L13.8 10.2L19.5 12L13.8 13.8L12 19.5L10.2 13.8L4.5 12L10.2 10.2Z"
          fill="url(#flagship-silver)"
          filter="drop-shadow(0 0 5px rgba(255,255,255,0.65))"
          className={animated ? 'animate-pulse' : ''}
        />
        {/* Central Core Luminescence */}
        <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
      </svg>
    )
  };
}

/**
 * Modern High-Tech Model Icon Component
 * Features precision squircle chassis, physical specular highlights,
 * model-specific vector emblems, and subtle glowing radiance.
 */
export const ModelIcon: React.FC<ModelIconProps> = ({
  modelId,
  size = 'sm',
  className = '',
  glow = true,
  animated = false,
}) => {
  const px = resolveSizePx(size);
  const theme = getModelTheme(modelId);
  const glyphSize = Math.max(10, Math.round(px * 0.62));

  // Determine rounded corner radii proportionate to container size
  const roundedClass = px <= 20 ? 'rounded-md' : px <= 28 ? 'rounded-lg' : 'rounded-xl';

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none transition-all duration-200 group ${roundedClass} ${theme.containerBg} border ${theme.borderClass} ${
        glow ? theme.glowClass : ''
      } ${className}`}
      style={{
        width: px,
        height: px,
        boxShadow: glow
          ? `inset 0 1px 0 rgba(255, 255, 255, 0.18)`
          : 'none',
      }}
      title={theme.name}
    >
      {/* Specular Inner Bevel Highlight */}
      <span className="absolute inset-0 pointer-events-none rounded-[inherit] ring-1 ring-inset ring-white/[0.07]" />

      {/* Model-Specific High-Resolution Vector Emblem */}
      <div className="relative flex items-center justify-center pointer-events-none">
        {theme.renderGlyph(glyphSize, animated)}
      </div>

      {/* Subtle Breathing Core Aura for Animated / Streaming states */}
      {animated && (
        <span
          className="absolute -inset-0.5 rounded-[inherit] pointer-events-none opacity-40 animate-ping"
          style={{ backgroundColor: theme.accentColor }}
        />
      )}
    </div>
  );
};
export default ModelIcon;
