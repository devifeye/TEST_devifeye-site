import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id?: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}

export function SectionHeading({ id, eyebrow, title, description, align = 'left', as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-4', align === 'center' && 'mx-auto items-center text-center')}>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <Tag
        id={id}
        className={cn(
          'text-balance font-semibold tracking-tight',
          Tag === 'h1' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl',
        )}
      >
        {title}
      </Tag>
      {description && <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}
