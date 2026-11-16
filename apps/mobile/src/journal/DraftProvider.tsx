import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// The draft lives in memory only (ADR-0003: no state library, no device storage yet).
// It survives screen changes but not an app restart. Persistent storage needs its own design.
type DraftContextValue = {
  draft: string;
  setDraft: (text: string) => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState('');
  const value = useMemo(() => ({ draft, setDraft }), [draft]);
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftContextValue {
  const value = useContext(DraftContext);
  if (!value) throw new Error('useDraft must be used inside DraftProvider');
  return value;
}
