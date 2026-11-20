import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isSubmittable } from './validation';

// A saved record. The text is exactly what the user typed (D-31: the original is never
// rewritten). `emotions` is empty on a plain save (D-32); the user is the final interpreter,
// so nothing is ever filled in for them.
export type JournalRecord = {
  readonly id: string;
  readonly text: string;
  readonly emotions: readonly string[];
  readonly createdAt: Date;
};

type RecordsContextValue = {
  // Newest first.
  records: readonly JournalRecord[];
  // Returns the new record, or null when the text is empty or only whitespace.
  addRecord: (text: string) => JournalRecord | null;
};

const RecordsContext = createContext<RecordsContextValue | null>(null);

// Records live in memory only (ADR-0003): they vanish when the app closes. Persistence needs
// its own design (data model, privacy, deletion D-30).
export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<readonly JournalRecord[]>([]);
  const counter = useRef(0);

  const addRecord = useCallback((text: string) => {
    if (!isSubmittable(text)) return null;
    counter.current += 1;
    // Local ids only: time + a per-session counter + a random part. No dependency needed.
    const id = `${Date.now().toString(36)}-${counter.current}-${Math.random().toString(36).slice(2, 8)}`;
    const record: JournalRecord = { id, text, emotions: [], createdAt: new Date() };
    setRecords((previous) => [record, ...previous]);
    return record;
  }, []);

  const value = useMemo(() => ({ records, addRecord }), [records, addRecord]);
  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords(): RecordsContextValue {
  const value = useContext(RecordsContext);
  if (!value) throw new Error('useRecords must be used inside RecordsProvider');
  return value;
}
