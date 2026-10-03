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
}

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
    missing: ['VPS agent', 'API access'],
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
    tagline: 'For teams running client stacks.',
    monthly: 50,
    yearly: 500,
    cadence: 'Hourly',
    features: [
      '15 projects with VPS agent',
      '15 TEST · 15 LIVE · 15 VPS',
      'Hourly background checks',
      'Discord & Telegram bot alerts',
      'Multi-channel custom API webhooks',
      'Email & text alerts (on/off toggle)',
    ],
    cta: 'Start Agency',
  },
]

export type ComparisonValue = string | boolean

export const comparisonRows: { label: string; values: [ComparisonValue, ComparisonValue, ComparisonValue] }[] = [
  { label: 'Projects', values: ['1', '2', '15'] },
  { label: 'TEST environments', values: ['1', '2', '15'] },
  { label: 'LIVE environments', values: ['1', '2', '15'] },
  { label: 'VPS agents', values: [false, '2', '15'] },
  { label: 'Background checks', values: ['Weekly', 'Daily', 'Hourly'] },
  { label: 'Discord & Telegram bots', values: [true, true, true] },
  { label: 'Custom API webhooks', values: [false, 'Single channel', 'Multi-channel'] },
  { label: 'Email & text alerts', values: [false, true, true] },
  { label: 'API access', values: [false, true, true] },
  { label: 'Metadata-only scanning', values: [true, true, true] },
  { label: 'Secrets, rows & edge code read', values: ['Never', 'Never', 'Never'] },
]
