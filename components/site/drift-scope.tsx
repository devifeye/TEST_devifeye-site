'use client'

import { useEffect, useRef } from 'react'

/*
 * DriftScope — a radar-style comparator for TEST vs LIVE.
 * Inner ring = TEST (source of truth), outer ring = LIVE. Each spoke is a watched resource.
 * Periodically one LIVE node slips out of alignment; the sweep catches it, flags it,
 * an alert goes out, and it re-syncs. Click to inject a drift on demand.
 * All animation is direct DOM mutation inside one rAF loop (no React re-renders),
 * paused while off-screen and disabled entirely under prefers-reduced-motion.
 */

const CX = 200
const CY = 100
const R_TEST = 44
const R_LIVE = 64
const R_ORBIT = 73
const R_SWEEP = 78
const R_BEZEL = 86
const SWEEP_DEG_PER_MS = 360 / 4200
const SWEEP_BOOST = 3
const DRIFT_DEG = 17
const STATIC_SWEEP_DEG = -40

const RESOURCES = ['TABLES', 'RLS', 'FUNCTIONS', 'INDEXES', 'MIGRATIONS', 'NGINX'] as const

type Phase = 'idle' | 'drifting' | 'detected' | 'alerted' | 'resolving'

const round = (n: number) => Number(n.toFixed(2))
const toRad = (deg: number) => (deg * Math.PI) / 180
const clamp = (n: number) => Math.max(-1, Math.min(1, n))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

function polar(r: number, deg: number): [number, number] {
  return [round(CX + Math.cos(toRad(deg)) * r), round(CY + Math.sin(toRad(deg)) * r)]
}

function sector(r: number, from: number, to: number) {
  const [x1, y1] = polar(r, from)
  const [x2, y2] = polar(r, to)
  return `M${CX} ${CY}L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z`
}

const nodes = RESOURCES.map((name, i) => {
  const angle = -90 + i * 60
  const [tx, ty] = polar(R_TEST, angle)
  const [lx, ly] = polar(R_LIVE, angle)
  return { name, angle, tx, ty, lx, ly }
})

const bezelTicks = Array.from({ length: 72 }, (_, i) => {
  const major = i % 6 === 0
  const [x1, y1] = polar(R_BEZEL - (major ? 4 : 1.5), i * 5)
  const [x2, y2] = polar(R_BEZEL + (major ? 4 : 1.5), i * 5)
  return { x1, y1, x2, y2, major }
})

// Stacked translucent wedges fake a fading radar trail without gradients or filters.
const sweepTrail = Array.from({ length: 6 }, (_, i) => sector(R_SWEEP, -36 + i * 6, 0))
const [SWEEP_TIP_X, SWEEP_TIP_Y] = polar(R_SWEEP, 0)

// Circuit traces feeding each environment into the comparator. Drawn outside-in so the
// dash animation always flows toward the centre.
const traces = [-1, 0, 1].flatMap((k) => {
  const y = CY + k * 34
  const [lx, ly] = polar(R_BEZEL + 6, 180 - k * 16)
  const [rx, ry] = polar(R_BEZEL + 6, k * 16)
  return [
    { side: 'test' as const, d: `M6 ${y}H62L${lx} ${ly}` },
    { side: 'live' as const, d: `M394 ${y}H338L${rx} ${ry}` },
  ]
})

const frameCorners = ['M-12 -16v-12h12', 'M412 -16v-12h-12', 'M-12 204v12h12', 'M412 204v12h-12']

const CLS = {
  connectorSync: 'stroke-success/45',
  connectorDrift: 'stroke-destructive',
  liveSync: 'fill-primary stroke-background',
  liveDrift: 'fill-destructive stroke-background',
  glyphSync: 'fill-success font-mono',
  glyphDrift: 'fill-destructive font-mono',
  glyphResync: 'fill-primary font-mono',
  statusMuted: 'fill-muted-foreground',
  statusDrift: 'fill-destructive',
  statusResync: 'fill-primary',
}

