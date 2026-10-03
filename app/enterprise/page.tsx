import type { Metadata } from 'next'
import { Building2, RotateCcw, ClipboardCheck, Plug, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { WatchingEye } from '@/components/site/watching-eye'
import { EnquiryForm } from '@/components/enterprise/enquiry-form'
import { linkButton } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Enterprise',
  description: 'Private VPC deployments, automated remediation, compliance audit engines and custom connectors for Devifeye.',
}

const offerings = [
  {
    icon: Building2,
    title: 'Private VPC & on-prem',
    body: 'Run the full Devifeye stack (API, dashboard and runners) inside your own AWS, GCP or Kubernetes cluster. None of your data goes to shared infrastructure.',
  },
  {
    icon: RotateCcw,
    title: 'Self-healing remediation',
    body: 'Go beyond alerts. Custom pipelines can revert unauthorized changes, re-apply migrations or open fix PRs with the missing SQL.',
  },
  {
    icon: ClipboardCheck,
    title: 'SOC 2 & HIPAA audit trails',
    body: 'Immutable logs that show which approved changes happened each quarter, and that nothing else did. Ready to export for your auditors.',
  },
  {
    icon: Plug,
    title: 'Custom connectors',
    body: 'Internal Postgres forks, legacy databases, in-house orchestration. We build and maintain agent modules for your stack.',
  },
]

const process = [
  { step: 'Scope', body: 'A call to map your environments, compliance needs and the drift that has bitten you before.' },
  { step: 'Build', body: 'We deploy into your infrastructure and build the connectors and remediation flows you need.' },
  { step: 'Watch', body: 'An annual license with an SLA, updates and a direct line to the people who built it.' },
]

export default function EnterprisePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-12 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading
              as="h1"
              eyebrow="Enterprise"
              title="Your own eye, in your own cloud."
              description="It's the same Devifeye engine, deployed inside your infrastructure and built around your stack, your compliance rules and your rollback process."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#offerings" className={linkButton.outline}>
                What&apos;s included
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Custom solutions typically range from high four to mid five figures.
            </p>
            <WatchingEye className="hidden w-full max-w-sm lg:block" />
          </div>
          <div id="enquiry" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 sm:p-8">
            <div className="mb-6 flex flex-col gap-1">
              <p className="font-mono text-xs uppercase tracking-wider text-primary">Enterprise enquiry</p>
              <h2 className="text-2xl font-semibold tracking-tight">Tell us what you need watched.</h2>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </section>

      <section id="offerings" aria-labelledby="offerings-title" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="offerings-title" className="sr-only">
            Enterprise offerings
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {offerings.map((item) => (
              <article key={item.title} className="flex gap-5 rounded-xl border border-border bg-card p-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading id="process-title" eyebrow="Engagement" title="How we work together." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {process.map((item, i) => (
              <li key={item.step} className="flex flex-col gap-3 bg-background p-6">
                <span className="font-mono text-xs text-primary">{`0${i + 1}`}</span>
                <h3 className="text-lg font-semibold">{item.step}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-xl border border-primary/40 bg-primary/5 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Let&apos;s look at your stack.</h3>
              <p className="mt-1 text-sm text-muted-foreground">Fill in the enquiry form and we will reply within one business day.</p>
            </div>
            <a href="#enquiry" className={linkButton.primary}>
              Start the conversation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
