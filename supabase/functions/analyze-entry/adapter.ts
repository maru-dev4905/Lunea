// Server-side AI adapter boundary (ADR-0006). Only a deterministic mock exists
// until the provider is decided (D-08). A real adapter would read its API key
// from the function environment (never from the client).
export interface AiAdapter {
  // Returns untrusted data: the caller must validate it against the schema.
  analyze(entryText: string): Promise<unknown>;
}

export const mockAdapter: AiAdapter = {
  analyze(entryText: string) {
    return Promise.resolve({
      schemaVersion: 1,
      candidates: [
        { label: "calm", evidence: entryText.slice(0, 40) || "(empty)" },
        { label: "tired", evidence: entryText.slice(0, 40) || "(empty)" },
      ],
    });
  },
};