export function DriftScope({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rigRef = useRef<SVGGElement>(null)
  const bezelRef = useRef<SVGGElement>(null)
  const sweepRef = useRef<SVGGElement>(null)
  const liveRefs = useRef<(SVGCircleElement | null)[]>([])
  const connectorRefs = useRef<(SVGLineElement | null)[]>([])
  const ghostRef = useRef<SVGCircleElement>(null)
  const pingRef = useRef<SVGCircleElement>(null)
  const corePingRef = useRef<SVGCircleElement>(null)
  const glyphRef = useRef<SVGTextElement>(null)
  const stateRef = useRef<SVGTextElement>(null)
  const statusRef = useRef<SVGTextElement>(null)
  const readoutRef = useRef<SVGTSpanElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = 0
    let clock = 0
    let sweep = STATIC_SWEEP_DEG
    let lastReadout = -1
    let boostUntil = 0
    let targetX = 0
    let targetY = 0
    let smoothX = 0
    let smoothY = 0

    let phase: Phase = 'idle'
    let phaseAt = 0
    let nextDriftAt = 2400
    let active = -1
    let lastActive = -1
    let dir = 1
    let offset = 0

    const replay = (el: SVGElement | null) => {
      if (!el) return
      el.classList.remove('animate-ping-once')
      void el.getBoundingClientRect()
      el.classList.add('animate-ping-once')
    }

    const placeLive = (i: number, deg: number) => {
      const [x, y] = polar(R_LIVE, nodes[i].angle + deg)
      const live = liveRefs.current[i]
      const connector = connectorRefs.current[i]
      live?.setAttribute('cx', String(x))
      live?.setAttribute('cy', String(y))
      connector?.setAttribute('x2', String(x))
      connector?.setAttribute('y2', String(y))
      return [x, y] as const
    }

    const paint = () => {
      const node = active >= 0 ? nodes[active] : null
      const live = active >= 0 ? liveRefs.current[active] : null
      const connector = active >= 0 ? connectorRefs.current[active] : null
      const flagged = phase === 'detected' || phase === 'alerted'
      const set = (el: SVGElement | null, text: string, cls: string) => {
        if (!el) return
        el.textContent = text
        el.setAttribute('class', cls)
      }

      if (flagged && node) {
        set(glyphRef.current, '≠', CLS.glyphDrift)
        set(stateRef.current, phase === 'detected' ? 'DRIFT FOUND' : 'ALERT SENT', `font-mono ${CLS.statusDrift}`)
        set(statusRef.current, `DRIFT 1 · ${node.name}`, CLS.statusDrift)
      } else if (phase === 'resolving' && node) {
        set(glyphRef.current, '≈', CLS.glyphResync)
        set(stateRef.current, 'RESYNCING', `font-mono ${CLS.statusResync}`)
        set(statusRef.current, `RESOLVING · ${node.name}`, CLS.statusResync)
      } else {
        set(glyphRef.current, '=', CLS.glyphSync)
        set(stateRef.current, 'IN SYNC', `font-mono ${CLS.statusMuted}`)
        set(statusRef.current, 'DRIFT 0', CLS.statusMuted)
      }

      live?.setAttribute('class', flagged ? CLS.liveDrift : CLS.liveSync)
      connector?.setAttribute('class', flagged ? CLS.connectorDrift : CLS.connectorSync)
      connector?.setAttribute('stroke-dasharray', flagged ? '2 2' : 'none')

      const ghost = ghostRef.current
      if (ghost && node) {
        ghost.setAttribute('cx', String(node.lx))
        ghost.setAttribute('cy', String(node.ly))
      }
      ghost?.setAttribute('opacity', flagged || phase === 'resolving' ? '1' : '0')
    }

    const setPhase = (next: Phase) => {
      phase = next
      phaseAt = clock
      paint()
    }

    const crossed = (target: number, from: number, delta: number) => {
      const gap = (((target - from) % 360) + 360) % 360
      return gap > 0 && gap <= delta
    }

    const tick = (ts: number) => {
      const dt = last ? Math.min(ts - last, 50) : 16
      last = ts
      clock += dt

      // Sweep
      const delta = dt * SWEEP_DEG_PER_MS * (clock < boostUntil ? SWEEP_BOOST : 1)
      const from = sweep
      sweep = (sweep + delta) % 360
      sweepRef.current?.setAttribute('transform', `rotate(${round(sweep)} ${CX} ${CY})`)
      const heading = Math.round(((sweep % 360) + 360) % 360)
      if (heading !== lastReadout && readoutRef.current) {
        lastReadout = heading
        readoutRef.current.textContent = `SCAN ${String(heading).padStart(3, '0')}°`
      }

      // Pointer parallax: the rig shifts a little, the bezel turns like a dial.
      const k = Math.min(1, dt / 140)
      smoothX += (targetX - smoothX) * k
      smoothY += (targetY - smoothY) * k
      rigRef.current?.setAttribute('transform', `translate(${round(smoothX * 6)} ${round(smoothY * 4)})`)
      bezelRef.current?.setAttribute('transform', `rotate(${round(smoothX * 24)} ${CX} ${CY})`)

      // Drift lifecycle
      const elapsed = clock - phaseAt
      if (phase === 'idle' && clock >= nextDriftAt) {
        do active = Math.floor(Math.random() * nodes.length)
        while (active === lastActive)
        dir = Math.random() < 0.5 ? -1 : 1
        setPhase('drifting')
      } else if (phase === 'drifting') {
        offset = ease(Math.min(1, elapsed / 1400)) * DRIFT_DEG * dir
        const [x, y] = placeLive(active, offset)
        if (Math.abs(offset) > DRIFT_DEG * 0.35 && crossed(nodes[active].angle + offset, from, delta)) {
          pingRef.current?.setAttribute('cx', String(x))
          pingRef.current?.setAttribute('cy', String(y))
          replay(pingRef.current)
          setPhase('detected')
        }
      } else if (phase === 'detected' && elapsed > 1700) {
        setPhase('alerted')
      } else if (phase === 'alerted' && elapsed > 1500) {
        setPhase('resolving')
      } else if (phase === 'resolving') {
        const p = Math.min(1, elapsed / 1000)
        placeLive(active, (1 - ease(p)) * DRIFT_DEG * dir)
        if (p >= 1) {
          offset = 0
          lastActive = active
          setPhase('idle')
          active = -1
          nextDriftAt = clock + 2600 + Math.random() * 3200
        }
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf) return
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      targetX = clamp((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2))
      targetY = clamp((event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2))
    }

    const onPress = () => {
      replay(corePingRef.current)
      boostUntil = clock + 1400
      if (phase === 'idle') nextDriftAt = Math.min(nextDriftAt, clock + 200)
    }

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    observer.observe(svg)
    window.addEventListener('pointermove', onMove, { passive: true })
    svg.addEventListener('pointerdown', onPress)

    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerdown', onPress)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="-24 -36 448 264"
      role="img"
      aria-label="A radar-style scanner comparing your TEST and LIVE environments and flagging anything that drifts out of sync. Click it to simulate a drift."
      className={className}
    >
      {/* HUD frame */}
      <g aria-hidden="true" className="fill-muted-foreground font-mono" fontSize="9" letterSpacing="1">
        {frameCorners.map((d) => (
          <path key={d} d={d} fill="none" className="stroke-muted-foreground/50" strokeWidth="1.5" />
        ))}
        <text x="6" y="-20">
          OBS-01 · TEST ↔ LIVE
        </text>
        <text ref={statusRef} x="394" y="-20" textAnchor="end">
          DRIFT 0
        </text>
        <text x="6" y="212">
          <tspan ref={readoutRef}>{`SCAN ${String(360 + STATIC_SWEEP_DEG).padStart(3, '0')}°`}</tspan>
        </text>
        <circle cx="326" cy="209" r="3" className="animate-rec fill-success" />
        <text x="394" y="212" textAnchor="end">
          WATCHING
        </text>
      </g>

      <g ref={rigRef} aria-hidden="true" className="cursor-pointer">
        {/* Environment feeds */}
        <g className="font-mono" fontSize="8" letterSpacing="1.5">
          <text x="6" y="56" className="fill-muted-foreground">
            TEST
          </text>
          <text x="394" y="56" textAnchor="end" className="fill-primary">
            LIVE
          </text>
        </g>
        <g fill="none" strokeWidth="1.2" strokeLinejoin="round">
          {traces.map((t) => (
            <path key={`base-${t.d}`} d={t.d} className={t.side === 'test' ? 'stroke-foreground/15' : 'stroke-primary/20'} />
          ))}
          {traces.map((t) => (
            <path
              key={`flow-${t.d}`}
              d={t.d}
              strokeLinecap="round"
              className={`animate-trace-flow ${t.side === 'test' ? 'stroke-foreground/60' : 'stroke-primary'}`}
            />
          ))}
        </g>

        {/* Dial bezel (turns with the cursor) */}
        <circle cx={CX} cy={CY} r={R_BEZEL + 9} className="fill-card/70 stroke-border" strokeWidth="1" />
        <g ref={bezelRef}>
          {bezelTicks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              className={i === 0 ? 'stroke-primary' : t.major ? 'stroke-foreground/50' : 'stroke-foreground/20'}
              strokeWidth={i === 0 ? 2 : t.major ? 1.2 : 0.8}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Radar sweep */}
        <g ref={sweepRef} transform={`rotate(${STATIC_SWEEP_DEG} ${CX} ${CY})`}>
          {sweepTrail.map((d) => (
            <path key={d} d={d} className="fill-primary" fillOpacity="0.035" />
          ))}
          <line x1={CX} y1={CY} x2={SWEEP_TIP_X} y2={SWEEP_TIP_Y} className="stroke-primary/80" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* Rings */}
        <circle cx={CX} cy={CY} r={R_TEST} fill="none" className="animate-spin-slow stroke-foreground/30" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={CX} cy={CY} r={R_LIVE} fill="none" className="stroke-primary/45" strokeWidth="1.4" />
        <circle
          cx={CX}
          cy={CY}
          r={R_ORBIT}
          fill="none"
          className="animate-spin-reverse stroke-primary/70"
          strokeWidth="1.4"
          strokeDasharray="22 437"
          strokeLinecap="round"
        />

        {/* Spokes: TEST node → LIVE node per watched resource */}
        {nodes.map((n, i) => (
          <line
            key={`c-${n.name}`}
            ref={(el) => {
              connectorRefs.current[i] = el
            }}
            x1={n.tx}
            y1={n.ty}
            x2={n.lx}
            y2={n.ly}
            className={CLS.connectorSync}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
        {nodes.map((n) => (
          <rect
            key={`t-${n.name}`}
            x={n.tx - 3}
            y={n.ty - 3}
            width="6"
            height="6"
            rx="1"
            transform={`rotate(45 ${n.tx} ${n.ty})`}
            className="fill-card stroke-foreground/70"
            strokeWidth="1.2"
          />
        ))}
        <circle ref={ghostRef} cx={CX} cy={CY - R_LIVE} r="6" fill="none" className="stroke-muted-foreground" strokeWidth="1" strokeDasharray="2 2" opacity="0" />
        {nodes.map((n, i) => (
          <circle
            key={`l-${n.name}`}
            ref={(el) => {
              liveRefs.current[i] = el
            }}
            cx={n.lx}
            cy={n.ly}
            r="4.5"
            className={CLS.liveSync}
            strokeWidth="1.5"
          />
        ))}
        <circle ref={pingRef} cx={CX} cy={CY} r="6" fill="none" className="stroke-destructive" strokeWidth="1.5" opacity="0" />

        {/* Core readout */}
        <circle ref={corePingRef} cx={CX} cy={CY} r="24" fill="none" className="stroke-primary" strokeWidth="1" opacity="0" />
        <circle cx={CX} cy={CY} r="24" className="fill-background stroke-border" strokeWidth="1" />
        <text ref={glyphRef} x={CX} y={CY + 5} textAnchor="middle" fontSize="20" className={CLS.glyphSync}>
          =
        </text>
        <text ref={stateRef} x={CX} y={CY + 15} textAnchor="middle" fontSize="5" letterSpacing="0.8" className={`font-mono ${CLS.statusMuted}`}>
          IN SYNC
        </text>
      </g>
    </svg>
  )
}
