import Link from 'next/link'
import { EyeMark } from './logo'
import { APP_URL, linkButton } from '@/lib/site'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center md:px-16">
          <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <EyeMark className="size-12 text-foreground" />
            <h2 id="cta-title" className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Stop finding drift in production.
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              Connect one TEST and one LIVE project for free and get your first drift report this week.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={`${APP_URL}/signup`} className={linkButton.primary}>
                Start watching for free
              </a>
              <Link href="/pricing" className={linkButton.outline}>
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
