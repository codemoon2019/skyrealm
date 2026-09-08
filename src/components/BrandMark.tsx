import { useId } from 'react';

interface Props {
  className?: string;
  size?: number;
}

export function BrandMark({ className = '', size = 148 }: Props) {
  const uid = useId().replace(/:/g, '');
  const sky = `sky-${uid}`;
  const wing = `wing-${uid}`;
  const gold = `gold-${uid}`;
  const star = `star-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <svg
      className={`brand-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="SKYREALM"
    >
      <defs>
        <radialGradient id={sky} cx="38%" cy="26%" r="80%">
          <stop offset="0%" stopColor="#fff7d8" />
          <stop offset="38%" stopColor="#ffd9a0" />
          <stop offset="70%" stopColor="#9ed49a" />
          <stop offset="100%" stopColor="#5a3a78" />
        </radialGradient>
        <linearGradient id={wing} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#fffef8" />
          <stop offset="55%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#ffb0c8" />
        </linearGradient>
        <linearGradient id={gold} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fff6c8" />
          <stop offset="55%" stopColor="#ffd24a" />
          <stop offset="100%" stopColor="#d48a20" />
        </linearGradient>
        <linearGradient id={star} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#fffef6" />
          <stop offset="100%" stopColor="#ffd24a" />
        </linearGradient>
        <filter id={glow} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="100" cy="100" r="74" fill={`url(#${sky})`} />
      <circle cx="132" cy="58" r="20" fill="#fff4b8" />
      <circle cx="132" cy="58" r="30" fill="#ffe08a" opacity="0.28" />

      <path
        d="M96 98 C70 78 38 70 22 86 C34 64 68 72 92 90 C64 96 40 112 28 132 C52 116 78 106 98 104 Z"
        fill={`url(#${wing})`}
        stroke="#fff6e8"
        strokeWidth="1.6"
      />
      <path
        d="M104 98 C130 78 162 70 178 86 C166 64 132 72 108 90 C136 96 160 112 172 132 C148 116 122 106 102 104 Z"
        fill={`url(#${wing})`}
        stroke="#fff6e8"
        strokeWidth="1.6"
      />

      <ellipse cx="48" cy="150" rx="34" ry="13" fill="#6faf6a" />
      <ellipse cx="100" cy="156" rx="42" ry="12" fill="#8fc98a" />
      <ellipse cx="150" cy="150" rx="32" ry="12" fill="#6faf6a" />

      <g filter={`url(#${glow})`}>
        <path
          d="M100 54 L107 78 L132 78 L112 93 L120 117 L100 102 L80 117 L88 93 L68 78 L93 78 Z"
          fill={`url(#${star})`}
          stroke="#fffef6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      <circle cx="100" cy="100" r="82" fill="none" stroke={`url(#${gold})`} strokeWidth="7" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="#fff6e8" strokeWidth="1.6" opacity="0.7" />
      <circle cx="100" cy="18" r="5" fill={`url(#${gold})`} />
      <circle cx="100" cy="182" r="5" fill={`url(#${gold})`} />
      <circle cx="18" cy="100" r="4" fill="#ffe08a" />
      <circle cx="182" cy="100" r="4" fill="#ffe08a" />
    </svg>
  );
}
