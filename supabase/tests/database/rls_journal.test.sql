-- FND-04 / ADR-0002 gate 1 and 4: row level security isolates users on every
-- journal table, and deleting an entry hard-deletes its derived rows.
-- Synthetic data only; no real journal text.
begin;
create extension if not exists pgtap with schema extensions;
select plan(20);

-- Helper (exists only inside this rolled-back transaction): rows affected by a DML statement.
create schema tap_h;
create function tap_h.affected(stmt text) returns int language plpgsql as $f$
declare n int;
begin execute stmt; get diagnostics n = row_count; return n; end $f$;
grant usage on schema tap_h to authenticated, anon;
grant execute on function tap_h.affected(text) to authenticated, anon;

-- Fixtures (as postgres): two users and one entry with one derived row for user A.
insert into auth.users (id, instance_id, aud, role, email)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user-a@example.test'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'user-b@example.test');

insert into public.journal_entries (id, user_id, body)
values ('a0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'synthetic entry A');
insert into public.emotion_candidates (id, entry_id, user_id, label, evidence)
values ('ca000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'calm', 'synthetic evidence');

select ok((select relrowsecurity from pg_class where oid = 'public.journal_entries'::regclass), 'RLS enabled on journal_entries');
select ok((select relrowsecurity from pg_class where oid = 'public.emotion_candidates'::regclass), 'RLS enabled on emotion_candidates');

-- User A: owner can create, read, update.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);
select lives_ok($$insert into public.journal_entries (id, user_id, body) values ('a0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'second A')$$, 'A can insert own entry');
select is((select count(*)::int from public.journal_entries), 2, 'A reads own 2 entries');
select is(tap_h.affected($$update public.journal_entries set body = 'edited A' where id = 'a0000000-0000-0000-0000-000000000002'$$), 1, 'A can update own entry');
select throws_ok($$update public.journal_entries set user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' where id = 'a0000000-0000-0000-0000-000000000002'$$, '42501', null, 'A cannot reassign own entry to B');

-- User B: every cross-user operation is denied.
select set_config('request.jwt.claims', '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}', true);
select is((select count(*)::int from public.journal_entries), 0, 'B reads none of A''s entries');
select is((select count(*)::int from public.emotion_candidates), 0, 'B reads none of A''s derived rows');
select throws_ok($$insert into public.journal_entries (user_id, body) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'forged as A')$$, '42501', null, 'B cannot insert an entry with A''s user_id');
select throws_ok($$insert into public.emotion_candidates (entry_id, user_id, label, evidence) values ('a0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'x', 'y')$$, '42501', null, 'B cannot insert a derived row with A''s user_id');
select throws_ok($$insert into public.emotion_candidates (entry_id, user_id, label, evidence) values ('a0000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'x', 'y')$$, '42501', null, 'B cannot attach a derived row to A''s entry');
select is(tap_h.affected($$update public.journal_entries set body = 'hijacked' where id = 'a0000000-0000-0000-0000-000000000001'$$), 0, 'B cannot update A''s entry');
select is(tap_h.affected($$update public.emotion_candidates set label = 'hijacked' where id = 'ca000000-0000-0000-0000-000000000001'$$), 0, 'B cannot update A''s derived row');
select is(tap_h.affected($$delete from public.journal_entries where id = 'a0000000-0000-0000-0000-000000000001'$$), 0, 'B cannot delete A''s entry');
select is(tap_h.affected($$delete from public.emotion_candidates where id = 'ca000000-0000-0000-0000-000000000001'$$), 0, 'B cannot delete A''s derived row');

-- Anonymous (signed out): no access at all.
reset role;
set local role anon;
select throws_ok($$select count(*) from public.journal_entries$$, '42501', null, 'anon cannot read (table privileges revoked)');
select throws_ok($$insert into public.journal_entries (user_id, body) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'anon write')$$, '42501', null, 'anon cannot insert');

-- Data untouched, and hard delete cascades to derived rows (gate 4).
reset role;
select is((select body from public.journal_entries where id = 'a0000000-0000-0000-0000-000000000001'), 'synthetic entry A', 'A''s original text is unchanged after B''s attempts');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}', true);
delete from public.journal_entries where id = 'a0000000-0000-0000-0000-000000000001';
reset role;
select is((select count(*)::int from public.journal_entries where id = 'a0000000-0000-0000-0000-000000000001'), 0, 'entry is hard-deleted');
select is((select count(*)::int from public.emotion_candidates where entry_id = 'a0000000-0000-0000-0000-000000000001'), 0, 'derived rows are hard-deleted with the entry');

select * from finish();
rollback;
