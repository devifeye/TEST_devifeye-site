export const metadata = {
  title: 'Why Separate Dev, Staging and Production Environments Matter',
  description:
    'Separate environments stop untested changes reaching your users. Why they matter, and how we set them up with GitHub, Vercel, Supabase and Hostinger.',
  date: '2026-10-05',
  author: 'Devifeye Team',
  tags: ['environments', 'devops', 'supabase', 'vercel', 'github'],
}

If your app has real users, you need at least two copies of it: one where you try things, and one your users rely on. Separate development, staging and production environments let you build, test and review changes without risking the live product. They also make mistakes cheap and rollbacks routine, and they keep production data and secrets away from experiments.

This guide explains what each environment is for, why the separation matters, and how we run it day to day on our preferred stack: **GitHub, Vercel, Supabase and Hostinger**.

<Callout title="Disclosure">
  This post contains a referral link to Hostinger. If you sign up through it, we may earn a commission at no extra cost to you. We only recommend tools we use ourselves.
</Callout>

## What are development, staging and production environments?

An environment is a complete, running copy of your software: the code, the database, the configuration and the secrets it needs. Most teams use three.

| Environment | What it's for | Who uses it | Data |
| --- | --- | --- | --- |
| **Development** | Building and breaking things | You, on your machine | Seed or fake data |
| **Staging** (TEST) | Checking changes before release | Your team and reviewers | Realistic but non-sensitive data |
| **Production** (LIVE) | Serving real users | Your customers | Real data |

Small teams often merge development and staging into one TEST environment. That's fine. What matters is that **production is never the first place a change runs**.

## Why separate environments matter

### 1. Production stops being your test bench

Without a staging environment, every deploy is an experiment on your customers. A typo in a query, a missing environment variable or a slow migration only shows up when someone is already affected. With staging, the same mistake surfaces in front of you, not in your support inbox.

### 2. Changes get reviewed before users see them

A staging copy gives teammates, clients and testers a real URL to click through. Reviewing a running feature catches problems that reading a diff never will: broken layouts, confusing flows, permissions that are too loose.

### 3. Secrets and data stay where they belong

Each environment should have its **own** credentials. If a TEST key leaks, production is untouched. It also means you never need to copy real customer data into a place with weaker controls. That matters for privacy laws like GDPR as much as for security.

<Callout type="warning" title="Never reuse production secrets">
  Your production database password, service keys and API tokens should exist only in production. Use different values for staging and development, even if it feels redundant.
</Callout>

### 4. Rollbacks become boring

When every release is a known, tested build, rolling back means redeploying the previous one. When production has been hand-edited, there is no "previous version" to go back to.

### 5. Your database history stays reproducible

Schema changes written as migration files and applied to TEST before LIVE give you a full, ordered history of your database. You can rebuild any environment from scratch, and you always know what production *should* look like.

## The hidden risk: environment drift

Separate environments only help while they stay in step. **Environment drift** is what happens when TEST and LIVE quietly stop matching. It's usually caused by:

- a "quick fix" made directly in the production database dashboard,
- a migration applied to one environment but not the other,
- a config file edited over SSH on the production server and never committed,
- a security policy loosened in production to unblock someone, then forgotten.

Drift is dangerous because nothing breaks straight away. Your tests pass on TEST, you deploy, and production behaves differently, because it *is* different. Drifted security rules are the worst case: a Row Level Security policy changed to `using (true)` in production silently exposes data that staging still protects.

<DevifeyeCta
  title="Catch drift before your users do."
  body="Devifeye compares your TEST and LIVE Supabase projects, your GitHub migrations and your VPS config, then alerts you on Discord or Telegram the moment they stop matching. It reads metadata only, never your rows or secrets."
/>

## Our golden stack for separate environments

There are many good ways to do this. This is the combination we use and recommend to small teams, because each tool has environments built in rather than bolted on.

### GitHub: the single source of truth

Everything that defines your app lives in one GitHub repository: website code, database migrations (`supabase/migrations`) and server config. If it isn't in Git, it doesn't exist.

- Use **`main` for production** and feature branches for everything else.
- Turn on [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) so changes reach `main` only through a reviewed pull request with passing checks.
- Keep secrets out of the repo. Commit a `.env.example` with placeholder values, and add your real `.env` files to `.gitignore`.

