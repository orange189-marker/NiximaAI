import React, { useId, useState, useEffect } from 'react';

interface AnimatedEyeProps {
  isShowing: boolean; // true = password visible (open eye), false = password hidden (crossed eye)
  className?: string;
  size?: number;
}

export const AnimatedEye: React.FC<AnimatedEyeProps> = ({
  isShowing,
  className = 'w-4 h-4',
  size = 18,
}) => {
  const maskId = useId();
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsBlinking(true);
    const timer = setTimeout(() => setIsBlinking(false), 240);
    return () => clearTimeout(timer);
  }, [isShowing]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} select-none overflow-visible transition-colors duration-200`}
      style={{
        filter: isShowing ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))' : 'none',
      }}
    >
      <defs>
        {/* Dynamic Alpha Mask to cleanly cut out where the slash crosses */}
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <line
            x1="3"
            y1="3"
            x2="21"
            y2="21"
            stroke="black"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{
              strokeDasharray: 28,
              strokeDashoffset: isShowing ? 28 : 0,
              transition: 'stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </mask>
      </defs>

      {/* Main Eye Shape & Pupil masked by the slash gap with cybernetic blink */}
      <g
        mask={`url(#${maskId})`}
        style={{
          transformOrigin: '12px 12px',
          transform: isBlinking ? 'scaleY(0.12)' : isShowing ? 'scaleY(1)' : 'scaleY(0.88)',
          transition: isBlinking
            ? 'transform 0.1s ease-in'
            : 'transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Eye contour curve */}
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />

        {/* Pupil / Iris with reflection glow */}
        <g
          style={{
            transformOrigin: '12px 12px',
            transform: isShowing ? 'scale(1)' : 'scale(0.72)',
            opacity: isShowing ? 1 : 0.45,
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
          }}
        >
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          {/* Cyber reflection dot */}
          <circle
            cx="13.2"
            cy="10.8"
            r="0.85"
            fill="#ffffff"
            style={{
              opacity: isShowing ? 0.95 : 0,
              transition: 'opacity 0.25s ease',
            }}
          />
        </g>
      </g>

      {/* Animated Crossing Slash Laser */}
      <line
        x1="3"
        y1="3"
        x2="21"
        y2="21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          strokeDasharray: 28,
          strokeDashoffset: isShowing ? 28 : 0,
          opacity: isShowing ? 0 : 1,
          transformOrigin: '3px 3px',
          transition:
            'stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        }}
      />
    </svg>
  );
};
