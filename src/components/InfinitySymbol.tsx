import React, { useId } from 'react';

export interface InfinitySymbolProps {
  /**
   * Height of the symbol in pixels or rem (width scales proportionally ~2:1).
   * Default is 14.
   */
  size?: number | string;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

/**
 * Official Nixima Infinity Symbol (Lemniscate 3D Mobius Vector)
 * 
 * Replaces generic unicode/emoji characters with a mathematically precise,
 * continuous geometric Mobius ribbon. Features:
 * - Overlapping 3D woven crossover with negative-space depth
 * - Monochromatic titanium gradient matching Nixima's hardware aesthetic
 * - Proportional scaling with seamless vertical alignment
 */
export const InfinitySymbol: React.FC<InfinitySymbolProps> = ({
  size = 14,
  className = '',
  glow = false,
  animated = false,
}) => {
  const id = useId().replace(/:/g, '');
  const numSize = typeof size === 'number' ? size : parseFloat(size) || 14;
  const width = Math.round(numSize * 2);
  const height = numSize;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 16"
      width={width}
      height={height}
      fill="none"
      className={`inline-block select-none flex-shrink-0 align-middle ${animated ? 'animate-pulse' : ''} ${className}`}
      style={{
        filter: glow ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.65)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.25))' : 'none',
      }}
      aria-label="Infinity"
    >
      <defs>
        {/* Titanium Highlight to Zinc Shadow Ribbon Gradient */}
        <linearGradient id={`${id}-titanium`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E4E4E7" />
          <stop offset="55%" stopColor="#A1A1AA" />
          <stop offset="78%" stopColor="#D4D4D8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        {/* Ambient Subtle Core Shimmer */}
        <linearGradient id={`${id}-core`} x1="0" y1="8" x2="32" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#D4D4D8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Under-Strand: Ascending diagonal through center (passing under the descending strand) */}
      <path
        d="M 11.5 12.2 C 13.5 10 14.8 9 16 8 C 17.2 7 18.5 6 20.5 3.8 C 22.4 2 24.2 2 25.5 2 C 28.8 2 30.5 4.5 30.5 8 C 30.5 11.5 28.8 14 25.5 14 C 22.4 14 19.2 12.2 16 8"
        stroke={`url(#${id}-titanium)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Negative Space Depth Barrier: Creates the 3D optical overlap at the crossing */}
      <path
        d="M 13.5 5.5 L 18.5 10.5"
        stroke="#09090B"
        strokeWidth="4.6"
        strokeLinecap="round"
      />

      {/* Over-Strand: Descending diagonal through center (passing cleanly over) */}
      <path
        d="M 20.5 12.2 C 18.5 10 17.2 9 16 8 C 14.8 7 13.5 6 11.5 3.8 C 9.6 2 7.8 2 6.5 2 C 3.2 2 1.5 4.5 1.5 8 C 1.5 11.5 3.2 14 6.5 14 C 8.5 14 10.5 13 11.5 12.2"
        stroke={`url(#${id}-titanium)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Precision Core Specular Line for Crisp Metallic Sheen */}
      <path
        d="M 6.5 3 C 4 3 2.5 5.2 2.5 8 C 2.5 10.8 4 13 6.5 13 M 25.5 3 C 28 3 29.5 5.2 29.5 8 C 29.5 10.8 28 13 25.5 13"
        stroke={`url(#${id}-core)`}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};
