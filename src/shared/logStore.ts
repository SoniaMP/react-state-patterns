export type PatternKey = "context" | "pureContext" | "external" | "zustand";

export type LogEntry = {
  id: number;
  time: string;
  action: string;
  counts: Record<PatternKey, number>;
};

let entries: LogEntry[] = [];
const listeners = new Set<() => void>();

let currentEntry: LogEntry | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let nextId = 0;

/** Dedup set to ignore StrictMode double-fire of effects. */
let reportedCells = new Set<string>();

function emit() {
  for (const l of listeners) l();
}

function closeEntry() {
  if (!currentEntry) return;
  if (closeTimer !== null) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  entries = [currentEntry, ...entries].slice(0, 50);
  currentEntry = null;
  reportedCells = new Set();
  emit();
}

/** Call BEFORE dispatching to any store. */
export function logAction(action: string) {
  if (currentEntry) closeEntry();
  reportedCells = new Set();
  currentEntry = {
    id: nextId++,
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    action,
    counts: { context: 0, pureContext: 0, external: 0, zustand: 0 },
  };
  closeTimer = setTimeout(closeEntry, 120);
}

/** Call from each cell's useEffect. */
export function logRender(pattern: PatternKey, cellId: string) {
  if (!currentEntry) return;
  const key = `${pattern}:${cellId}`;
  if (reportedCells.has(key)) return;
  reportedCells.add(key);
  currentEntry.counts[pattern]++;
  if (closeTimer !== null) clearTimeout(closeTimer);
  closeTimer = setTimeout(closeEntry, 60);
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot() {
  return entries;
}

export function clearLog() {
  entries = [];
  emit();
}
