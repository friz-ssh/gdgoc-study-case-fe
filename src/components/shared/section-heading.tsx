import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[0.6875rem] font-medium tracking-[0.06em] text-muted uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-action" />
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight text-ink",
          eyebrow && "mt-4",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  scroll?: boolean;
}

/** Text link with a trailing arrow that nudges on hover. */
export function ArrowLink({ href, children, external, className, scroll }: ArrowLinkProps) {
  const classes = cn(
    "group/link inline-flex min-h-11 items-center gap-2 rounded-md text-[0.9375rem] font-medium text-brand",
    className,
  );
  const arrow = (
    <ArrowRight
      aria-hidden="true"
      className="size-4 transition-transform duration-200 group-hover/link:translate-x-1"
    />
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} scroll={scroll} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
