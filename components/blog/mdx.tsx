import Link from 'next/link'
import { ArrowRight, Info, TriangleAlert } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { isValidElement } from 'react'
import { APP_URL, REFERRAL_LINKS, linkButton } from '@/lib/site'
import { cn } from '@/lib/utils'

/* ---------- helpers ---------- */

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function heading(Tag: 'h2' | 'h3', className: string) {
  function Heading({ children, id, ...props }: ComponentPropsWithoutRef<'h2'>) {
    const anchor = id ?? slugify(textOf(children))
    return (
      <Tag id={anchor} className={cn('group scroll-mt-24 text-balance font-semibold tracking-tight', className)} {...props}>
        {children}
        <a
          href={`#${anchor}`}
          aria-label="Link to this section"
          className="ml-2 font-mono text-primary opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      </Tag>
    )
  }
  Heading.displayName = `Mdx${Tag.toUpperCase()}`
  return Heading
}

/* ---------- standard elements ---------- */

function MdxLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const cls = 'font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary'
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export const mdxElements = {
  h2: heading('h2', 'mt-14 mb-4 text-2xl md:text-3xl'),
  h3: heading('h3', 'mt-10 mb-3 text-xl'),
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="my-5 leading-7 text-muted-foreground" {...props} />,
  a: MdxLink,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold text-foreground" {...props} />,
  ul: ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={cn(
        'my-5 ml-5 list-disc space-y-2 text-muted-foreground marker:text-primary',
        // GFM task lists ("- [ ] item") render as a checklist without bullets.
        className?.includes('contains-task-list') && 'ml-0 list-none',
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn('my-5 ml-5 list-decimal space-y-2 text-muted-foreground marker:font-mono marker:text-primary', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => <li className={cn('pl-1 leading-7', className)} {...props} />,
  input: ({ className, ...props }: ComponentPropsWithoutRef<'input'>) => (
    <input className={cn('mr-2 size-3.5 translate-y-0.5 accent-primary', className)} {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-6 border-l-2 border-primary pl-5 italic text-foreground/90" {...props} />
  ),
  hr: () => <hr className="my-12 border-border" />,
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code className={cn('rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground', className)} {...props} />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className={cn(
        'my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-[13px] leading-6 [&>code]:bg-transparent [&>code]:p-0',
        className,
      )}
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => <th className="border-b border-border bg-card px-4 py-3 font-medium" {...props} />,
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-border px-4 py-3 align-top text-muted-foreground" {...props} />
  ),
}

/* ---------- custom components usable inside .mdx ---------- */

export function Callout({ type = 'info', title, children }: { type?: 'info' | 'warning'; title?: string; children: ReactNode }) {
  const Icon = type === 'warning' ? TriangleAlert : Info
  return (
    <aside
      className={cn(
        'my-6 flex gap-3 rounded-xl border p-4 text-sm [&_p]:my-1 [&_p]:leading-6',
        type === 'warning' ? 'border-destructive/40 bg-destructive/5' : 'border-primary/30 bg-primary/5',
      )}
    >
      <Icon className={cn('mt-1 size-4 shrink-0', type === 'warning' ? 'text-destructive' : 'text-primary')} aria-hidden="true" />
      <div>
        {title && <p className="font-semibold text-foreground">{title}</p>}
        {children}
      </div>
    </aside>
  )
}

/** Affiliate link. rel="sponsored" is what Google asks for on paid/referral links. */
export function ReferralLink({ to, children }: { to: keyof typeof REFERRAL_LINKS; children: ReactNode }) {
  return (
    <a
      href={REFERRAL_LINKS[to]}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </a>
  )
}

export function DevifeyeCta({
  title = 'Know the moment TEST and LIVE drift apart.',
  body = 'Devifeye compares your Supabase projects, GitHub migrations and VPS config, and alerts you on Discord or Telegram when something changes out-of-band. Metadata only.',
  cta = 'Start watching for free',
}: {
  title?: string
  body?: string
  cta?: string
}) {
  return (
    <aside aria-label="Devifeye" className="my-10 rounded-2xl border border-primary/30 bg-card p-6 md:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Devifeye</p>
      <p className="mt-3 text-balance text-xl font-semibold tracking-tight text-foreground">{title}</p>
      <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a href={`${APP_URL}/signup`} className={linkButton.primary}>
          {cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
        <Link href="/#how" className={linkButton.outline}>
          See how it works
        </Link>
      </div>
    </aside>
  )
}

export const mdxComponents = { ...mdxElements, Callout, ReferralLink, DevifeyeCta }
