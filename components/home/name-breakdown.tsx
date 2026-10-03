const parts = [
  {
    token: 'dev',
    meaning: 'developer',
    body: 'Somebody on your team, maybe you, ships a quick fix straight in the Supabase dashboard or over SSH.',
    tone: 'text-foreground',
  },
  {
    token: 'if',
    meaning: 'the condition',
    body: 'If TEST and LIVE stop matching, or LIVE stops matching your migrations, that is drift.',
    tone: 'text-muted-foreground',
  },
  {
    token: 'eye',
    meaning: 'watching',
    body: 'Devifeye has been watching the whole time. It catches the change and tells you where you already work.',
    tone: 'text-primary',
  },
]

export function NameBreakdown() {
  return (
    <section aria-labelledby="name-title" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 id="name-title" className="sr-only">
          What the name Devifeye means
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {parts.map((part, i) => (
            <div key={part.token} className="flex flex-col gap-4 bg-background p-8">
              <div className="flex items-baseline justify-between">
                <span className={`font-mono text-5xl font-semibold tracking-tight ${part.tone}`}>{part.token}</span>
                <span className="font-mono text-xs text-muted-foreground">{`0${i + 1}`}</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{`= ${part.meaning}`}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{part.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xl font-medium tracking-tight text-balance md:text-2xl">
          {'If a '}
          <span className="font-mono">dev</span>
          {' changes it, the '}
          <span className="font-mono text-primary">eye</span>
          {' catches it.'}
        </p>
      </div>
    </section>
  )
}
