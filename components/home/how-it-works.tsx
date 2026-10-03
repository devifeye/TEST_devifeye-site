import { SectionHeading } from '@/components/site/section-heading'
import { DriftDiff } from './drift-diff'

const steps = [
  {
    title: 'Connect TEST & LIVE',
    body: 'Add a read-only Supabase role, point us at your repo, and drop the agent on your VPS with one command.',
  },
  {
    title: 'The eye opens',
    body: 'Background checks run weekly, daily or hourly. We snapshot structure, normalize the SQL, and hash host configs.',
  },
  {
    title: 'Drift gets diffed',
    body: 'Intentional differences are ignored by rule. Real drift gets a clean, Git-style diff you can read in seconds.',
  },
  {
    title: 'You get the alert',
    body: 'Discord, Telegram, email, text or your own webhook. The alert lands where you already work.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title="Set it up once. We keep watching."
            description="Devifeye was built to catch drift in our own TEST and LIVE stacks. Now it watches yours."
          />
          <ol className="mt-10 flex flex-col gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <DriftDiff />
      </div>
    </section>
  )
}
