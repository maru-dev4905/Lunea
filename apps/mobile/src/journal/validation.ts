// A record can be submitted only when it holds something other than whitespace.
// The text itself is never modified here: the original is preserved as typed.
export function isSubmittable(text: string): boolean {
  return text.trim().length > 0;
}
