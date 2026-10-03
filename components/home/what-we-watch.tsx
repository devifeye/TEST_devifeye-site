import { Database, GitBranch, Server } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'

const targets = [
  {
    icon: Database,
    name: 'Supabase',
    summary: 'Schema and security drift between TEST and LIVE projects.',
    items: ['Tables, columns & types', 'Constraints & foreign keys', 'RLS policies', 'Functions & triggers', 'Indexes', 'Auth & storage rules'],
  },
  {
    icon: GitBranch,
    name: 'GitHub',
    summary: 'Your migrations folder compared against what is actually deployed.',
    items: ['supabase/migrations', 'Dashboard-only changes', 'Branch vs. environment', 'Missing migrations', 'Out-of-order applies', 'Unmerged hotfixes'],
  },
  {
    icon: Server,
    name: 'VPS',
    summary: 'A small outbound agent hashes the host config you care about.',
    items: ['Nginx & Caddy configs', 'Installed packages', 'systemd units', 'Tracked config files', 'SHA-256 hashes only', 'No inbound ports'],
  },
]

export function WhatWeWatch() {
  return (
    <section id="watch" aria-labelledby="watch-title" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          id="watch-title"
          eyebrow="What we watch"
          title="Three places drift hides."
          description="Small teams usually break production in one of three ways: a dashboard tweak, a forgotten migration, or a quick SSH fix. We keep an eye on all three."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {targets.map((target) => (
            <article key={target.name} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <target.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{target.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{target.summary}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-5">
                {target.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span className="size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
