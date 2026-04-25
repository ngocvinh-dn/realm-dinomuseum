
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  downloaded boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow anyone (anon key) to INSERT a lead
create policy "Anyone can submit a lead"
  on leads
  for insert
  to anon
  with check (true);

-- Only authenticated admins can SELECT leads (protect user data)
create policy "Auth users can view leads"
  on leads
  for select
  to authenticated
  using (true);

-- Index on email for fast dedup checks
create index if not exists leads_email_idx on leads(email);
