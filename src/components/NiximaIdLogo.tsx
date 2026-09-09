import React, { useId } from 'react';

export interface NiximaIdLogoProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

/**
 * Official Nixima ID Vector Emblem
 * Represents sovereign biometric / cryptographic identity in the Nixima network.
 */
export const NiximaIdLogo: React.FC<NiximaIdLogoProps> = ({
  size = 24,
  className = '',
  glow = true,
  animated = false,
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="none"
      className={`inline-block select-none flex-shrink-0 transition-transform duration-200 ${className}`}
      style={{
        filter: glow ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.35))' : 'none',
      }}
    >
      <defs>
        {/* Luminous Silver-White Gradient for Central 'N' */}
        <linearGradient id={`${id}-n-grad`} x1="8.5" y1="7.5" x2="19.5" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1AA" />
        </linearGradient>

        {/* High-Tech Beveled Identity Plate Fill */}
        <linearGradient id={`${id}-plate`} x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1C1C22" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0B0B0E" stopOpacity="0.98" />
        </linearGradient>

        {/* Metallic Bevel Stroke */}
        <linearGradient id={`${id}-stroke`} x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.65)" />
          <stop offset="45%" stopColor="rgba(255, 255, 255, 0.2)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
        </linearGradient>

        {/* Radial Glow on Verification Core */}
        <radialGradient id={`${id}-core-glow`} cx="14" cy="14" r="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Cybernetic Octagonal Identity Plate */}
      <polygon
        points="8,2 20,2 26,8 26,20 20,26 8,26 2,20 2,8"
        fill={`url(#${id}-plate)`}
        stroke={`url(#${id}-stroke)`}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Micro Hardware Circuit Corner Guides */}
      <line x1="7.5" y1="3.5" x2="3.5" y2="7.5" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
      <line x1="20.5" y1="3.5" x2="24.5" y2="7.5" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
      <line x1="3.5" y1="20.5" x2="7.5" y2="24.5" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />
      <line x1="24.5" y1="20.5" x2="20.5" y2="24.5" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.8" />

      {/* Top and Bottom Tech Notch Points */}
      <circle cx="14" cy="3.5" r="0.85" fill="rgba(255, 255, 255, 0.5)" />
      <circle cx="14" cy="24.5" r="0.85" fill="rgba(255, 255, 255, 0.5)" />

      {/* The Central Iconic Nixima 'N' Monogram */}
      <path
        d="M 8.5 20.5 L 8.5 7.5 L 19.5 20.5 L 19.5 7.5"
        stroke={`url(#${id}-n-grad)`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Micro Precision ID Verification Core */}
      <circle
        cx="14"
        cy="14"
        r="4"
        fill={`url(#${id}-core-glow)`}
        opacity={animated ? 0.9 : 0.6}
        className={animated ? "animate-pulse" : ""}
      />

      {/* Reticle Orbit Ring */}
      <circle
        cx="14"
        cy="14"
        r="3.2"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="0.75"
        strokeDasharray="1.8 1.4"
        className={animated ? "origin-center animate-spin" : ""}
        style={{ animationDuration: '8s' }}
      />

      {/* Center White Optical Core Node */}
      <circle cx="14" cy="14" r="1.3" fill="#FFFFFF" />
    </svg>
  );
};

export interface NiximaIdBadgeProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showVerified?: boolean;
}

/**
 * Pre-composed, premium badge pairing the Nixima ID Logo with text
 */
export const NiximaIdBadge: React.FC<NiximaIdBadgeProps> = ({
  label = 'NIXIMA ID',
  size = 'md',
  className = '',
  showVerified = true,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5',
  }[size];

  const logoSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-lg bg-zinc-950/80 border border-zinc-800/90 text-white font-mono tracking-tight shadow-inner-light backdrop-blur-md select-none group hover:border-zinc-600 transition-colors ${sizeClasses} ${className}`}
    >
      <NiximaIdLogo size={logoSizes} animated glow />
      <span className="font-semibold tracking-wider uppercase text-white group-hover:text-white transition-colors">
        {label}
      </span>
      {showVerified && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] ml-0.5"
          title="Cryptographically Secured"
        />
      )}
    </span>
  );
};
