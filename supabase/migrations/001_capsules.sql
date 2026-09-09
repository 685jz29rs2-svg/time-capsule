-- Digital Time Capsule
create table if not exists public.capsules (
  id uuid primary key,
  token text unique not null,
  sender_name text not null default '',
  recipient_email text not null,
  body text not null,
  open_at timestamptz not null,
  created_at timestamptz not null default now(),
  sealed_at timestamptz,
  delivered_at timestamptz,
  status text not null default 'pending_payment'
    check (status in ('draft', 'pending_payment', 'sealed', 'delivered')),
  stripe_session_id text unique
);

create index if not exists capsules_due_idx
  on public.capsules (status, open_at);

alter table public.capsules enable row level security;
