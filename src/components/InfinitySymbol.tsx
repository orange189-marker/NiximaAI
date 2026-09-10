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
 * Official Nixima Infinity Symbol (Iridescent Running Lemniscate Vector)
 * 
 * Features:
 * - Mathematical continuous cubic Bézier closed loop circuit (path length = 81.9px)
 * - Beveled titanium chassis conduit holding an internal holographic light channel
 * - Circulating iridescent laser stream with running spectrum colors (cyan, indigo, purple, fuchsia, gold, emerald)
 * - Prismatic leading spark and ambient chromatic underglow
 * - Physical 3D optical overlap giving authentic Mobius ribbon depth
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 16"
      width={width}
      height={height}
      fill="none"
      className={`inline-block select-none flex-shrink-0 align-middle ${className}`}
      style={{
        filter: glow
          ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.4))'
          : 'drop-shadow(0 0 2.5px rgba(168, 85, 247, 0.35))',
      }}
      aria-label="Infinity"
    >
      <defs>
        {/* Outer Titanium Chassis Rim Gradient */}
        <linearGradient id={`${id}-titanium`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#A1A1AA" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#52525B" stopOpacity="0.6" />
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

        {/* Soft Radial Center Depth Occlusion */}
        <radialGradient id={`${id}-crossover`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#09090B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Outer Titanium Beveled Chassis */}
      <path
        d={loopPath}
        stroke={`url(#${id}-titanium)`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Deep Recessed Hollow Conduit (Dark Bed) */}
      <path
        d={loopPath}
        stroke="#0E0E12"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Ambient Iridescent Underglow Channel */}
      <path
        d={loopPath}
        stroke={`url(#${id}-iridescent)`}
        strokeWidth="1.6"
        opacity="0.38"
        className={animated ? 'animate-infinity-breath' : ''}
      />

      {/* 4. Active Circulating Iridescent Energy Beam */}
      <g className={animated ? 'animate-infinity-hue' : ''}>
        {/* Continuous Running Iridescent Fluid Stream */}
        <path
          d={loopPath}
          stroke={`url(#${id}-iridescent)`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray="36 46"
          className={animated ? 'animate-infinity-flow' : ''}
          style={{
            filter: 'drop-shadow(0 0 2px rgba(192, 132, 252, 0.8))',
          }}
        />

        {/* High-Luminance Prismatic White Spark at the Head of the Stream */}
        <path
          d={loopPath}
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="7 75"
          opacity="0.95"
          className={animated ? 'animate-infinity-flow' : ''}
          style={{
            filter: 'drop-shadow(0 0 3px #FFFFFF)',
          }}
        />
      </g>

      {/* 5. 3D Overlap Shadow Barrier (Creates physical depth at the center crossover) */}
      <circle
        cx="16"
        cy="8"
        r="2.6"
        fill={`url(#${id}-crossover)`}
      />

      {/* 6. Foreground Strand Overpass Cap at (16, 8) with negative-space depth */}
      <path
        d="M 13.8 5.6 L 18.2 10.4"
        stroke="#09090B"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M 13.8 5.6 L 18.2 10.4"
        stroke={`url(#${id}-titanium)`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <g className={animated ? 'animate-infinity-hue' : ''}>
        <path
          d="M 14.2 6.0 L 17.8 10.0"
          stroke={`url(#${id}-iridescent)`}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
