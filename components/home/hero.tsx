import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SyncCore } from '@/components/site/sync-core'
import { APP_URL, linkButton } from '@/lib/site'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 md:pb-28 md:pt-24">
        <div className="relative w-full max-w-md">
          <div
            aria-hidden="true"
            className="animate-pulse-ring absolute inset-x-10 inset-y-0 rounded-full border border-primary/30"
          />
          <SyncCore className="relative w-full drop-shadow-[0_0_40px_oklch(0.83_0.15_78/0.18)]" />
        </div>

        <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          dev · if · eye — always watching
        </p>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          We watch for drift,
          <br />
          <span className="text-primary">so you don&apos;t have to.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Devifeye keeps an eye on your TEST and LIVE environments across Supabase, GitHub and your VPS
          servers. The moment someone tweaks a table, policy or config out-of-band, you hear about it before
          production does.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={`${APP_URL}/signup`} className={linkButton.primary}>
            Start watching for free
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <Link href="/#how" className={linkButton.outline}>
            See how it works
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Metadata only. We never read your rows, secrets or edge function code.
        </p>
      </div>
    </section>
  )
}
