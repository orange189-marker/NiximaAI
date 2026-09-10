import React, { useId } from 'react';

export type FlagCountry = 'ua' | 'uk' | 'us' | 'en' | 'gb';
export type FlagVariant = 'default' | 'glossy' | 'badge' | 'circle';

export interface CountryFlagProps {
  country: FlagCountry;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: FlagVariant;
  className?: string;
  glow?: boolean;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  size = 'md',
  variant = 'glossy',
  className = '',
  glow = false,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '_');

  // Normalize language codes to country flag
  const normalizedCountry = (() => {
    const c = country.toLowerCase();
    if (c === 'uk') return 'ua';
    if (c === 'en') return 'us';
    return c as 'ua' | 'us' | 'gb';
  })();

  // Size specifications (width x height)
  const dimensions = (() => {
    if (typeof size === 'number') {
      return { width: size, height: Math.round(size * 0.68) };
    }
    switch (size) {
      case 'xs':
        return { width: 16, height: 11, rx: 2.5 };
      case 'sm':
        return { width: 20, height: 14, rx: 3 };
      case 'md':
        return { width: 26, height: 18, rx: 4 };
      case 'lg':
        return { width: 34, height: 23, rx: 5 };
      case 'xl':
        return { width: 44, height: 30, rx: 6 };
      default:
        return { width: 26, height: 18, rx: 4 };
    }
  })();

  const rx = variant === 'circle' ? 18 : dimensions.rx || 4;
  const clipId = `flag-clip-${uid}`;
  const sheenId = `sheen-${uid}`;
  const topLightId = `top-light-${uid}`;

  const renderFlagContent = () => {
    if (normalizedCountry === 'ua') {
      const uaSkyId = `ua-sky-${uid}`;
      const uaWheatId = `ua-wheat-${uid}`;
      return (
        <>
          <defs>
            {/* Ukrainian Sky Azure Radiant Gradient */}
            <linearGradient id={uaSkyId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#006DE8" />
              <stop offset="100%" stopColor="#0051B8" />
            </linearGradient>
            {/* Ukrainian Golden Wheat Radiant Gradient */}
            <linearGradient id={uaWheatId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFDE00" />
              <stop offset="100%" stopColor="#F5B500" />
            </linearGradient>
          </defs>

          {/* Top Half: Radiant Ukrainian Sky Blue */}
          <rect x="0" y="0" width="36" height="12" fill={`url(#${uaSkyId})`} />
          
          {/* Bottom Half: Radiant Ukrainian Golden Wheat */}
          <rect x="0" y="12" width="36" height="12" fill={`url(#${uaWheatId})`} />

          {/* Dividing micro-glow line for high-tech aesthetics */}
          <line x1="0" y1="12" x2="36" y2="12" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.5" />
        </>
      );
    }

    if (normalizedCountry === 'gb') {
      const gbBlueId = `gb-blue-${uid}`;
      const gbRedId = `gb-red-${uid}`;
      return (
        <>
          <defs>
            <linearGradient id={gbBlueId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A2A66" />
              <stop offset="100%" stopColor="#01184A" />
            </linearGradient>
            <linearGradient id={gbRedId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E02438" />
              <stop offset="100%" stopColor="#C8102E" />
            </linearGradient>
          </defs>

          {/* Navy Base */}
          <rect x="0" y="0" width="36" height="24" fill={`url(#${gbBlueId})`} />

          {/* White Diagonals */}
          <path d="M0,0 L36,24 M36,0 L0,24" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="square" />
          
          {/* Red Diagonals (St Patrick Saltire) */}
          <path d="M0,0 L18,12 M36,0 L18,12 M18,12 L36,24 M18,12 L0,24" stroke={`url(#${gbRedId})`} strokeWidth="1.8" />

          {/* White Cross (St George background) */}
          <path d="M18,0 V24 M0,12 H36" stroke="#ffffff" strokeWidth="7" />

          {/* Red Cross (St George) */}
          <path d="M18,0 V24 M0,12 H36" stroke={`url(#${gbRedId})`} strokeWidth="4.2" />
        </>
      );
    }

    // Default: United States Flag (normalizedCountry === 'us')
    const usRedId = `us-red-${uid}`;
    const usNavyId = `us-navy-${uid}`;

    return (
      <>
        <defs>
          <linearGradient id={usRedId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="100%" stopColor="#BA181B" />
          </linearGradient>
          <linearGradient id={usNavyId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D3557" />
            <stop offset="100%" stopColor="#0A192F" />
          </linearGradient>
        </defs>

        {/* 13 Red & White Stripes */}
        <rect x="0" y="0" width="36" height="24" fill="#F8F9FA" />
        <rect x="0" y="0" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="3.69" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="7.38" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="11.08" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="14.77" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="18.46" width="36" height="1.85" fill={`url(#${usRedId})`} />
        <rect x="0" y="22.15" width="36" height="1.85" fill={`url(#${usRedId})`} />

        {/* Navy Blue Canton */}
        <rect x="0" y="0" width="15.5" height="12.92" fill={`url(#${usNavyId})`} />

        {/* 50-Star Grid Constellation (9 staggered rows of precision stars) */}
        <g fill="#ffffff" opacity="0.95">
          {/* Row 1 (6 stars) */}
          <circle cx="1.5" cy="1.3" r="0.45" />
          <circle cx="4.0" cy="1.3" r="0.45" />
          <circle cx="6.5" cy="1.3" r="0.45" />
          <circle cx="9.0" cy="1.3" r="0.45" />
          <circle cx="11.5" cy="1.3" r="0.45" />
          <circle cx="14.0" cy="1.3" r="0.45" />

          {/* Row 2 (5 stars) */}
          <circle cx="2.75" cy="2.59" r="0.45" />
          <circle cx="5.25" cy="2.59" r="0.45" />
          <circle cx="7.75" cy="2.59" r="0.45" />
          <circle cx="10.25" cy="2.59" r="0.45" />
          <circle cx="12.75" cy="2.59" r="0.45" />

          {/* Row 3 (6 stars) */}
          <circle cx="1.5" cy="3.88" r="0.45" />
          <circle cx="4.0" cy="3.88" r="0.45" />
          <circle cx="6.5" cy="3.88" r="0.45" />
          <circle cx="9.0" cy="3.88" r="0.45" />
          <circle cx="11.5" cy="3.88" r="0.45" />
          <circle cx="14.0" cy="3.88" r="0.45" />

          {/* Row 4 (5 stars) */}
          <circle cx="2.75" cy="5.16" r="0.45" />
          <circle cx="5.25" cy="5.16" r="0.45" />
          <circle cx="7.75" cy="5.16" r="0.45" />
          <circle cx="10.25" cy="5.16" r="0.45" />
          <circle cx="12.75" cy="5.16" r="0.45" />

          {/* Row 5 (6 stars) */}
          <circle cx="1.5" cy="6.45" r="0.45" />
          <circle cx="4.0" cy="6.45" r="0.45" />
          <circle cx="6.5" cy="6.45" r="0.45" />
          <circle cx="9.0" cy="6.45" r="0.45" />
          <circle cx="11.5" cy="6.45" r="0.45" />
          <circle cx="14.0" cy="6.45" r="0.45" />

          {/* Row 6 (5 stars) */}
          <circle cx="2.75" cy="7.74" r="0.45" />
          <circle cx="5.25" cy="7.74" r="0.45" />
          <circle cx="7.75" cy="7.74" r="0.45" />
          <circle cx="10.25" cy="7.74" r="0.45" />
          <circle cx="12.75" cy="7.74" r="0.45" />

          {/* Row 7 (6 stars) */}
          <circle cx="1.5" cy="9.03" r="0.45" />
          <circle cx="4.0" cy="9.03" r="0.45" />
          <circle cx="6.5" cy="9.03" r="0.45" />
          <circle cx="9.0" cy="9.03" r="0.45" />
          <circle cx="11.5" cy="9.03" r="0.45" />
          <circle cx="14.0" cy="9.03" r="0.45" />

          {/* Row 8 (5 stars) */}
          <circle cx="2.75" cy="10.31" r="0.45" />
          <circle cx="5.25" cy="10.31" r="0.45" />
          <circle cx="7.75" cy="10.31" r="0.45" />
          <circle cx="10.25" cy="10.31" r="0.45" />
          <circle cx="12.75" cy="10.31" r="0.45" />

          {/* Row 9 (6 stars) */}
          <circle cx="1.5" cy="11.6" r="0.45" />
          <circle cx="4.0" cy="11.6" r="0.45" />
          <circle cx="6.5" cy="11.6" r="0.45" />
          <circle cx="9.0" cy="11.6" r="0.45" />
          <circle cx="11.5" cy="11.6" r="0.45" />
          <circle cx="14.0" cy="11.6" r="0.45" />
        </g>
      </>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${
        glow
          ? normalizedCountry === 'ua'
            ? 'shadow-[0_0_12px_rgba(0,109,232,0.45)] ring-1 ring-blue-400/40'
            : 'shadow-[0_0_12px_rgba(230,57,70,0.4)] ring-1 ring-red-400/40'
          : ''
      } ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: `${rx}px`,
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 36 24"
        className="overflow-hidden"
        style={{
          borderRadius: `${rx}px`,
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="36" height="24" rx={rx} ry={rx} />
          </clipPath>

          {/* High-Tech Specular Sheen Gradient */}
          <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
          </linearGradient>

          {/* Top Reflection Highlight Arc */}
          <linearGradient id={topLightId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Flag Content Clipped by Rounded Rectangle */}
        <g clipPath={`url(#${clipId})`}>
          {renderFlagContent()}

          {/* Glassmorphic Tactical Sheen Overlay */}
          {variant !== 'default' && (
            <>
              <rect
                x="0"
                y="0"
                width="36"
                height="24"
                fill={`url(#${sheenId})`}
                pointerEvents="none"
              />
              {/* Top micro-highlight stripe */}
              <line
                x1="0"
                y1="0.5"
                x2="36"
                y2="0.5"
                stroke={`url(#${topLightId})`}
                strokeWidth="1"
                pointerEvents="none"
              />
            </>
          )}

          {/* Crisp Bezel Border */}
          <rect
            x="0.5"
            y="0.5"
            width="35"
            height="23"
            rx={rx}
            ry={rx}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.2"
            strokeWidth="1"
            pointerEvents="none"
          />
        </g>
      </svg>
    </div>
  );
};
