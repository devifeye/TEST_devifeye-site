import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Rss } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { FinalCta } from '@/components/site/final-cta'
import { formatDate, getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical guides on environment drift, safe deployments and running Supabase, GitHub, Vercel and VPS stacks without surprises in production.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': [{ url: '/blog/rss.xml', title: 'Devifeye blog' }] },
  },
  openGraph: { type: 'website', url: '/blog' },
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts()

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Blog"
          title="Notes on drift, deploys and keeping LIVE boring."
          description="Guides for small teams shipping on Supabase, GitHub, Vercel and their own servers."
        />
        <Link
          href="/blog/rss.xml"
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <Rss className="size-3.5" aria-hidden="true" />
          RSS feed
        </Link>

        {posts.length === 0 ? (
          <p className="mt-14 text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
          <ul className="mt-14 flex flex-col divide-y divide-border border-y border-border">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="group relative flex flex-col gap-3 py-8">
                  <p className="font-mono text-xs text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {` · ${post.readingMinutes} min read`}
                  </p>
                  <h2 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-primary">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-pretty leading-relaxed text-muted-foreground">{post.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary" aria-hidden="true">
                    Read article
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
      <FinalCta />
    </>
  )
}
