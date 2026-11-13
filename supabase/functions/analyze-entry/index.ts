import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { mockAdapter } from "./adapter.ts";
import { handleAnalyze } from "./handler.ts";

// Secrets (e.g. AI_PROVIDER_API_KEY) are read here, on the server, only.
Deno.serve((req) => {
  const authorization = req.headers.get("authorization") ?? "";
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });

  return handleAnalyze(req, {
    async getUserId() {
      const token = authorization.replace(/^Bearer /i, "");
      if (!token) return null;
      const { data } = await db.auth.getUser(token);
      return data.user?.id ?? null;
    },
    async loadEntry(id) {
      const { data, error } = await db.from("journal_entries").select("id, body").eq("id", id).maybeSingle();
      if (error) throw new Error("load_failed");
      return data;
    },
    async saveCandidates(entryId, candidates) {
      const { error } = await db
        .from("emotion_candidates")
        .insert(candidates.map((c) => ({ entry_id: entryId, label: c.label, evidence: c.evidence })));
      if (error) throw new Error("save_failed");
    },
    adapter: mockAdapter, // AI_PROVIDER=mock until D-08
    log: (line) => console.log(line),
  });
});
