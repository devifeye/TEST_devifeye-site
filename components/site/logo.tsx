import { cn } from '@/lib/utils'

export function EyeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('size-6', className)}>
      <path
        d="M2 16C6.5 8.5 11 6 16 6s9.5 2.5 14 10c-4.5 7.5-9 10-14 10S6.5 23.5 2 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="5.5" className="fill-primary" />
      <circle cx="16" cy="16" r="2.2" className="fill-background" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <EyeMark />
      <span className="text-lg font-semibold tracking-tight">
        <span>dev</span>
        <span className="text-muted-foreground">if</span>
        <span className="text-primary">eye</span>
      </span>
    </span>
  )
}
