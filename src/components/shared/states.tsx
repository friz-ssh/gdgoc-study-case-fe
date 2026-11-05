import * as React from "react";
import { Inbox, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorState({ title, message, onRetry, retrying, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-card border border-[#f6c7c3] bg-[#fef1f0] px-6 py-10 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-white text-g-red shadow-sm">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-[0.9375rem] text-muted">{message}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry} disabled={retrying}>
          <RefreshCw className={cn(retrying && "animate-spin")} aria-hidden="true" />
          {retrying ? "Retrying…" : "Try again"}
        </Button>
      ) : null}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-white text-muted shadow-sm">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      {message ? <p className="mt-1 max-w-md text-[0.9375rem] text-muted">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
