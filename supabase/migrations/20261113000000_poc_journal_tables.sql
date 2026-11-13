-- FND-04 PoC schema (ADR-0002). Minimal tables to prove RLS isolation and hard
-- deletion; the real data model is decided in docs/06 and later tickets.
-- journal_entries.body preserves the original text; it is never rewritten by AI.

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Derived data (AI emotion candidates). Hard-deleted together with the entry.
create table public.emotion_candidates (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.journal_entries (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label text not null,
  evidence text not null,
  created_at timestamptz not null default now()
);

create index emotion_candidates_entry_id_idx on public.emotion_candidates (entry_id);

alter table public.journal_entries enable row level security;
alter table public.emotion_candidates enable row level security;

-- No access for signed-out users: policies are granted to `authenticated` only,
-- and table privileges are revoked from `anon` as a second layer.
revoke all on public.journal_entries, public.emotion_candidates from anon;

create policy journal_entries_owner_all on public.journal_entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- A derived row must belong to the caller AND hang off an entry the caller owns.
create policy emotion_candidates_owner_all on public.emotion_candidates
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.journal_entries e
      where e.id = entry_id and e.user_id = (select auth.uid())
    )
  );
