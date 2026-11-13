// Runs against the LOCAL Supabase stack only (supabase start + functions serve).
// Env: SUPABASE_URL, SUPABASE_ANON_KEY (from `supabase status -o env`). Skipped when unset.
// Synthetic users and text only.
import { assert, assertEquals } from "jsr:@std/assert@1";

const url = Deno.env.get("SUPABASE_URL");
const anon = Deno.env.get("SUPABASE_ANON_KEY");
const ignore = !url || !anon;
if (url && !/^http:\/\/(127\.0\.0\.1|localhost)/.test(url)) {
  throw new Error("integration tests must run against the local stack only");
}

type Session = { access_token: string; refresh_token: string; user: { id: string } };

async function signUp(email: string): Promise<Session> {
  const res = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: anon!, "content-type": "application/json" },
    body: JSON.stringify({ email, password: "synthetic-password-1" }),
  });
  assertEquals(res.status, 200);
  return await res.json();
}

const rest = (path: string, token: string, init: RequestInit = {}) =>
  fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: anon!, authorization: `Bearer ${token}`, "content-type": "application/json", prefer: "return=representation", ...init.headers },
  });

const analyze = (token: string, entryId: string) =>
  fetch(`${url}/functions/v1/analyze-entry`, {
    method: "POST",
    headers: { apikey: anon!, authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ entryId }),
  });

Deno.test({ name: "edge function end to end with real users", ignore }, async (t) => {
  const stamp = Date.now();
  const a = await signUp(`poc-a-${stamp}@example.test`);
  const b = await signUp(`poc-b-${stamp}@example.test`);

  const created = await rest("journal_entries", a.access_token, {
    method: "POST",
    body: JSON.stringify({ body: "synthetic entry for integration test" }),
  });
  assertEquals(created.status, 201);
  const [entry] = await created.json();

  await t.step("owner gets validated candidates and they are stored", async () => {
    const res = await analyze(a.access_token, entry.id);
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.schemaVersion, 1);
    const stored = await (await rest(`emotion_candidates?entry_id=eq.${entry.id}`, a.access_token)).json();
    assertEquals(stored.length, json.candidates.length);
  });

  await t.step("another user cannot analyze (or see) the entry", async () => {
    assertEquals((await analyze(b.access_token, entry.id)).status, 404);
    const seen = await (await rest(`journal_entries?id=eq.${entry.id}`, b.access_token)).json();
    assertEquals(seen.length, 0);
  });

  await t.step("a signed-out caller (anon key as bearer) is rejected", async () => {
    assertEquals((await analyze(anon!, entry.id)).status, 401);
  });

  await t.step("the original text is unchanged by analysis", async () => {
    const [row] = await (await rest(`journal_entries?id=eq.${entry.id}&select=body`, a.access_token)).json();
    assertEquals(row.body, "synthetic entry for integration test");
  });

  await t.step("refresh token yields a fresh working session", async () => {
    const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: anon!, "content-type": "application/json" },
      body: JSON.stringify({ refresh_token: a.refresh_token }),
    });
    assertEquals(res.status, 200);
    const refreshed = await res.json();
    assert(refreshed.access_token && refreshed.refresh_token !== a.refresh_token);
    assertEquals((await rest("journal_entries?select=id", refreshed.access_token)).status, 200);
  });

  await t.step("deleting the entry removes derived rows (hard delete)", async () => {
    assertEquals((await rest(`journal_entries?id=eq.${entry.id}`, a.access_token, { method: "DELETE" })).status, 200);
    const left = await (await rest(`emotion_candidates?entry_id=eq.${entry.id}`, a.access_token)).json();
    assertEquals(left.length, 0);
  });
});
