import type { Metadata } from 'next'
import { Check, X, ShieldCheck, Lock, Hash, ArrowUpRight, UserX, FileSearch } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { FinalCta } from '@/components/site/final-cta'

export const metadata: Metadata = {
  title: 'Security',
  description: 'Devifeye reads metadata only. We never read, store or transmit table rows, secrets or edge function code.',
}

const reads = [
  'Tables, columns & data types',
  'Constraints & foreign keys',
  'RLS policy definitions',
  'Functions & triggers (signatures and definitions)',
  'Indexes',
  'Migration file names & checksums',
  'SHA-256 hashes of tracked VPS files',
  'Installed package versions',
]

const neverReads = [
  'Table rows or any user data',
  'Secrets & environment variable values',
  'Edge function source code',
  'Raw contents of VPS config files',
  'SSH keys or inbound access',
  'Supabase service-role keys',
]

const agentPoints = [
  { icon: ArrowUpRight, title: 'Outbound HTTPS only', body: 'The agent calls home. You never open an inbound port for us.' },
  { icon: UserX, title: 'Unprivileged user', body: 'It runs as a dedicated system user with read access to the paths you choose, and nothing else.' },
  { icon: Hash, title: 'Hashes, not files', body: 'We get SHA-256 hashes of tracked files, so we can tell when a file changed without seeing what is in it.' },
  { icon: FileSearch, title: 'Open and auditable', body: 'The agent is short enough to read in two minutes. You can see exactly what it collects.' },
]

export default function SecurityPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Security"
          title="An eye that knows where not to look."
          description="To catch drift, you have to look at production. We made sure we only ever see the shape of your stack, never its contents."
        />
      </section>

      <section id="boundary" aria-labelledby="boundary-title" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 id="boundary-title" className="sr-only">
          Data boundary
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-md bg-success/15 text-success">
                <Check className="size-4" aria-hidden="true" />
              </span>
              What we read
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {reads.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <X className="size-4" aria-hidden="true" />
              </span>
              What we never read
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {neverReads.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              These are hardcoded off on every plan. No setting, plan or support request can turn them on.
            </p>
          </div>
        </div>
      </section>

      <section id="agent" aria-labelledby="agent-sec-title" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            id="agent-sec-title"
            eyebrow="VPS agent"
            title="Small, open, and outbound."
            description="The agent only collects and reports. All diffing, history and alerting run on our side, so the agent has nothing worth tampering with."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agentPoints.map((point) => (
              <div key={point.title} className="rounded-xl border border-border bg-card p-5">
                <point.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-medium">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 overflow-x-auto rounded-xl border border-border bg-card p-6 font-mono text-xs leading-6 text-muted-foreground">
            <pre>
              <code>{`[ VPS agent ]  --HTTPS POST { hashes, packages } + API key-->  [ devifeye API ]
                                                                      |
                                                     valid key? active plan? quota?
                                                                      |
                                                   unchanged hash -> dropped, nothing stored
                                                   changed hash   -> diff, log, alert`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section aria-labelledby="practices-title" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:px-6 md:grid-cols-3">
          <h2 id="practices-title" className="sr-only">
            Security practices
          </h2>
          {[
            { icon: Lock, title: 'Read-only database roles', body: 'Connect Supabase with a role that can only read pg_catalog, information_schema and pg_policies.' },
            { icon: ShieldCheck, title: 'Encrypted in transit and at rest', body: 'All traffic uses TLS. Stored connection details and snapshots are encrypted.' },
            { icon: Hash, title: 'Minimal retention', body: 'We only store snapshots when something actually changed, and you can delete your history at any time.' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  )
}
