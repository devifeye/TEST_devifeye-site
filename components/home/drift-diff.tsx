import { EyeMark } from '@/components/site/logo'

type Line = { kind: 'ctx' | 'add' | 'del'; text: string }

const lines: Line[] = [
  { kind: 'ctx', text: 'create policy "Users update own profile"' },
  { kind: 'ctx', text: '  on public.profiles for update' },
  { kind: 'del', text: '  using (auth.uid() = id);' },
  { kind: 'add', text: '  using (true);' },
  { kind: 'ctx', text: '' },
  { kind: 'ctx', text: 'create index profiles_handle_idx' },
  { kind: 'del', text: '  on public.profiles (handle);' },
]

const styles: Record<Line['kind'], string> = {
  ctx: 'text-muted-foreground',
  add: 'bg-success/10 text-success',
  del: 'bg-destructive/10 text-destructive',
}

const marks: Record<Line['kind'], string> = { ctx: ' ', add: '+', del: '-' }

export function DriftDiff() {
  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">TEST</span>
            <span aria-hidden="true">{'↔'}</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">LIVE</span>
            <span className="hidden sm:inline">· public.profiles</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-[11px] text-destructive">
            <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />2 drifts
          </span>
        </div>
        <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-6">
          <code>
            {lines.map((line, i) => (
              <span key={i} className={`flex px-4 ${styles[line.kind]}`}>
                <span className="w-8 shrink-0 select-none text-right opacity-50">{i + 41}</span>
                <span className="w-6 shrink-0 select-none text-center">{marks[line.kind]}</span>
                <span className="whitespace-pre">{line.text || ' '}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>

      <div className="ml-auto w-full max-w-sm rounded-xl border border-border bg-[oklch(0.2_0.02_275)] p-4 shadow-xl shadow-black/30">
        <div className="flex gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
            <EyeMark className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm">
              <span className="font-semibold">devifeye</span>
              <span className="ml-2 rounded bg-primary/20 px-1 font-mono text-[10px] uppercase text-primary">bot</span>
              <span className="ml-2 text-xs text-muted-foreground">Today at 09:00</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              <span className="text-destructive">Drift detected</span>
              {' in '}
              <span className="font-mono text-foreground">acme-app</span>
              {': RLS policy loosened on LIVE, index missing. Not in '}
              <span className="font-mono text-foreground">supabase/migrations</span>.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Example drift report showing an RLS policy changed on the LIVE environment and a missing index, with a Discord alert.
      </figcaption>
    </figure>
  )
}
