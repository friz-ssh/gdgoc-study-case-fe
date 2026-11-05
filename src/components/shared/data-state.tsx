"use client";

import * as React from "react";
import { describeError } from "@/lib/api";
import type { ApiQuery } from "@/hooks/use-api";
import { ErrorBoundary } from "./error-boundary";
import { EmptyState, ErrorState } from "./states";

interface DataStateProps<T> {
  query: ApiQuery<T>;
  /** Shown while the first request is in flight. */
  skeleton: React.ReactNode;
  /** Defaults to "empty array". */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: (data: T) => React.ReactNode;
}

/**
 * One place that implements every data-fetching state the brief asks for:
 * loading indicator, error (with retry), empty fallback, and a render-error
 * boundary around the success view.
 */
export function DataState<T>({
  query,
  skeleton,
  isEmpty,
  emptyTitle = "Nothing here yet",
  emptyMessage = "Check back soon. New things are added all the time.",
  children,
}: DataStateProps<T>) {
  const { data, error, isLoading, isRefreshing, refetch } = query;

  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading…</span>
        {skeleton}
      </div>
    );
  }

  if (data === undefined) {
    const { title, message } = describeError(error);
    return <ErrorState title={title} message={message} onRetry={refetch} retrying={isRefreshing} />;
  }

  const empty = isEmpty ? isEmpty(data) : Array.isArray(data) && data.length === 0;
  if (empty) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ErrorBoundary
      fallback={(_error, reset) => (
        <ErrorState
          title="This section hit a snag"
          message="Something in the data didn't look right, so we paused this section."
          onRetry={reset}
        />
      )}
    >
      {children(data)}
    </ErrorBoundary>
  );
}
