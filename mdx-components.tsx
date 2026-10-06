import type { MDXComponents } from 'mdx/types'
import { mdxComponents } from '@/components/blog/mdx'

// Required by @next/mdx in the App Router. Maps Markdown elements and the custom
// <Callout>, <ReferralLink> and <DevifeyeCta> components for every .mdx file.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}
