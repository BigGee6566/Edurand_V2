-- EduRand Database Schema
-- Paste this into: Supabase Dashboard → SQL Editor → New Query → Run

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  name            text        not null default '',
  short_name      text        not null default '',
  initials        text        not null default '??',
  university      text        not null default 'UCT',
  funding_type    text        not null default 'nsfas',   -- 'nsfas' | 'bursary' | 'self'
  monthly_budget  integer     not null default 1500,
  language        text        not null default 'en',      -- 'en' | 'zu' | 'af'
  dark_mode       boolean     not null default false,
  updated_at      timestamptz          default now()
);

create table if not exists public.transactions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users on delete cascade not null,
  cat         text        not null,
  merchant    text        not null,
  amount      numeric(10,2) not null,
  note        text,
  at_label    text        not null default 'Just now',
  created_at  timestamptz          default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.transactions enable row level security;

-- Profiles
create policy "profiles: read own"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own"
  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- Transactions
create policy "transactions: read own"
  on public.transactions for select using (auth.uid() = user_id);
create policy "transactions: insert own"
  on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions: delete own"
  on public.transactions for delete using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists idx_transactions_user
  on public.transactions(user_id);
create index if not exists idx_transactions_created
  on public.transactions(created_at desc);
