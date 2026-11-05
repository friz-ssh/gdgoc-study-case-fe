"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Reveal } from "./reveal";

/** Four-point sparkle used in the design as a friendly accent. */
function Sparkle({ className, color }: { className?: string; color: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      animate={{ rotate: [0, 12, 0, -12, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M12 0C12.9 6.8 17.2 11.1 24 12C17.2 12.9 12.9 17.2 12 24C11.1 17.2 6.8 12.9 0 12C6.8 11.1 11.1 6.8 12 0Z"
        fill={color}
      />
    </motion.svg>
  );
}

interface CalloutProps {
  tone: "cream" | "mint";
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Optional trailing slot (link / button). */
  action?: React.ReactNode;
  eyebrow?: string;
  /** Show the sparkle accent (default) or lay out as heading + text columns. */
  layout?: "sparkle" | "split";
}

/** Full-width coloured band used for friendly asides. */
export function Callout({ tone, title, children, action, eyebrow, layout = "sparkle" }: CalloutProps) {
  const background = tone === "cream" ? "bg-cream" : "bg-mint";

  if (layout === "split") {
    return (
      <section className={cn("py-14 sm:py-20", background)}>
        <Container>
          <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              {eyebrow ? (
                <p className="mb-4 flex items-center gap-2 text-[0.6875rem] font-medium tracking-[0.06em] text-muted uppercase">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-action" />
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] font-semibold tracking-tight">
                {title}
              </h2>
            </div>
            <div className="self-center">
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">{children}</p>
              {action ? <div className="mt-3">{action}</div> : null}
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className={cn("py-12 sm:py-16", background)}>
      <Container>
        <Reveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <Sparkle
            className="size-14 shrink-0 sm:size-[4.5rem]"
            color={tone === "cream" ? "#fbbc04" : "#34a853"}
          />
          <div className="max-w-3xl">
            <h2 className="text-balance text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] font-semibold tracking-tight">
              {title}
            </h2>
            {children ? (
              <p className="mt-3 text-pretty text-base leading-relaxed text-muted sm:text-lg">{children}</p>
            ) : null}
            {action ? <div className="mt-2">{action}</div> : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
