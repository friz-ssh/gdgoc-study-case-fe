import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-2xl bg-surface", className)}
      {...props}
    />
  );
}

/** A responsive grid of card-shaped skeletons. */
export function CardGridSkeleton({
  count = 3,
  className,
  cardClassName,
}: {
  count?: number;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={cn("h-72 rounded-card", cardClassName)} />
      ))}
    </div>
  );
}

/** A stack of list-row skeletons. */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}
