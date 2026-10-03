import { Bell, Mail, MessageSquare, Send, Smartphone, Webhook } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'

const channels = [
  { icon: MessageSquare, name: 'Discord', plan: 'All plans' },
  { icon: Send, name: 'Telegram', plan: 'All plans' },
  { icon: Webhook, name: 'Custom webhooks', plan: 'Pro & Agency' },
  { icon: Mail, name: 'Email', plan: 'Pro & Agency' },
  { icon: Smartphone, name: 'Text / SMS', plan: 'Pro & Agency' },
  { icon: Bell, name: 'In-app', plan: 'All plans' },
]

export function AgentInstall() {
  return (
    <section aria-labelledby="agent-title" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="agent-title"
            eyebrow="The VPS agent"
            title="One command. Outbound only."
            description="The agent is small and open, so you can read every line of it. It hashes the files you track and sends a short JSON payload home over HTTPS. You don't open any inbound ports or hand over SSH keys."
          />
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">live-vps-01</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
              <code>
                <span className="text-muted-foreground">$ </span>
                <span>curl -sSL get.devifeye.com | sh -s -- --key </span>
                <span className="text-primary">dfe_live_••••</span>
                {'\n'}
                <span className="text-success">{'[ok]'}</span>
                <span className="text-muted-foreground"> agent registered · runs as unprivileged user</span>
                {'\n'}
                <span className="text-success">{'[ok]'}</span>
                <span className="text-muted-foreground"> tracking /etc/nginx, /etc/caddy, apt packages</span>
                {'\n'}
                <span className="text-primary">{'[..]'}</span>
                <span className="text-muted-foreground"> watching. next check in 23h 59m</span>
              </code>
            </pre>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Alerts"
            title="We tell you where you already are."
            description="A drift alert you never see is useless. That's why even the free plan pushes alerts to Discord and Telegram."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {channels.map((channel) => (
              <li key={channel.name} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <channel.icon className="size-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{channel.name}</p>
                  <p className="text-xs text-muted-foreground">{channel.plan}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
