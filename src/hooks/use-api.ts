"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ApiError } from "@/lib/api";

/**
 * A tiny data-fetching layer (no extra dependency):
 *  - a module-level cache keyed by string, shared across components/pages
 *  - request de-duplication (many components can ask for "tracks" at once)
 *  - stale-while-revalidate with a 5 minute TTL
 *  - exposed to React through useSyncExternalStore (concurrent-safe, and no
 *    setState-in-effect)
 */

type Status = "idle" | "loading" | "success" | "error";

interface Entry {
  status: Status;
  data?: unknown;
  error?: ApiError;
  updatedAt: number;
  refreshing: boolean;
}

const IDLE: Entry = { status: "idle", updatedAt: 0, refreshing: false };
const CACHE_TTL_MS = 5 * 60 * 1000;

const entries = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();

function write(key: string, entry: Entry): void {
  entries.set(key, entry);
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribeTo(key: string, listener: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => {
    set.delete(listener);
  };
}

function load<T>(key: string, fetcher: () => Promise<T>, force: boolean): void {
  const current = entries.get(key);

  // Already in flight.
  if (current?.status === "loading" || current?.refreshing) return;
  // Fresh enough.
  if (
    !force &&
    current?.status === "success" &&
    Date.now() - current.updatedAt < CACHE_TTL_MS
  ) {
    return;
  }

  write(
    key,
    current?.data !== undefined
      ? { ...current, refreshing: true }
      : { status: "loading", updatedAt: 0, refreshing: false },
  );

  fetcher()
    .then((data) => {
      write(key, { status: "success", data, updatedAt: Date.now(), refreshing: false });
    })
    .catch((raised: unknown) => {
      const error =
        raised instanceof ApiError
          ? raised
          : new ApiError("network", raised instanceof Error ? raised.message : "Unknown error");
      write(key, {
        status: "error",
        error,
        data: current?.data,
        updatedAt: current?.updatedAt ?? 0,
        refreshing: false,
      });
    });
}

export interface ApiQuery<T> {
  data: T | undefined;
  error: ApiError | undefined;
  /** No data yet and no error: show a skeleton. */
  isLoading: boolean;
  /** The last request failed (data may still be present from an older fetch). */
  isError: boolean;
  /** A background refresh is running while older data is displayed. */
  isRefreshing: boolean;
  refetch: () => void;
}

/**
 * @param key     unique cache key, e.g. "tracks" or `track:${id}`
 * @param fetcher a *stable* function returning the data (module-level
 *                functions from lib/api.ts, or a useCallback)
 */
export function useApi<T>(key: string, fetcher: () => Promise<T>): ApiQuery<T> {
  const subscribe = useCallback(
    (listener: () => void) => subscribeTo(key, listener),
    [key],
  );
  const getSnapshot = useCallback(() => entries.get(key) ?? IDLE, [key]);
  const entry = useSyncExternalStore(subscribe, getSnapshot, () => IDLE);

  useEffect(() => {
    load(key, fetcher, false);
  }, [key, fetcher]);

  const refetch = useCallback(() => load(key, fetcher, true), [key, fetcher]);

  const data = entry.data as T | undefined;

  return {
    data,
    error: entry.error,
    isLoading: data === undefined && entry.status !== "error",
    isError: entry.status === "error",
    isRefreshing: entry.refreshing,
    refetch,
  };
}
