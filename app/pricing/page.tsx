import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PricingPlans } from '@/components/pricing/pricing-plans'
import { ComparisonTable } from '@/components/pricing/comparison-table'
import { Faq } from '@/components/pricing/faq'
import { SectionHeading } from '@/components/site/section-heading'
import { FinalCta } from '@/components/site/final-cta'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free weekly drift checks, Pro daily checks with a VPS agent for $10/mo, or Agency hourly checks for 3 to 25 projects from $15/mo.',
}

export default function PricingPage() {
  return (
    <>
      <section id="plans" className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-16 sm:px-6 md:pt-24">
        <SectionHeading
          as="h1"
          align="center"
          eyebrow="Pricing"
          title="Simple plans. Constant watch."
          description="Every plan is metadata-only and includes Discord and Telegram alerts. You pay for how often we check and how many stacks we watch."
        />
        <PricingPlans />
      </section>

      <section aria-labelledby="compare-title" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 id="compare-title" className="mb-6 text-2xl font-semibold tracking-tight">
          Compare plans
        </h2>
        <ComparisonTable />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Enterprise</p>
            <h2 className="mt-2 text-xl font-semibold">Need it inside your own VPC?</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Private deployments, auto-remediation, compliance audit trails and custom connectors, with an SLA.
            </p>
          </div>
          <Link href="/enterprise" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Explore Enterprise
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 id="faq-title" className="mb-6 text-2xl font-semibold tracking-tight">
          Questions
        </h2>
        <Faq />
      </section>

      <FinalCta />
    </>
  )
}
