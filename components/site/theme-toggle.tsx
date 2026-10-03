'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring',
        className,
      )}
    >
      <Sun className="hidden size-4 light:block" aria-hidden="true" />
      <Moon className="size-4 light:hidden" aria-hidden="true" />
    </button>
  )
}
