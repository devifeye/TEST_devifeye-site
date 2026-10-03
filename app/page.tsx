import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { NameBreakdown } from '@/components/home/name-breakdown'
import { WhatWeWatch } from '@/components/home/what-we-watch'
import { HowItWorks } from '@/components/home/how-it-works'
import { BlindSpots } from '@/components/home/blind-spots'
import { AgentInstall } from '@/components/home/agent-install'
import { PricingPlans } from '@/components/pricing/pricing-plans'
import { SectionHeading } from '@/components/site/section-heading'
import { FinalCta } from '@/components/site/final-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <NameBreakdown />
      <WhatWeWatch />
      <HowItWorks />
      <BlindSpots />
      <AgentInstall />
      <section aria-labelledby="pricing-title" className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 sm:px-6">
          <SectionHeading
            id="pricing-title"
            align="center"
            eyebrow="Pricing"
            title="Pick how often the eye blinks."
            description="Start free with weekly checks. Upgrade when you want daily or hourly checks, VPS agents and more channels."
          />
          <PricingPlans />
          <p className="text-center text-sm text-muted-foreground">
            {'Need private VPC deployment or custom connectors? '}
            <Link href="/enterprise#enquiry" className="font-medium text-primary hover:underline">
              Talk to us about Enterprise
            </Link>
          </p>
        </div>
      </section>
      <FinalCta />
    </>
  )
}
