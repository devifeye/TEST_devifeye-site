import { ImageResponse } from 'next/og'
import { getAllPosts, getPost } from '@/lib/blog'

// Auto-generated 1200x630 social card for every post (used by Open Graph, X, LinkedIn, Slack...).
export const alt = 'Devifeye blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#101219',
          color: '#f3f4f7',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, letterSpacing: 2, color: '#a3a7b3' }}>
          <span style={{ color: '#f3f4f7' }}>dev</span>
          <span>if</span>
          <span style={{ color: '#f2b33d' }}>eye</span>
          <span style={{ marginLeft: 16 }}>· blog</span>
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 600, lineHeight: 1.1, letterSpacing: -1, maxWidth: 1000 }}>
          {post?.title ?? 'Devifeye blog'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: '#a3a7b3' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#4ccb8a' }} />
          TEST ↔ LIVE · drift alerts for Supabase, GitHub and VPS
        </div>
      </div>
    ),
    size,
  )
}
