import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { FinalCta } from '@/components/site/final-cta'
import { formatDate, getAllPosts, getPost } from '@/lib/blog'
import { SITE, SITE_URL } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

// Every post is pre-rendered at build time; unknown slugs are a hard 404.
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const url = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      siteName: SITE.name,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const { Content } = post
  const url = `${SITE_URL}/blog/${post.slug}`
  // Team bylines are organisations in schema.org terms; named people are Persons.
  const author = /team/i.test(post.author)
    ? { '@type': 'Organization', name: post.author, url: SITE_URL }
    : { '@type': 'Person', name: post.author }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        keywords: post.tags.join(', '),
        author,
        publisher: {
          '@type': 'Organization',
          name: SITE.name,
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-icon.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Escaping "<" prevents a "</script>" inside any string from breaking out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6 md:pt-16">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ol>
        </nav>

        <header className="mt-8 border-b border-border pb-10">
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-border bg-card/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{post.description}</p>
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            {`By ${post.author} · `}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated && (
              <>
                {' · Updated '}
                <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </>
            )}
            {` · ${post.readingMinutes} min read`}
          </p>
        </header>

        <div className="pt-4">
          <Content />
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All posts
          </Link>
        </footer>
      </article>

      <FinalCta />
    </>
  )
}
