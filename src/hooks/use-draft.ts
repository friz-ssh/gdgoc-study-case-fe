"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Persists the contact-form draft in localStorage so a refresh (or an
 * accidental tab close) does not lose a half-written message.
 *
 * Implemented as an external store so React can read it with
 * useSyncExternalStore: server render + hydration use the empty defaults, the
 * stored draft appears right after hydration, and no setState-in-effect is
 * needed. An in-memory copy keeps the form working when storage is blocked
 * (private mode, strict browser settings).
 */

export interface Draft {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}

export const EMPTY_DRAFT: Draft = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  subject: "",
  message: "",
};

const STORAGE_KEY = "gdgoc-ugm:contact-draft:v1";

let memory: string | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function readSnapshot(): string | null {
  if (!hydrated) {
    hydrated = true;
    try {
      memory = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      memory = null;
    }
  }
  return memory;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      memory = event.newValue;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function parse(raw: string | null): Draft {
  if (!raw) return EMPTY_DRAFT;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return EMPTY_DRAFT;
    const record = value as Record<string, unknown>;
    const next = { ...EMPTY_DRAFT };
    for (const key of Object.keys(EMPTY_DRAFT) as Array<keyof Draft>) {
      if (typeof record[key] === "string") next[key] = record[key];
    }
    return next;
  } catch {
    return EMPTY_DRAFT;
  }
}

export function useDraft() {
  const raw = useSyncExternalStore(subscribe, readSnapshot, () => null);
  const draft = useMemo(() => parse(raw), [raw]);

  const updateDraft = useCallback((patch: Partial<Draft>) => {
    readSnapshot();
    memory = JSON.stringify({ ...parse(memory), ...patch });
    try {
      window.localStorage.setItem(STORAGE_KEY, memory);
    } catch {
      /* storage unavailable: the in-memory copy still works */
    }
    emit();
  }, []);

  const clearDraft = useCallback(() => {
    hydrated = true;
    memory = null;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  return { draft, updateDraft, clearDraft };
}
