import React, { useId } from 'react';

export interface NiximaCreditLogoProps {
  size?: number | string;
  className?: string;
  glow?: boolean;
}

/**
 * Official Nixima Credit (CR) Vector Token Logo
 * Designed with a sleek, minimalist monochromatic titanium aesthetic.
 * Clean faceted polygon with an embossed precision geometric crystal core.
 */
export const NiximaCreditLogo: React.FC<NiximaCreditLogoProps> = ({
  size = 15,
  className = '',
  glow = false,
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`inline-block select-none flex-shrink-0 align-middle ${className}`}
      style={{
        filter: glow ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))' : 'none',
      }}
    >
      <defs>
        {/* Monochromatic Titanium Rim Gradient */}
        <linearGradient id={`${id}-rim`} x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#A1A1AA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.4" />
        </linearGradient>

        {/* Deep Carbon/Titanium Plate Fill */}
        <linearGradient id={`${id}-fill`} x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#222226" />
          <stop offset="100%" stopColor="#0E0E11" />
        </linearGradient>

        {/* Faceted Core Emblem Gradient */}
        <linearGradient id={`${id}-core`} x1="7" y1="6" x2="17" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#71717A" />
        </linearGradient>
      </defs>

      {/* Outer Hexagonal Titanium Token Body */}
      <polygon
        points="12,2.5 20.5,7.4 20.5,16.6 12,21.5 3.5,16.6 3.5,7.4"
        fill={`url(#${id}-fill)`}
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Subtle Inner Concentric Token Inset */}
      <polygon
        points="12,4.8 18.2,8.4 18.2,15.6 12,19.2 5.8,15.6 5.8,8.4"
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />

      {/* Stylized Precision Geometric "CR" Crystal Prism Mark */}
      {/* Upper facet */}
      <path
        d="M12 7.5 L15.2 10.2 L8.8 10.2 Z"
        fill={`url(#${id}-core)`}
        opacity="0.95"
      />
      {/* Central diamond facet */}
      <path
        d="M8.8 10.2 L15.2 10.2 L12 16.5 Z"
        fill={`url(#${id}-core)`}
        opacity="0.8"
      />
      {/* Center light reflection line */}
      <line
        x1="12"
        y1="7.5"
        x2="12"
        y2="16.5"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
};