Because the website source is in GitHub, making a change is easy: edit, open a pull request, review the preview, merge.

### Vercel: hosting with environments built in

Vercel maps directly onto this workflow. Your production branch deploys to your live domain, and [every other branch and pull request gets its own preview deployment](https://vercel.com/docs/deployments/environments) with a unique URL. That gives you a staging environment for every change without managing any servers.

The key setting is **environment variables per environment**. Vercel lets you scope each variable to Production, Preview or Development, so the same variable name can point at different backends:

- **Production** → your LIVE Supabase project
- **Preview** → your TEST Supabase project
- **Development** → TEST, or a local Supabase instance

Preview deployments are not indexed by search engines by default. For anything sensitive, also turn on Vercel's Deployment Protection so previews require authentication.

### Supabase: two projects, one migration history

Use **two separate Supabase projects**, one for TEST and one for LIVE. Don't use one project with two schemas, and don't use one project "carefully". Each project has its own database, auth users, storage and keys, so a mistake in TEST physically can't touch LIVE.

Then make migrations the *only* way the schema changes. The Supabase CLI handles this:

```bash
# create a migration file in supabase/migrations
supabase migration new add_invoices_table

# rebuild your local database from all migrations to test it
supabase db reset

# apply pending migrations to the linked project (TEST first, then LIVE)
supabase link --project-ref <test-project-ref>
supabase db push
```

Supabase's own guide to [managing environments](https://supabase.com/docs/guides/deployment/managing-environments) shows how to run `db push` from GitHub Actions, so merging to a branch applies its migrations automatically.

Two security rules that should never drift between projects:

- **Enable Row Level Security on every table** exposed to the client, and keep the policies in migrations.
- **Keep the service role / secret key server-side only.** The browser should only ever see the anon / publishable key.

### Hostinger: VPS and domains

The last piece is your own server and your domain. We use <ReferralLink to="hostinger">Hostinger</ReferralLink> for both.

**Domains.** Register your domain with Hostinger and point it at Vercel through DNS. Use a subdomain such as `staging.yourdomain.com` for a stable staging URL, so testers don't have to chase changing preview links.

**VPS.** Some things don't belong on Vercel or Supabase: background workers, long-running jobs, scrapers, queues or self-hosted tools. A VPS handles those. Keep staging and production apart there too, ideally on separate servers. At a minimum, use separate system users, directories, ports and `.env` files. Harden both:

- log in with SSH keys and disable password authentication,
- allow only the ports you need through the firewall,
- keep your server config files in Git and deploy them from there, instead of editing them live.

<ReferralLink to="hostinger">Get a Hostinger VPS or domain</ReferralLink> if you're setting this up from scratch.

## How a change moves from laptop to production

Put together, a single change follows the same path every time:

1. Create a feature branch and build locally against development data.
2. If the schema changes, write it as a Supabase migration and test it with `supabase db reset`.
3. Push the branch. Vercel builds a preview deployment wired to the TEST Supabase project.
4. Apply the migration to TEST and review the preview with your team.
5. Merge the pull request into `main`. Vercel deploys to production.
6. Apply the same migration to LIVE, via the CLI or a GitHub Action.
7. Check that TEST and LIVE still match.

Step 7 is the one most teams skip, and it's where drift creeps in.

## Separate environments checklist

- [ ] Two Supabase projects: TEST and LIVE
- [ ] All schema changes go through `supabase/migrations`
- [ ] RLS enabled on every client-facing table, in both projects
- [ ] Vercel environment variables scoped to Production, Preview and Development
- [ ] Production keys used *only* in production
- [ ] `main` protected; changes arrive through reviewed pull requests
- [ ] Staging and production separated on your VPS
- [ ] No manual edits to LIVE: no dashboard tweaks, no SSH hotfixes
- [ ] Something checks that TEST and LIVE still match

## The bottom line

Separate environments are one of the cheapest insurance policies in software. GitHub holds the truth, Vercel gives every change its own preview, Supabase keeps TEST and LIVE physically apart, and Hostinger covers your server and your domain.

The setup only protects you while the environments stay in sync. If you'd rather not check that by hand, [Devifeye watches for drift](/#how) across Supabase, GitHub and your VPS, and tells you the moment something changes out-of-band. You can [start for free](/pricing).
