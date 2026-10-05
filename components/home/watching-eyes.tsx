'use client'

import { useEffect, useState } from 'react'
import { WatchingEye } from '@/components/site/watching-eye'

const TEST_CODE = [
  'const target = "supabase"',
  'schema.users.columns += "verified"',
  'policy.users_read = "authenticated"',
  'config.cache_ttl = 300',
  'deploy.commit = "8fa2c1"',
  'migration.status = "clean"',
]

const LIVE_CODE = [
  'const target = "supabase"',
  'schema.users.columns += "verified"',
  'policy.users_read = "anon"',
  'config.cache_ttl = 300',
  'deploy.commit = "8fa2c1"',
  'migration.status = "clean"',
]

const MISMATCH_LINE = 2

function totalLength(lines: string[]) {
  return lines.reduce((total, line) => total + line.length, 0)
}

function getTypedLines(lines: string[], progress: number) {
  let remaining = progress

  return lines.map((line) => {
    const visible = line.slice(0, remaining)
    remaining = Math.max(0, remaining - line.length)
    return visible
  })
}

function getTypingLine(lines: string[], progress: number) {
  let remaining = progress

  for (let index = 0; index < lines.length; index += 1) {
    if (remaining < lines[index].length) return index
    remaining -= lines[index].length
  }

  return lines.length - 1
}

function BrainGraphic() {
  return (
    <div className="relative z-20 mx-auto w-44 md:w-52">
      <svg
        viewBox="0 0 220 100"
        role="img"
        aria-label="Drift analysis brain receiving environment observations"
        className="w-full overflow-visible"
      >
        <defs>
          <filter id="brain-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M108 80C91 92 66 88 53 77 39 66 37 48 45 36 33 27 37 12 50 8c7-2 14-1 20 3C77 0 92 2 101 12c9-10 24-12 31-1 6-4 13-5 20-3 13 4 17 19 5 28 8 12 6 30-8 41-13 11-38 15-41 3Z"
          fill="oklch(0.14 0.02 265 / 0.88)"
          stroke="var(--primary)"
          strokeWidth="1.5"
          filter="url(#brain-glow)"
        />

        <path
          d="M110 13C107 25 109 36 110 48s-1 24-4 32M69 20c9 5 14 12 15 22M151 20c-9 5-14 12-15 22M51 43c9-2 17 1 23 7M169 43c-9-2-17 1-23 7M65 68c8-4 16-3 22 3M155 68c-8-4-16-3-22 3"
          fill="none"
          stroke="var(--primary)"
          strokeOpacity=".45"
          strokeWidth="1"
          strokeLinecap="round"
        />

        <circle cx="81" cy="36" r="2.5" fill="var(--primary)" />
        <circle cx="139" cy="36" r="2.5" fill="var(--primary)" />
        <circle cx="70" cy="54" r="1.8" fill="var(--primary)" />
        <circle cx="150" cy="54" r="1.8" fill="var(--primary)" />
        <circle cx="104" cy="68" r="2" fill="var(--primary)" />
        <circle cx="116" cy="68" r="2" fill="var(--primary)" />

        <text
          x="110"
          y="98"
          textAnchor="middle"
          fill="currentColor"
          opacity=".55"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          DRIFT ENGINE
        </text>
      </svg>
    </div>
  )
}

type EnvironmentPanelProps = {
  name: 'TEST ENVIRONMENT' | 'LIVE ENVIRONMENT'
  lines: string[]
  progress: number
  mismatchVisible: boolean
  shake: boolean
  align: 'left' | 'right'
}

