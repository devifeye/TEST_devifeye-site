import Link from 'next/link'
import { Logo } from './logo'
import { CONTACT_EMAIL } from '@/lib/site'

const columns = [
  {
    title: 'Product',
    links: [
      { href: '/#watch', label: 'What we watch' },
      { href: '/#how', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/security', label: 'Security' },
      { href: '/security#boundary', label: 'Data boundary' },
      { href: '/security#agent', label: 'VPS agent' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/enterprise', label: 'Enterprise' },
      { href: '/blog', label: 'Blog' },
      { href: `mailto:${CONTACT_EMAIL}`, label: 'Contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {'If a dev changes it, the eye catches it. Drift alerts for Supabase, GitHub and VPS.'}
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-medium">{col.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{`© ${new Date().getFullYear()} Devifeye. All rights reserved.`}</p>
          <p className="font-mono">dev · if · eye — we watch for you</p>
        </div>
      </div>
    </footer>
  )
}
