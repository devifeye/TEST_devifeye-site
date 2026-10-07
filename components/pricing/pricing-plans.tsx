'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Minus, Plus } from 'lucide-react'
import { agencyMonthlyPrice, agencyYearlyPrice, clampAgencyProjects, plans, type Plan } from '@/lib/plans'
import { APP_URL, linkButton } from '@/lib/site'
import { cn } from '@/lib/utils'

function ProjectSlider({
  value,
  onChange,
  limits,
}: {
  value: number
  onChange: (value: number) => void
  limits: NonNullable<Plan['scalable']>
}) {
  const perProject = agencyMonthlyPrice(value) / value
  const stepButton =
    'inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring'

  return (
    <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
      <div className="flex items-baseline justify-between">
        <label htmlFor="agency-projects" className="text-sm font-medium">
          Projects
        </label>
        <span className="font-mono text-sm text-primary" aria-hidden="true">
          {value}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className={stepButton}
          onClick={() => onChange(clampAgencyProjects(value - 1))}
          disabled={value <= limits.min}
          aria-label="One fewer project"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
        <input
          id="agency-projects"
          type="range"
          min={limits.min}
          max={limits.max}
          step={1}
          value={value}
          onChange={(event) => onChange(clampAgencyProjects(Number(event.target.value)))}
          aria-valuetext={`${value} projects, $${agencyMonthlyPrice(value)} per month`}
          className="h-2 w-full cursor-pointer accent-primary"
        />
        <button
          type="button"
          className={stepButton}
          onClick={() => onChange(clampAgencyProjects(value + 1))}
          disabled={value >= limits.max}
          aria-label="One more project"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-1.5 flex justify-between px-11 font-mono text-[10px] text-muted-foreground" aria-hidden="true">
        <span>{limits.min}</span>
        <span>{limits.max}</span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {`$${perProject.toFixed(2)} per project / month. `}
        <Link href="/enterprise" className="font-medium text-primary hover:underline">
          {`Need more than ${limits.max}?`}
        </Link>
      </p>
    </div>
  )
}

export function PricingPlans() {
  const [yearly, setYearly] = useState(false)
  const [agencyProjects, setAgencyProjects] = useState<number>(
    plans.find((plan) => plan.scalable)?.scalable?.default ?? 3,
  )

  return (
    <div className="flex flex-col items-center gap-10">
      <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-lg border border-border bg-card p-1">
        {[
          { value: false, label: 'Monthly' },
          { value: true, label: 'Yearly' },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={yearly === option.value}
            onClick={() => setYearly(option.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm transition-colors',
              yearly === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
            {option.value && (
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 font-mono text-[10px]',
                  yearly ? 'bg-primary-foreground/15' : 'bg-primary/15 text-primary',
                )}
              >
                2 months free
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid w-full gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const projects = plan.scalable ? agencyProjects : null
          const price =
            projects !== null
              ? yearly
                ? agencyYearlyPrice(projects)
                : agencyMonthlyPrice(projects)
              : yearly
                ? plan.yearly
                : plan.monthly
          const features = plan.features.map((feature) =>
            projects !== null ? feature.replaceAll('{n}', String(projects)) : feature,
          )
          // Only the project COUNT is passed on. The app must recompute the price server-side.
          const signupUrl = `${APP_URL}/signup?plan=${plan.id}&billing=${yearly ? 'yearly' : 'monthly'}${
            projects !== null ? `&projects=${projects}` : ''
          }`

          return (
            <article
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-xl border bg-card p-6',
                plan.highlighted ? 'border-primary/60 shadow-[0_0_60px_-20px_oklch(0.83_0.15_78/0.45)]' : 'border-border',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[11px] text-primary-foreground">
                  Our top pick for solo devs
                </span>
              )}
              {plan.scalable && (
                <span className="absolute -top-3 left-6 rounded-full border border-primary/40 bg-card px-2.5 py-0.5 font-mono text-[11px] text-primary">
                  Build your own
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {`${plan.cadence} checks`}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tabular-nums tracking-tight" aria-live="polite">{`$${price}`}</span>
                <span className="text-sm text-muted-foreground">
                  {plan.monthly === 0 ? 'once' : yearly ? '/ year' : '/ month'}
                </span>
              </p>
              {plan.scalable && projects !== null && (
                <ProjectSlider value={projects} onChange={setAgencyProjects} limits={plan.scalable} />
              )}
              <a
                href={signupUrl}
                className={cn('mt-6 w-full', plan.highlighted ? linkButton.primary : linkButton.outline)}
              >
                {plan.scalable ? `${plan.cta} · ${projects} projects` : plan.cta}
              </a>
              <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
                {plan.missing?.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
                    <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="sr-only">Not included: </span>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </div>
  )
}
