import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

// Served at /sitemap.xml. Blog posts are added automatically.
// No fake lastModified dates for static pages: Google ignores priority/changefreq and distrusts inaccurate dates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const latestPost = posts[0]

  const pages: MetadataRoute.Sitemap = ['', '/pricing', '/security', '/enterprise'].map((path) => ({
    url: `${SITE_URL}${path}`,
  }))

  return [
    ...pages,
    { url: `${SITE_URL}/blog`, ...(latestPost && { lastModified: latestPost.updated ?? latestPost.date }) },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated ?? post.date,
    })),
  ]
}
