export type Scene = {
  source: string;
  reason: string;
  test: string;
  live: string;
  mismatchLine: number;
};

export const SCENES: Scene[] = [
  {
    source: "supabase · rls",
    reason: "SELECT policy widened to true",
    test: `alter table public.users
  enable row level security;

create policy users_own
  on public.users
  for select
  using (auth.uid() = id);`,
    live: `alter table public.users
  enable row level security;

create policy users_own
  on public.users
  for select
  using (true);`,
    mismatchLine: 6,
  },
  {
    source: "supabase · schema",
    reason: "column missing in LIVE",
    test: `create table public.invoices (
  id uuid primary key,
  total numeric not null,
  paid_at timestamptz,
  region text
);`,
    live: `create table public.invoices (
  id uuid primary key,
  total numeric not null,
  paid_at timestamptz,
  -- region dropped
);`,
    mismatchLine: 4,
  },
  {
    source: "github · protection",
    reason: "required reviews dropped",
    test: `branch: main
  require_reviews: 2
  dismiss_stale: true
  enforce_admins: true
  require_status: build`,
    live: `branch: main
  require_reviews: 0
  dismiss_stale: false
  enforce_admins: false
  require_status: build`,
    mismatchLine: 1,
  },
  {
    source: "vps · nginx",
    reason: "CORS origin opened to *",
    test: `add_header Access-Control
  -Allow-Origin
  "https://app.internal";
add_header X-Frame-Options
  "DENY";`,
    live: `add_header Access-Control
  -Allow-Origin
  "*";
add_header X-Frame-Options
  "DENY";`,
    mismatchLine: 2,
  },
];
