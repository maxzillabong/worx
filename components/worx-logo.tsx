/**
 * WorkxLogo
 *
 * SVG logo: lab flask with a heartbeat line — clean, medical, gender/age neutral.
 * Supports light and dark contexts via the `variant` prop.
 */

import React from 'react';

interface WorkxLogoProps {
  size?: number;
  className?: string;
  withWordmark?: boolean;
  /** 'auto' uses CSS (works with Tailwind dark:) — 'light' forces dark text — 'dark' forces light text */
  variant?: 'auto' | 'light' | 'dark';
}

export function WorkxLogo({
  size = 32,
  className = '',
  withWordmark = false,
  variant = 'auto',
}: WorkxLogoProps) {
  const wordmarkClass =
    variant === 'light'
      ? 'text-slate-900'
      : variant === 'dark'
      ? 'text-white'
      : 'text-slate-900 dark:text-white';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Worx logo"
      >
        {/* Flask outline */}
        <path
          d="M11 4h10M12 4v8l-5 10a3 3 0 0 0 2.68 4.33h12.64A3 3 0 0 0 25 22L20 12V4"
          stroke="#14b8a6"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Liquid surface */}
        <path
          d="M8.5 22.5c1.2-1 3.5-.5 5 .5s3.8 1 5 0 3-1 4.5 0"
          stroke="#14b8a6"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Bubbles */}
        <circle cx="14" cy="21" r="1" fill="#2dd4bf" opacity="0.7" />
        <circle cx="18.5" cy="23" r="0.7" fill="#2dd4bf" opacity="0.5" />
        {/* Heartbeat line */}
        <path
          d="M9 18h3l1.5-3 2 5 1.5-4 1 2h3.5"
          stroke="#0f766e"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span className={`font-bold text-base tracking-tight leading-none ${wordmarkClass}`}>
          Worx
        </span>
      )}
    </div>
  );
}
