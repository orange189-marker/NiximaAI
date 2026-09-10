import React, { useId } from 'react';

export interface InfinitySymbolProps {
  /**
   * Height of the symbol in pixels or rem (width scales proportionally ~2:1).
   * Default is 14.
   */
  size?: number | string;
  className?: string;
  glow?: boolean;
  /**
   * Whether to animate the internal running iridescent laser stream.
   * Default is true.
   */
  animated?: boolean;
}

/**
 * Official Nixima Infinity Symbol (Pure Vector Iridescent Lemniscate)
 * 
 * 100% Vector implementation with ZERO raster filters or offscreen bitmap buffers,
 * completely eliminating rectangular box artifacts / clipping on dark backgrounds.
 * 
 * Features:
 * - Mathematical continuous cubic Bézier closed loop circuit (path length = 81.9px)
 * - Beveled titanium chassis conduit holding an internal holographic light channel
 * - Circulating iridescent laser stream with running spectrum colors (cyan, indigo, purple, fuchsia, gold, emerald)
 * - Prismatic leading spark and ambient chromatic underglow
 * - Physical 3D optical overlap with uniform ribbon width (no bulky dark clamps)
 */
export const InfinitySymbol: React.FC<InfinitySymbolProps> = ({
  size = 14,
  className = '',
  glow = false,
  animated = true,
}) => {
  const id = useId().replace(/:/g, '');
  const numSize = typeof size === 'number' ? size : parseFloat(size) || 14;
  const width = Math.round(numSize * 2);
  const height = numSize;

  // Exact continuous mathematical lemniscate closed circuit
  const loopPath =
    'M 16 8 C 12.8 3.8 9.6 2 6.5 2 C 3.2 2 1.5 4.5 1.5 8 C 1.5 11.5 3.2 14 6.5 14 C 9.6 14 12.8 12.2 16 8 C 19.2 3.8 22.4 2 25.5 2 C 28.8 2 30.5 4.5 30.5 8 C 30.5 11.5 28.8 14 25.5 14 C 22.4 14 19.2 12.2 16 8 Z';

  // Under-strand sub-path through crossover
  const underStrand =
    'M 12 11.8 C 13.5 10.2 14.8 9 16 8 C 17.2 7 18.5 5.8 20 4.2';

  // Over-strand sub-path through crossover (passes cleanly on top)
  const overStrand =
    'M 12.5 4.8 C 14 6.2 15.2 7.2 16 8 C 16.8 8.8 18 9.8 19.5 11.2';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 16"
      width={width}
      height={height}
      fill="none"
      overflow="visible"
      className={`inline-block select-none flex-shrink-0 align-middle ${className}`}
      style={{ overflow: 'visible' }}
      aria-label="Infinity"
    >
      <defs>
        {/* Outer Titanium Chassis Rim Gradient */}
        <linearGradient id={`${id}-titanium`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#A1A1AA" stopOpacity="0.8" />
          <stop offset="65%" stopColor="#52525B" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.9" />
        </linearGradient>

        {/* Full Iridescent Prismatic Spectrum Gradient */}
        <linearGradient id={`${id}-iridescent`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />     {/* Electric Cyan */}
          <stop offset="18%" stopColor="#818CF8" />    {/* Neon Indigo */}
          <stop offset="36%" stopColor="#C084FC" />    {/* Vivid Purple */}
          <stop offset="54%" stopColor="#F472B6" />    {/* Hot Magenta/Pink */}
          <stop offset="72%" stopColor="#FBBF24" />    {/* Prismatic Gold */}
          <stop offset="88%" stopColor="#34D399" />    {/* Emerald Sheen */}
          <stop offset="100%" stopColor="#38BDF8" />   {/* Electric Cyan */}
        </linearGradient>

        {/* Pure Vector Soft Ambient Glow Stroke (Zero Raster Filter) */}
        <linearGradient id={`${id}-softglow`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C084FC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F472B6" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 0. Optional Pure Vector Soft Corona Glow (Only when glow is requested, 100% vector without bitmap blur) */}
      {glow && (
        <path
          d={loopPath}
          stroke={`url(#${id}-softglow)`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      )}

      {/* 1. Outer Titanium Beveled Chassis (Consistent 2.4px Ribbon Width) */}
      <path
        d={loopPath}
        stroke={`url(#${id}-titanium)`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Deep Recessed Internal Conduit (1.4px Track) */}
      <path
        d={loopPath}
        stroke="#09090B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Ambient Iridescent Underglow Channel */}
      <path
        d={loopPath}
        stroke={`url(#${id}-iridescent)`}
        strokeWidth="1.2"
        opacity="0.3"
        className={animated ? 'animate-infinity-breath' : ''}
      />

      {/* 4. Active Circulating Iridescent Energy Beam (Pure Vector Stroke Dash Animation) */}
      {/* Continuous Running Iridescent Fluid Stream */}
      <path
        d={loopPath}
        stroke={`url(#${id}-iridescent)`}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="36 46"
        className={animated ? 'animate-infinity-flow' : ''}
      />

      {/* High-Luminance Prismatic White Spark at the Head of the Stream */}
      <path
        d={loopPath}
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="7 75"
        opacity="0.95"
        className={animated ? 'animate-infinity-flow' : ''}
      />

      {/* 5. 3D Overlap Weave: Over-strand passes cleanly on top at (16, 8) with identical ribbon width */}
      {/* Precision Micro-Cut under the overpass to create the optical overlap */}
      <path
        d="M 14.8 6.5 L 17.2 9.5"
        stroke="#09090B"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Over-strand Titanium Body */}
      <path
        d={overStrand}
        stroke={`url(#${id}-titanium)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Over-strand Internal Conduit */}
      <path
        d={overStrand}
        stroke="#09090B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Over-strand Iridescent Laser Stream */}
      <path
        d={overStrand}
        stroke={`url(#${id}-iridescent)`}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
};
