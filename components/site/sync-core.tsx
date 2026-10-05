'use client'

export function SyncCore({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      role="img"
      aria-label="TEST and LIVE pipelines feeding a central sync core. Mismatches are detected and forced into alignment."
      className={className}
    >
      <defs>
        <linearGradient id="pipe-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.45 0.08 250 / 0.4)" />
          <stop offset="100%" stopColor="oklch(0.75 0.14 78 / 0.9)" />
        </linearGradient>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.9 0.12 78)" />
          <stop offset="60%" stopColor="oklch(0.7 0.15 70)" />
          <stop offset="100%" stopColor="oklch(0.4 0.1 55 / 0)" />
        </radialGradient>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* background frame labels */}
      <g className="fill-muted-foreground font-mono" fontSize="9" letterSpacing="1">
        <text x="12" y="14">OBS-01 · TEST ↔ LIVE</text>
        <text x="388" y="14" textAnchor="end">DRIFT 0</text>
        <text x="12" y="212">SYNC ACTIVE</text>
        <circle cx="320" cy="208" r="3" className="animate-pulse fill-success" />
        <text x="388" y="212" textAnchor="end">WATCHING</text>
      </g>

      {/* pipelines */}
      <path
        d="M80 175 C80 120, 160 90, 200 70"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-80"
      />
      <path
        d="M320 175 C320 120, 240 90, 200 70"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-80"
      />

      {/* flowing particles – left pipe */}
      <circle r="2.5" fill="oklch(0.85 0.14 78)" filter="url(#soft-glow)">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M80 175 C80 120, 160 90, 200 70" />
      </circle>
      <circle r="2" fill="oklch(0.9 0.1 85 / 0.7)" filter="url(#soft-glow)">
        <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M80 175 C80 120, 160 90, 200 70" />
      </circle>
      <circle r="1.8" fill="oklch(0.8 0.12 70 / 0.6)">
        <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path="M80 175 C80 120, 160 90, 200 70" />
      </circle>

      {/* flowing particles – right pipe */}
      <circle r="2.5" fill="oklch(0.85 0.14 78)" filter="url(#soft-glow)">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M320 175 C320 120, 240 90, 200 70" />
      </circle>
      <circle r="2" fill="oklch(0.9 0.1 85 / 0.7)" filter="url(#soft-glow)">
        <animateMotion dur="2.6s" begin="0.9s" repeatCount="indefinite" path="M320 175 C320 120, 240 90, 200 70" />
      </circle>
      <circle r="1.8" fill="oklch(0.8 0.12 70 / 0.6)">
        <animateMotion dur="2.6s" begin="1.7s" repeatCount="indefinite" path="M320 175 C320 120, 240 90, 200 70" />
      </circle>

      {/* TEST node */}
      <g>
        <rect x="48" y="165" width="64" height="28" rx="6" className="fill-card stroke-border" strokeWidth="1.5" />
        <text x="80" y="183" textAnchor="middle" className="fill-foreground font-mono" fontSize="11" fontWeight="600">
          TEST
        </text>
        {/* occasional mismatch pulse */}
        <rect x="48" y="165" width="64" height="28" rx="6" fill="oklch(0.7 0.18 30 / 0)" stroke="oklch(0.75 0.18 35)" strokeWidth="1.5">
          <animate attributeName="fill" values="oklch(0.7 0.18 30 / 0);oklch(0.7 0.18 30 / 0.25);oklch(0.7 0.18 30 / 0)" dur="8s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0;1;0" dur="8s" begin="1s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* LIVE node */}
      <g>
        <rect x="288" y="165" width="64" height="28" rx="6" className="fill-card stroke-border" strokeWidth="1.5" />
        <text x="320" y="183" textAnchor="middle" className="fill-foreground font-mono" fontSize="11" fontWeight="600">
          LIVE
        </text>
        <rect x="288" y="165" width="64" height="28" rx="6" fill="oklch(0.7 0.18 30 / 0)" stroke="oklch(0.75 0.18 35)" strokeWidth="1.5">
          <animate attributeName="fill" values="oklch(0.7 0.18 30 / 0);oklch(0.7 0.18 30 / 0.25);oklch(0.7 0.18 30 / 0)" dur="8s" begin="5s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0;1;0" dur="8s" begin="5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* zap lines from core → env (appear during mismatch windows) */}
      <path
        d="M200 70 L80 175"
        fill="none"
        stroke="oklch(0.85 0.16 78)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0"
        filter="url(#soft-glow)"
      >
        <animate attributeName="opacity" values="0;0;0.9;0.9;0" keyTimes="0;0.12;0.15;0.22;0.28" dur="8s" begin="1s" repeatCount="indefinite" />
      </path>
      <path
        d="M200 70 L320 175"
        fill="none"
        stroke="oklch(0.85 0.16 78)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0"
        filter="url(#soft-glow)"
      >
        <animate attributeName="opacity" values="0;0;0.9;0.9;0" keyTimes="0;0.12;0.15;0.22;0.28" dur="8s" begin="5s" repeatCount="indefinite" />
      </path>

      {/* central core */}
      <circle cx="200" cy="58" r="28" fill="url(#core-glow)" opacity="0.7">
        <animate attributeName="r" values="26;30;26" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="58" r="18" className="fill-card stroke-primary" strokeWidth="2" />
      <circle cx="200" cy="58" r="10" fill="oklch(0.82 0.14 78)" filter="url(#soft-glow)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* inner ring */}
      <circle cx="200" cy="58" r="14" fill="none" stroke="oklch(0.9 0.1 85 / 0.5)" strokeWidth="1" strokeDasharray="3 4">
        <animateTransform attributeName="transform" type="rotate" from="0 200 58" to="360 200 58" dur="12s" repeatCount="indefinite" />
      </circle>

      {/* core label */}
      <text x="200" y="62" textAnchor="middle" className="fill-foreground font-mono" fontSize="8" fontWeight="600">
        CORE
      </text>
    </svg>
  )
}