function EnvironmentPanel({
  name,
  lines,
  progress,
  mismatchVisible,
  shake,
  align,
}: EnvironmentPanelProps) {
  const typedLines = getTypedLines(lines, progress)
  const typingLine = getTypingLine(lines, progress)

  return (
    <section
      aria-label={name}
      className={`relative overflow-hidden rounded-2xl border border-border/70 bg-card/35 p-4 backdrop-blur-sm md:p-5 ${
        shake ? 'eye-shake' : ''
      }`}
    >
      <div
        className={`mb-3 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground ${
          align === 'right' ? 'md:flex-row-reverse' : ''
        }`}
      >
        <span className="text-foreground/80">{name}</span>

        <span className="inline-flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${
              mismatchVisible ? 'bg-destructive' : 'bg-success'
            }`}
            aria-hidden="true"
          />
          {mismatchVisible ? 'DRIFT DETECTED' : 'WATCHING'}
        </span>
      </div>

      <div className="relative h-[330px] overflow-hidden rounded-xl border border-border/50 bg-background/30">
        <div className="pointer-events-none absolute inset-x-0 top-8 z-20 px-3">
          <div className="space-y-1 font-mono text-[9px] leading-4 md:text-[10px]">
            {typedLines.map((line, index) => {
              const isMismatch = mismatchVisible && index === MISMATCH_LINE
              const isTyping = !mismatchVisible && index === typingLine

              return (
                <div
                  key={`${name}-${index}`}
                  className={`relative flex min-w-0 items-start gap-2 rounded px-1.5 py-0.5 ${
                    isMismatch
                      ? 'bg-destructive/10 text-destructive'
                      : 'text-foreground/55'
                  }`}
                >
                  <span className="w-3 shrink-0 text-right text-muted-foreground/40">
                    {index + 1}
                  </span>

                  <span className="min-w-0 whitespace-nowrap">
                    {line || '\u00a0'}
                    {isTyping ? (
                      <span className="ml-0.5 text-primary animate-pulse">▌</span>
                    ) : null}
                  </span>

                  {isMismatch ? (
                    <>
                      <span className="absolute inset-x-1 top-1/2 h-px bg-destructive/90" />
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-semibold">
                        ×
                      </span>
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-background/20 to-transparent"
        />

        <div className="absolute inset-x-4 bottom-1 z-0">
          <WatchingEye className="w-full drop-shadow-[0_0_34px_oklch(0.83_0.15_78/0.16)]" />
        </div>

        {mismatchVisible ? (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded border border-destructive/40 bg-destructive/10 px-2 py-1 font-mono text-[9px] tracking-wider text-destructive">
            OUT-OF-BAND CHANGE
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[9px] tracking-[0.12em] text-muted-foreground/60">
        <span>OBS-{name.startsWith('TEST') ? '01' : '02'}</span>
        <span>METADATA ONLY</span>
        <span>{mismatchVisible ? 'DRIFT 1' : 'DRIFT 0'}</span>
      </div>
    </section>
  )
}

export function WatchingEyes() {
  const [progress, setProgress] = useState(0)
  const [shake, setShake] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const maxProgress = Math.max(totalLength(TEST_CODE), totalLength(LIVE_CODE))

  const mismatchThreshold = Math.max(
    TEST_CODE.slice(0, MISMATCH_LINE + 1).reduce(
      (total, line) => total + line.length,
      0,
    ),
    LIVE_CODE.slice(0, MISMATCH_LINE + 1).reduce(
      (total, line) => total + line.length,
      0,
    ),
  )

  const mismatchVisible =
    reduceMotion || progress >= mismatchThreshold

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMotionPreference = () => {
      setReduceMotion(media.matches)
    }

    updateMotionPreference()
    media.addEventListener('change', updateMotionPreference)

    return () => {
      media.removeEventListener('change', updateMotionPreference)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setProgress(maxProgress)
      return
    }

    const interval = window.setInterval(() => {
      setProgress((current) => (current >= maxProgress ? 0 : current + 1))
    }, 34)

    return () => {
      window.clearInterval(interval)
    }
  }, [maxProgress, reduceMotion])

  useEffect(() => {
    if (reduceMotion || progress < mismatchThreshold) return

    setShake(true)

    const timeout = window.setTimeout(() => {
      setShake(false)
    }, 460)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [mismatchThreshold, progress, reduceMotion])

  return (
    <>
      <style jsx>{`
        @keyframes eye-shake {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          20% {
            transform: translate3d(-4px, 0, 0);
          }
          40% {
            transform: translate3d(4px, 0, 0);
          }
          60% {
            transform: translate3d(-3px, 0, 0);
          }
          80% {
            transform: translate3d(3px, 0, 0);
          }
        }

        .eye-shake {
          animation: eye-shake 460ms ease-in-out;
        }
      `}</style>

      <div className="relative mx-auto mt-12 w-full max-w-5xl md:mt-16">
        <div className="relative px-1 pb-4 pt-2 md:px-4 md:pb-8 md:pt-4">
          <BrainGraphic />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-16 hidden h-[410px] md:block"
          >
            <svg
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <filter id="pipeline-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M250 430 C285 300 360 155 450 35"
                fill="none"
                stroke="var(--primary)"
                strokeOpacity=".18"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#pipeline-glow)"
              />

              <path
                d="M250 430 C285 300 360 155 450 35"
                fill="none"
                stroke="var(--primary)"
                strokeOpacity=".48"
                strokeWidth="1.5"
                strokeDasharray="4 8"
              />

              <path
                d="M750 430 C715 300 640 155 550 35"
                fill="none"
                stroke="var(--primary)"
                strokeOpacity=".18"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#pipeline-glow)"
              />

              <path
                d="M750 430 C715 300 640 155 550 35"
                fill="none"
                stroke="var(--primary)"
                strokeOpacity=".48"
                strokeWidth="1.5"
                strokeDasharray="4 8"
              />

              {!reduceMotion ? (
                <>
                  <circle r="4" fill="var(--primary)" filter="url(#pipeline-glow)">
                    <animateMotion
                      dur="2.8s"
                      begin="0s"
                      repeatCount="indefinite"
                      path="M250 430 C285 300 360 155 450 35"
                    />
                  </circle>

                  <circle r="2.5" fill="white">
                    <animateMotion
                      dur="2.8s"
                      begin=".9s"
                      repeatCount="indefinite"
                      path="M250 430 C285 300 360 155 450 35"
                    />
                  </circle>

                  <circle r="3" fill="var(--primary)" filter="url(#pipeline-glow)">
                    <animateMotion
                      dur="2.8s"
                      begin="1.7s"
                      repeatCount="indefinite"
                      path="M250 430 C285 300 360 155 450 35"
                    />
                  </circle>

                  <circle r="4" fill="var(--primary)" filter="url(#pipeline-glow)">
                    <animateMotion
                      dur="2.8s"
                      begin=".4s"
                      repeatCount="indefinite"
                      path="M750 430 C715 300 640 155 550 35"
                    />
                  </circle>

                  <circle r="2.5" fill="white">
                    <animateMotion
                      dur="2.8s"
                      begin="1.2s"
                      repeatCount="indefinite"
                      path="M750 430 C715 300 640 155 550 35"
                    />
                  </circle>

                  <circle r="3" fill="var(--primary)" filter="url(#pipeline-glow)">
                    <animateMotion
                      dur="2.8s"
                      begin="2s"
                      repeatCount="indefinite"
                      path="M750 430 C715 300 640 155 550 35"
                    />
                  </circle>
                </>
              ) : null}
            </svg>
          </div>

          <div className="relative mt-8 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-7">
            <EnvironmentPanel
              name="TEST ENVIRONMENT"
              lines={TEST_CODE}
              progress={reduceMotion ? maxProgress : progress}
              mismatchVisible={mismatchVisible}
              shake={shake}
              align="left"
            />

            <EnvironmentPanel
              name="LIVE ENVIRONMENT"
              lines={LIVE_CODE}
              progress={reduceMotion ? maxProgress : progress}
              mismatchVisible={mismatchVisible}
              shake={shake}
              align="right"
            />
          </div>
        </div>
      </div>
    </>
  )
}
