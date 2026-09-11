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
   * Whether to animate the internal running laser stream.
   * Default is true.
   */
  animated?: boolean;
  /**
   * Whether the infinity core is active/powered on.
   * When false (cold/dormant state):
   * - Matte titanium brushed chassis
   * - Dark graphite track with zero movement
   * When true (active radiant state):
   * - Polished luminescent chassis
   * - Continuous circulating energy laser stream & white photon spark
   * - Vector breathing aura
   * Default is true.
   */
  active?: boolean;
  /**
   * Color theme for the active radiant state:
   * - 'iridescent': Multicolored chromatic spectrum (Cyan, Indigo, Purple, Pink, Gold, Emerald)
   * - 'amber': Solar Sovereign Amber/Gold (Gold, Amber, Neon Orange, Rose Crimson)
   * Default is 'iridescent'.
   */
  theme?: 'iridescent' | 'amber';
}

/**
 * Official Nixima Infinity Symbol (Pure Vector Lemniscate)
 * 
 * 100% Vector implementation with ZERO raster filters or offscreen bitmap buffers,
 * completely eliminating rectangular box artifacts / clipping on dark backgrounds.
 * 
 * Features:
 * - Cold dormant state: Still, titanium matte, dark core, 0% motion.
 * - Active awakened state: Circulating energy laser, cruising photon spark, breathing vector aura.
 * - Ultra-smooth 350ms cross-fade transition between cold and active states.
 * - Mathematical continuous cubic Bézier closed loop circuit (path length = 81.9px)
 * - Physical 3D optical overlap with uniform ribbon width.
 */
export const InfinitySymbol: React.FC<InfinitySymbolProps> = ({
  size = 14,
  className = '',
  glow = false,
  animated = true,
  active = true,
  theme = 'iridescent',
}) => {
  const id = useId().replace(/:/g, '');
  const numSize = typeof size === 'number' ? size : parseFloat(size) || 14;
  const width = Math.round(numSize * 2);
  const height = numSize;

  const isMoving = active && animated;

  // Exact continuous mathematical lemniscate closed circuit
  const loopPath =
    'M 16 8 C 12.8 3.8 9.6 2 6.5 2 C 3.2 2 1.5 4.5 1.5 8 C 1.5 11.5 3.2 14 6.5 14 C 9.6 14 12.8 12.2 16 8 C 19.2 3.8 22.4 2 25.5 2 C 28.8 2 30.5 4.5 30.5 8 C 30.5 11.5 28.8 14 25.5 14 C 22.4 14 19.2 12.2 16 8 Z';

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
        {/* Cold Dormant Titanium Chassis */}
        <linearGradient id={`${id}-cold-chassis`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#71717A" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#3F3F46" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#52525B" stopOpacity="0.8" />
        </linearGradient>

        {/* Active Radiant Chassis: Iridescent Titanium or Solar Gold */}
        {theme === 'amber' ? (
          <linearGradient id={`${id}-active-chassis`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.95" />
          </linearGradient>
        ) : (
          <linearGradient id={`${id}-active-chassis`} x1="1" y1="2" x2="31" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#A1A1AA" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#52525B" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0.9" />
          </linearGradient>
        )}

        {/* Active Energy Beam Stream */}
        {theme === 'amber' ? (
          <linearGradient id={`${id}-active-laser`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />    {/* Solar Gold */}
            <stop offset="22%" stopColor="#F59E0B" />   {/* Amber Glow */}
            <stop offset="45%" stopColor="#FB923C" />   {/* Neon Orange */}
            <stop offset="68%" stopColor="#F43F5E" />   {/* Rose Crimson Pulse */}
            <stop offset="85%" stopColor="#FBBF24" />   {/* Golden Spark */}
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
        ) : (
          <linearGradient id={`${id}-active-laser`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />     {/* Electric Cyan */}
            <stop offset="18%" stopColor="#818CF8" />    {/* Neon Indigo */}
            <stop offset="36%" stopColor="#C084FC" />    {/* Vivid Purple */}
            <stop offset="54%" stopColor="#F472B6" />    {/* Hot Magenta/Pink */}
            <stop offset="72%" stopColor="#FBBF24" />    {/* Prismatic Gold */}
            <stop offset="88%" stopColor="#34D399" />    {/* Emerald Sheen */}
            <stop offset="100%" stopColor="#38BDF8" />   {/* Electric Cyan */}
          </linearGradient>
        )}

        {/* Pure Vector Soft Ambient Vector Aura */}
        {theme === 'amber' ? (
          <linearGradient id={`${id}-active-glow`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.5" />
          </linearGradient>
        ) : (
          <linearGradient id={`${id}-active-glow`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#C084FC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.4" />
          </linearGradient>
        )}
      </defs>

      {/* 1. Base Dark Recessed Ground Channel (Always present underneath) */}
      <path
        d={loopPath}
        stroke="#09090B"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. COLD DORMANT LAYER (Active when OFF: zero motion, brushed titanium, dark matte conduit) */}
      <g
        style={{
          opacity: active ? 0 : 1,
          transition: 'opacity 0.35s ease-out',
          pointerEvents: active ? 'none' : 'auto',
        }}
      >
        {/* Cold Chassis Rim */}
        <path
          d={loopPath}
          stroke={`url(#${id}-cold-chassis)`}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cold Dormant Inner Core (No movement, dark matte steel) */}
        <path
          d={loopPath}
          stroke="#27272A"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {/* Cold Overpass 3D Weave */}
        <path
          d="M 14.8 6.5 L 17.2 9.5"
          stroke="#09090B"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d={overStrand}
          stroke={`url(#${id}-cold-chassis)`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={overStrand}
          stroke="#27272A"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      {/* 3. ACTIVE RADIANT LAYER (Active when ON: awakened laser flow, photon spark, breathing aura) */}
      <g
        style={{
          opacity: active ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: active ? 'auto' : 'none',
        }}
      >
        {/* Soft Ambient Vector Aura (Zero Raster Filter) */}
        {glow && (
          <path
            d={loopPath}
            stroke={`url(#${id}-active-glow)`}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
            className={isMoving ? 'animate-infinity-breath' : ''}
          />
        )}

        {/* Radiant Polished Chassis */}
        <path
          d={loopPath}
          stroke={`url(#${id}-active-chassis)`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Deep Internal Recessed Track */}
        <path
          d={loopPath}
          stroke="#09090B"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ambient Underglow Core */}
        <path
          d={loopPath}
          stroke={`url(#${id}-active-laser)`}
          strokeWidth="1.2"
          opacity="0.3"
          className={isMoving ? 'animate-infinity-breath' : ''}
        />

        {/* Circulating Running Energy Laser Stream */}
        <path
          d={loopPath}
          stroke={`url(#${id}-active-laser)`}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="36 46"
          className={isMoving ? 'animate-infinity-flow' : ''}
        />

        {/* High-Luminance White-Hot Photon Spark Head */}
        <path
          d={loopPath}
          stroke="#FFFFFF"
          strokeWidth="0.95"
          strokeLinecap="round"
          strokeDasharray="7 75"
          opacity="0.95"
          className={isMoving ? 'animate-infinity-flow' : ''}
        />

        {/* Active 3D Overpass Weave */}
        <path
          d="M 14.8 6.5 L 17.2 9.5"
          stroke="#09090B"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d={overStrand}
          stroke={`url(#${id}-active-chassis)`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d={overStrand}
          stroke="#09090B"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d={overStrand}
          stroke={`url(#${id}-active-laser)`}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
