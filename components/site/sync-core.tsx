'use client'

import { useEffect, useRef, useState } from 'react'

const CX = 200
const CY = 70

// Pre-computed particle positions along the two pipelines
function makeParticles(side: 'left' | 'right', count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${side}-${i}`,
    delay: i * 0.55 + (side === 'right' ? 0.3 : 0),
    duration: 2.8 + (i % 3) * 0.4,
  }))
}

const leftParticles = makeParticles('left', 6)
const rightParticles = makeParticles('right', 6)

export function SyncCore({ className }: { className?: string }) {
  const [zap, setZap] = useState<'none' | 'left' | 'right' | 'both'>('none')
  const [drift, setDrift] = useState(0)
  const coreRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // Random mismatch events
    const interval = setInterval(() => {
      const r = Math.random()
      if (r < 0.35) {
        setZap(r < 0.12 ? 'both' : r < 0.23 ? 'left' : 'right')
        setDrift((d) => Math.min(d + 1, 9))
        setTimeout(() => {
          setZap('none')
          setDrift(0)
        }, 900)
      }
    }, 4200)

    return () => clearInterval(interval)
  }, [])

  return (
    <svg
      viewBox="-24 -20 448 240"
      role="img"
      aria-label="TEST and LIVE environments feeding data upward into a central sync core. Occasional mismatch zaps force both environments to update."
      className={className}
    >
      <defs>
        {/* Glow filters */}
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients */}
        <linearGradient id="pipe-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.55 0.12 250 / 0.5)" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 78 / 0.9)" />
        </linearGradient>
        <radialGradient id="core-grad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="oklch(0.92 0.12 85)" />
          <stop offset="55%" stopColor="oklch(0.72 0.16 70)" />
          <stop offset="100%" stopColor="oklch(0.42 0.1 55)" />
        </radialGradient>
        <linearGradient id="node-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.28 0.04 250)" />
          <stop offset="100%" stopColor="oklch(0.16 0.03 250)" />
        </linearGradient>
      </defs>

      {/* Frame labels – keep the monitoring aesthetic */}
      <g
        aria-hidden="true"
        className="fill-muted-foreground font-mono"
        fontSize="9"
        letterSpacing="1"
      >
        <text x="6" y="-6">
          OBS-01 · TEST ↔ LIVE
        </text>
        <text x="394" y="-6" textAnchor="end">
          DRIFT {drift}
        </text>
        <text x="6" y="214">
          SYNC CORE
        </text>
        <circle
          cx="326"
          cy="211"
          r="3"
          className={zap !== 'none' ? 'fill-warning animate-pulse' : 'fill-success animate-rec'}
        />
        <text x="394" y="214" textAnchor="end">
          {zap !== 'none' ? 'RESYNC' : 'WATCHING'}
        </text>
      </g>

      {/* ========== PIPELINES ========== */}
      {/* Left pipeline (TEST → core) */}
      <path
        d="M90 168 C 90 120, 140 110, 200 78"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Right pipeline (LIVE → core) */}
      <path
        d="M310 168 C 310 120, 260 110, 200 78"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Glow underlay for pipelines */}
      <path
        d="M90 168 C 90 120, 140 110, 200 78"
        fill="none"
        stroke="oklch(0.78 0.16 78 / 0.25)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#soft-glow)"
      />
      <path
        d="M310 168 C 310 120, 260 110, 200 78"
        fill="none"
        stroke="oklch(0.78 0.16 78 / 0.25)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#soft-glow)"
      />

      {/* ========== FLOWING PARTICLES ========== */}
      {leftParticles.map((p) => (
        <circle
          key={p.id}
          r="3.2"
          fill="oklch(0.9 0.14 85)"
          filter="url(#glow)"
          className="animate-flow-left"
          style={{
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <animateMotion
            dur={`${p.duration}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
            path="M90 168 C 90 120, 140 110, 200 78"
          />
        </circle>
      ))}
      {rightParticles.map((p) => (
        <circle
          key={p.id}
          r="3.2"
          fill="oklch(0.9 0.14 85)"
          filter="url(#glow)"
          className="animate-flow-right"
          style={{
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <animateMotion
            dur={`${p.duration}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
            path="M310 168 C 310 120, 260 110, 200 78"
          />
        </circle>
      ))}

      {/* ========== ENVIRONMENT NODES ========== */}
      {/* TEST node */}
      <g transform="translate(50, 155)">
        <rect
          x="0"
          y="0"
          width="80"
          height="36"
          rx="6"
          fill="url(#node-grad)"
          stroke={zap === 'left' || zap === 'both' ? 'oklch(0.85 0.18 85)' : 'oklch(0.45 0.08 250)'}
          strokeWidth={zap === 'left' || zap === 'both' ? 2.5 : 1.5}
          className={zap === 'left' || zap === 'both' ? 'animate-pulse' : ''}
        />
        <text
          x="40"
          y="15"
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize="8"
          letterSpacing="1"
        >
          TEST
        </text>
        <text
          x="40"
          y="28"
          textAnchor="middle"
          className="fill-foreground/80 font-mono"
          fontSize="9"
        >
          {zap === 'left' || zap === 'both' ? 'UPDATING…' : 'stable'}
        </text>
      </g>

      {/* LIVE node */}
      <g transform="translate(270, 155)">
        <rect
          x="0"
          y="0"
          width="80"
          height="36"
          rx="6"
          fill="url(#node-grad)"
          stroke={zap === 'right' || zap === 'both' ? 'oklch(0.85 0.18 85)' : 'oklch(0.45 0.08 250)'}
          strokeWidth={zap === 'right' || zap === 'both' ? 2.5 : 1.5}
          className={zap === 'right' || zap === 'both' ? 'animate-pulse' : ''}
        />
        <text
          x="40"
          y="15"
          textAnchor="middle"
          className="fill-muted-foreground font-mono"
          fontSize="8"
          letterSpacing="1"
        >
          LIVE
        </text>
        <text
          x="40"
          y="28"
          textAnchor="middle"
          className="fill-foreground/80 font-mono"
          fontSize="9"
        >
          {zap === 'right' || zap === 'both' ? 'UPDATING…' : 'stable'}
        </text>
      </g>

      {/* ========== CENTRAL CORE / BRAIN ========== */}
      <g ref={coreRef} filter="url(#glow)">
        {/* Outer rings */}
        <circle
          cx={CX}
          cy={CY}
          r="42"
          fill="none"
          stroke="oklch(0.78 0.14 78 / 0.35)"
          strokeWidth="1.5"
          className="animate-spin-slow"
        />
        <circle
          cx={CX}
          cy={CY}
          r="34"
          fill="none"
          stroke="oklch(0.85 0.12 85 / 0.5)"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="animate-spin-reverse"
        />

        {/* Core body */}
        <circle cx={CX} cy={CY} r="28" fill="url(#core-grad)" />
        <circle
          cx={CX}
          cy={CY}
          r="28"
          fill="none"
          stroke="oklch(0.95 0.1 90 / 0.6)"
          strokeWidth="1.5"
        />

        {/* Inner neural-ish pattern */}
        <g stroke="oklch(0.98 0.06 90 / 0.45)" strokeWidth="1.2" fill="none">
          <path d="M185 55 Q200 70 215 55" />
          <path d="M185 85 Q200 70 215 85" />
          <path d="M175 70 H225" />
          <circle cx="200" cy="70" r="4" fill="oklch(0.95 0.1 90)" />
        </g>

        {/* Pulse when zapping */}
        {zap !== 'none' && (
          <circle
            cx={CX}
            cy={CY}
            r="28"
            fill="oklch(0.9 0.18 85 / 0.35)"
            className="animate-ping"
          />
        )}
      </g>

      {/* ========== ZAP BOLTS ========== */}
      {(zap === 'left' || zap === 'both') && (
        <g stroke="oklch(0.92 0.18 85)" strokeWidth="2" fill="none" filter="url(#glow)">
          <path d="M90 168 L120 140 L105 125 L145 110 L130 95 L170 80" className="animate-zap" />
          <path d="M95 160 L115 145" opacity="0.6" />
        </g>
      )}
      {(zap === 'right' || zap === 'both') && (
        <g stroke="oklch(0.92 0.18 85)" strokeWidth="2" fill="none" filter="url(#glow)">
          <path d="M310 168 L280 140 L295 125 L255 110 L270 95 L230 80" className="animate-zap" />
          <path d="M305 160 L285 145" opacity="0.6" />
        </g>
      )}
    </svg>
  )
}
