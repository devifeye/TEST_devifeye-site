import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'What counts as a project?',
    a: 'A project is one app with a TEST environment and a LIVE environment. On Pro and Agency, each project also gets a VPS agent slot.',
  },
  {
    q: 'Will you ever read my table data or secrets?',
    a: 'No. We only read structural metadata: tables, columns, constraints, RLS policies, functions, triggers and indexes. Row data, secrets and edge function code are off on every plan, and no setting can turn them on.',
  },
  {
    q: 'How do you avoid noisy alerts?',
    a: 'We normalize SQL before diffing, so reordered columns and formatting changes don\u2019t count as drift. You can also add ignore rules for intentional differences between TEST and LIVE, like log levels or instance counts.',
  },
  {
    q: 'The VPS agent is open. Can I just use it without paying?',
    a: 'Go ahead and read it. The agent only collects hashes and sends them home. Diffing, history and alerts all run on our side, and your plan controls which of those you get.',
  },
  {
    q: 'Can I switch between monthly and yearly?',
    a: 'Yes. Yearly billing gives you two months free on Pro ($100/yr) and Agency ($500/yr). You can switch at any time from your dashboard.',
  },
  {
    q: 'Are text alerts unlimited?',
    a: 'Email and text alerts use a fixed format, and you can turn each one on or off. Text alerts have a fair monthly allowance. Once you use it up, alerts fall back to email and webhooks until your next cycle.',
  },
]

export function Faq() {
  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {faqs.map((item) => (
        <details key={item.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium">
            {item.q}
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
