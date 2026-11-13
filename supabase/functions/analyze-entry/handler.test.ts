// FND-04 gates 2 and 6: the function calls the (mock) AI adapter on the server,
// validates its output against a versioned schema, and refuses invalid output
// without saving it, leaving the original entry untouched. Synthetic data only.
import { assert, assertEquals, assertFalse } from "jsr:@std/assert@1";
import { handleAnalyze, type Deps } from "./handler.ts";
import { mockAdapter } from "./adapter.ts";

const SECRET = "sk-test-secret-value-must-never-leak";

function makeDeps(over: Partial<Deps> = {}) {
  const saved: unknown[] = [];
  const logs: string[] = [];
  const deps: Deps = {
    getUserId: () => Promise.resolve("user-a"),
    loadEntry: (id) => Promise.resolve(id === "entry-1" ? { id, body: "synthetic entry text" } : null),
    saveCandidates: (_entryId, candidates) => {
      saved.push(...candidates);
      return Promise.resolve();
    },
    adapter: mockAdapter,
    log: (line) => logs.push(line),
    ...over,
  };
  return { deps, saved, logs };
}

const post = (body: unknown, headers: Record<string, string> = { authorization: "Bearer t" }) =>
  new Request("http://fn/analyze-entry", { method: "POST", headers, body: JSON.stringify(body) });

Deno.test("valid mock output is validated and saved as candidates", async () => {
  const { deps, saved } = makeDeps();
  const res = await handleAnalyze(post({ entryId: "entry-1" }), deps);
  assertEquals(res.status, 200);
  const json = await res.json();
  assertEquals(json.schemaVersion, 1);
  assert(saved.length > 0);
  assertEquals(json.candidates.length, saved.length);
});

Deno.test("invalid adapter output is rejected, nothing saved, entry preserved", async () => {
  const { deps, saved } = makeDeps({
    adapter: { analyze: () => Promise.resolve({ schemaVersion: 1, candidates: [{ label: 5 }] }) },
  });
  const res = await handleAnalyze(post({ entryId: "entry-1" }), deps);
  assertEquals(res.status, 422);
  assertEquals((await res.json()).error, "invalid_ai_output");
  assertEquals(saved.length, 0);
});

Deno.test("wrong schema version is rejected", async () => {
  const { deps, saved } = makeDeps({
    adapter: { analyze: () => Promise.resolve({ schemaVersion: 99, candidates: [] }) },
  });
  const res = await handleAnalyze(post({ entryId: "entry-1" }), deps);
  assertEquals(res.status, 422);
  assertEquals(saved.length, 0);
});

Deno.test("adapter failure returns 502 and saves nothing", async () => {
  const { deps, saved } = makeDeps({ adapter: { analyze: () => Promise.reject(new Error("boom")) } });
  const res = await handleAnalyze(post({ entryId: "entry-1" }), deps);
  assertEquals(res.status, 502);
  assertEquals(saved.length, 0);
});

Deno.test("unauthenticated request is rejected before touching data", async () => {
  const { deps, saved } = makeDeps({ getUserId: () => Promise.resolve(null) });
  const res = await handleAnalyze(post({ entryId: "entry-1" }, {}), deps);
  assertEquals(res.status, 401);
  assertEquals(saved.length, 0);
});

Deno.test("an entry the caller cannot see is a 404 (ownership is enforced by RLS)", async () => {
  const { deps } = makeDeps({ loadEntry: () => Promise.resolve(null) });
  const res = await handleAnalyze(post({ entryId: "someone-elses" }), deps);
  assertEquals(res.status, 404);
});

Deno.test("malformed request body is a 400", async () => {
  const { deps } = makeDeps();
  assertEquals((await handleAnalyze(post({ nope: 1 }), deps)).status, 400);
  const bad = new Request("http://fn", { method: "POST", headers: { authorization: "Bearer t" }, body: "not json" });
  assertEquals((await handleAnalyze(bad, deps)).status, 400);
});

Deno.test("only POST is allowed", async () => {
  const { deps } = makeDeps();
  const res = await handleAnalyze(new Request("http://fn", { method: "GET" }), deps);
  assertEquals(res.status, 405);
});

Deno.test("secrets and raw journal text never appear in responses or logs", async () => {
  Deno.env.set("AI_PROVIDER_API_KEY", SECRET);
  const { deps, logs } = makeDeps();
  for (const body of [{ entryId: "entry-1" }, { entryId: "missing" }, { bad: true }]) {
    const res = await handleAnalyze(post(body), deps);
    assertFalse((await res.text()).includes(SECRET));
  }
  const all = logs.join("\n");
  assertFalse(all.includes(SECRET));
  assertFalse(all.includes("synthetic entry text"));
  Deno.env.delete("AI_PROVIDER_API_KEY");
});

Deno.test("CORS preflight succeeds for browser (web) clients", async () => {
  const { deps } = makeDeps();
  const res = await handleAnalyze(new Request("http://fn", { method: "OPTIONS" }), deps);
  assertEquals(res.status, 204);
  assert(res.headers.get("access-control-allow-headers")?.includes("authorization"));
});
