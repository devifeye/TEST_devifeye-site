export const APP_URL = 'https://app.devifeye.com'
export const CONTACT_EMAIL = 'hello@devifeye.com'
export const SITE = {
  name: "Devifeye",
  eyebrow: "dev · if · eye — always watching",
  tagline: "We watch for drift, so you don't have to.",
  description:
    "Devifeye keeps a pair of watchers on your TEST and LIVE environments across Supabase, GitHub and your VPS servers. The moment someone tweaks a table, policy or config out-of-band, you hear about it before production does.",
  privacy: "Metadata only. We never read your rows, secrets or edge function code.",
};
export const navLinks = [
  { href: '/#watch', label: 'What we watch' },
  { href: '/#how', label: 'How it works' },
  { href: '/security', label: 'Security' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/enterprise', label: 'Enterprise' },
]

export const linkButton = {
  primary:
    'inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring',
  outline:
    'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input bg-card/40 px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring',
}
