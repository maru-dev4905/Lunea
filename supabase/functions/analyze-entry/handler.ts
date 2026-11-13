import type { AiAdapter } from "./adapter.ts";
import { analysisSchema, type Candidate, requestSchema, SCHEMA_VERSION } from "./schema.ts";

export interface Deps {
  // Resolves the caller from the request's JWT; null when unauthenticated.
  getUserId(req: Request): Promise<string | null>;
  // Runs as the caller, so RLS hides entries owned by other users (returns null).
  loadEntry(id: string): Promise<{ id: string; body: string } | null>;
  saveCandidates(entryId: string, candidates: Candidate[]): Promise<void>;
  adapter: AiAdapter;
  // Log event codes only. Never log journal text or secrets.
  log(line: string): void;
}

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });

export async function handleAnalyze(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const userId = await deps.getUserId(req);
  if (!userId) return json(401, { error: "unauthorized" });

  let parsedBody: unknown;
  try {
    parsedBody = await req.json();
  } catch {
    return json(400, { error: "invalid_request" });
  }
  const request = requestSchema.safeParse(parsedBody);
  if (!request.success) return json(400, { error: "invalid_request" });

  const entry = await deps.loadEntry(request.data.entryId);
  if (!entry) return json(404, { error: "not_found" });

  let raw: unknown;
  try {
    raw = await deps.adapter.analyze(entry.body);
  } catch {
    deps.log("adapter_error");
    return json(502, { error: "ai_unavailable" });
  }

  // AI output is untrusted: reject anything that fails the versioned schema.
  // Nothing is written, so the original entry (the draft) stays exactly as it was.
  const analysis = analysisSchema.safeParse(raw);
  if (!analysis.success) {
    deps.log("invalid_ai_output");
    return json(422, { error: "invalid_ai_output" });
  }

  await deps.saveCandidates(entry.id, analysis.data.candidates);
  return json(200, { schemaVersion: SCHEMA_VERSION, candidates: analysis.data.candidates });
}
