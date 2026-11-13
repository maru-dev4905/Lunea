import { z } from "npm:zod@4.6.7";

// PoC version of the AI output contract (final contract: AI-01 / LUN-22).
// The version is part of the payload so old and new shapes can coexist.
export const SCHEMA_VERSION = 1 as const;

export const candidateSchema = z.object({
  label: z.string().min(1).max(50),
  // Quote or paraphrase from the entry that supports the candidate (evidence-based).
  evidence: z.string().min(1).max(500),
});

export const analysisSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  candidates: z.array(candidateSchema).max(8),
});

export const requestSchema = z.object({ entryId: z.string().min(1) });

export type Candidate = z.infer<typeof candidateSchema>;
export type Analysis = z.infer<typeof analysisSchema>;
