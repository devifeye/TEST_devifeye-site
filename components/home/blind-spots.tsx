import Link from 'next/link'
import { ArrowRight, EyeOff, KeyRound, Rows3, SquareFunction } from 'lucide-react'

const neverSeen = [
  { icon: Rows3, title: 'Table rows', body: 'We read structure from pg_catalog and information_schema. Never your data.' },
  { icon: KeyRound, title: 'Secrets', body: 'Env vars and secret values are off on every plan. You cannot turn them on.' },
  { icon: SquareFunction, title: 'Edge function code', body: 'Your function source stays yours. We never pull or store it.' },
]

export function BlindSpots() {
  return (
    <section aria-labelledby="blind-title" className="border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-5">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <EyeOff className="size-4" aria-hidden="true" />
            What the eye never sees
          </p>
          <h2 id="blind-title" className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            We watch the shape of your stack. Never what&apos;s inside it.
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            We only read metadata, and we drew that line on purpose. No PII, no credentials, no source code,
            which makes it easy to say yes to us in a security review.
          </p>
          <Link href="/security" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Read our security model
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="flex flex-col gap-4">
          {neverSeen.map((item) => (
            <li key={item.title} className="flex gap-4 rounded-xl border border-border bg-background p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <item.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium">
                  <span className="line-through decoration-destructive decoration-2">{item.title}</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
