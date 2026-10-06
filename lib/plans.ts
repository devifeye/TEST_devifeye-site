export type Plan = {
  id: 'free' | 'pro' | 'agency'
  name: string
  tagline: string
  monthly: number
  yearly: number
  cadence: string
  features: string[]
  missing?: string[]
  highlighted?: boolean
  cta: string
  /** Plans priced by project count. Use `{n}` in feature strings for the selected count. */
  scalable?: { min: number; max: number; default: number }
}

/*
 * Agency: build-your-own pricing, 3–25 projects.
 * Graduated (tax-bracket style): the base covers the first 3 projects, then each extra
 * project is charged at the rate of the band it falls in. The total always rises with
 * every project, never jumps, and gives a volume discount at scale.
 *
 *   3 projects            $15  ($5.00 / project, same rate as Pro)
 *   4–8   +$5 each  →  8 = $40
 *   9–17  +$4 each  → 17 = $76
 *   18–25 +$3 each  → 25 = $100 ($4.00 / project)
 *
 * This is DISPLAY pricing only. The billing backend must compute the price itself from
 * a validated project count and never trust a price sent from the browser.
 */
export const AGENCY_LIMITS = { min: 3, max: 25, default: 10 } as const
const AGENCY_BASE_PRICE = 15
const AGENCY_BANDS = [
  { upTo: 8, perProject: 5 },
  { upTo: 17, perProject: 4 },
  { upTo: 25, perProject: 3 },
] as const

export function clampAgencyProjects(projects: number) {
  if (!Number.isFinite(projects)) return AGENCY_LIMITS.default
  return Math.min(AGENCY_LIMITS.max, Math.max(AGENCY_LIMITS.min, Math.round(projects)))
}

export function agencyMonthlyPrice(projects: number) {
  const n = clampAgencyProjects(projects)
  let price = AGENCY_BASE_PRICE
  for (let project = AGENCY_LIMITS.min + 1; project <= n; project++) {
    price += AGENCY_BANDS.find((band) => project <= band.upTo)!.perProject
  }
  return price
}

/** Yearly billing = 10 months (2 months free), same as Pro. */
export const agencyYearlyPrice = (projects: number) => agencyMonthlyPrice(projects) * 10

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'One project, watched weekly.',
    monthly: 0,
    yearly: 0,
    cadence: 'Weekly',
    features: [
      '1 project (1 TEST + 1 LIVE)',
      'Weekly background checks',
      'Discord & Telegram bot alerts',
      'Metadata-only scanning',
    ],
    missing: ['VPS agent', 'API access', 'One-click file overwrites'],
    cta: 'Start free',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For solo devs shipping every day.',
    monthly: 10,
    yearly: 100,
    cadence: 'Daily',
    features: [
      '2 projects with VPS agent',
      '2 TEST · 2 LIVE · 2 VPS',
      'Daily background checks',
      'One-click file overwrites',
      'Discord & Telegram bot alerts',
      'Single-channel custom API webhook',
      'Email & text alerts (on/off toggle)',
    ],
    highlighted: true,
    cta: 'Go Pro',
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'Build your plan: 3 to 25 projects.',
    monthly: agencyMonthlyPrice(AGENCY_LIMITS.default),
    yearly: agencyYearlyPrice(AGENCY_LIMITS.default),
    cadence: 'Hourly',
    scalable: AGENCY_LIMITS,
    features: [
      '{n} projects with VPS agent',
      '{n} TEST · {n} LIVE · {n} VPS',
      'Hourly background checks',
      'One-click file overwrites',
      'Discord & Telegram bot alerts',
      'Multi-channel custom API webhooks',
      'Email & text alerts (on/off toggle)',
    ],
    cta: 'Start Agency',
  },
]

export type ComparisonValue = string | boolean

export const comparisonRows: { label: string; values: [ComparisonValue, ComparisonValue, ComparisonValue] }[] = [
  { label: 'Projects', values: ['1', '2', '3–25'] },
  { label: 'TEST environments', values: ['1', '2', '3–25'] },
  { label: 'LIVE environments', values: ['1', '2', '3–25'] },
  { label: 'VPS agents', values: [false, '2', '3–25'] },
  { label: 'Background checks', values: ['Weekly', 'Daily', 'Hourly'] },
  { label: 'Discord & Telegram bots', values: [true, true, true] },
  { label: 'Custom API webhooks', values: [false, 'Single channel', 'Multi-channel'] },
  { label: 'Email & text alerts', values: [false, true, true] },
  { label: 'API access', values: [false, true, true] },
  { label: 'Metadata-only scanning', values: [true, true, true] },
  { label: 'Secrets, rows & edge code read', values: ['Never', 'Never', 'Never'] },
]
