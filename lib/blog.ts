import fs from 'node:fs'
import path from 'node:path'
import type { ComponentType } from 'react'

/*
 * One file per post: content/blog/<slug>.mdx
 * The file name IS the URL slug (/blog/<slug>), so keep it lowercase-kebab-case.
 * Each post must `export const metadata = { ... }` matching PostMeta below.
 * Everything here runs at build time only; pages are statically generated.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const WORDS_PER_MINUTE = 225

export type PostMeta = {
  /** Shown as the H1 and used for the <title>. Aim for under ~60 characters. */
  title: string
  /** Meta description and listing summary. Aim for 120–160 characters. */
  description: string
  /** Publish date, YYYY-MM-DD. */
  date: string
  /** Last meaningful update, YYYY-MM-DD. Optional. */
  updated?: string
  author: string
  tags: string[]
  /** Drafts build locally but are excluded from production builds, the sitemap and RSS. */
  draft?: boolean
}

export type Post = PostMeta & {
  slug: string
  readingMinutes: number
}

export type LoadedPost = Post & {
  Content: ComponentType
}

const isProd = process.env.NODE_ENV === 'production'

function assertMeta(meta: unknown, slug: string): asserts meta is PostMeta {
  const fail = (msg: string): never => {
    throw new Error(`[blog] content/blog/${slug}.mdx: ${msg}`)
  }
  if (!meta || typeof meta !== 'object') fail('missing `export const metadata = { ... }`')
  const m = meta as Record<string, unknown>
  if (typeof m.title !== 'string' || !m.title.trim()) fail('`title` is required')
  if (typeof m.description !== 'string' || !m.description.trim()) fail('`description` is required')
  if (typeof m.author !== 'string' || !m.author.trim()) fail('`author` is required')
  if (typeof m.date !== 'string' || !DATE_PATTERN.test(m.date)) fail('`date` must be YYYY-MM-DD')
  if (m.updated !== undefined && (typeof m.updated !== 'string' || !DATE_PATTERN.test(m.updated)))
    fail('`updated` must be YYYY-MM-DD')
  if (!Array.isArray(m.tags) || !m.tags.every((t) => typeof t === 'string')) fail('`tags` must be a string array')
  if (m.draft !== undefined && typeof m.draft !== 'boolean') fail('`draft` must be true or false')
}

function readingMinutes(source: string) {
  const text = source
    .replace(/^export const metadata[\s\S]*?\n}\s*$/m, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()-]/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
    .map((slug) => {
      if (!SLUG_PATTERN.test(slug)) {
        throw new Error(`[blog] "${slug}.mdx" is not a valid slug. Use lowercase letters, numbers and single hyphens.`)
      }
      return slug
    })
}

export async function getPost(slug: string): Promise<LoadedPost | null> {
  // Only known, well-formed slugs ever reach the dynamic import (no path traversal).
  if (!SLUG_PATTERN.test(slug) || !getPostSlugs().includes(slug)) return null

  const mod = (await import(`@/content/blog/${slug}.mdx`)) as { default: ComponentType; metadata?: unknown }
  assertMeta(mod.metadata, slug)
  if (mod.metadata.draft && isProd) return null

  const source = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8')
  return { ...mod.metadata, slug, readingMinutes: readingMinutes(source), Content: mod.default }
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(getPostSlugs().map(getPost))
  return posts
    .filter((p): p is LoadedPost => p !== null)
    .map(({ Content: _content, ...post }) => post)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))
}
