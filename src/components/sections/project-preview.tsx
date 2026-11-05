"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeXml } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "discover",
    label: "Discover",
    tone: "bg-brand-soft text-brand",
    line: "Start with a student need. Notice the small frictions around campus.",
  },
  {
    id: "connect",
    label: "Connect",
    tone: "bg-mint text-[#137333]",
    line: "Find a few people who care about the same problem and see it differently.",
  },
  {
    id: "share",
    label: "Share",
    tone: "bg-[#fce8e6] text-[#c5221f]",
    line: "Build a small, useful solution, then show it and learn from feedback.",
  },
] as const;

/** Interactive "idea -> prototype" card used in the Home project teaser. */
export function ProjectPreview() {
  const [active, setActive] = React.useState<(typeof STEPS)[number]["id"]>("discover");
  const current = STEPS.find((step) => step.id === active) ?? STEPS[0];

  return (
    <div className="rounded-[2rem] bg-cream p-5 sm:p-8">
      <div className="flex items-center justify-between text-[0.6875rem] font-medium tracking-[0.06em] text-muted uppercase">
        <span>Idea → Prototype</span>
        <CodeXml aria-hidden="true" className="size-4 text-brand" />
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-g-red" />
          <span className="size-2.5 rounded-full bg-g-yellow" />
          <span className="size-2.5 rounded-full bg-g-green" />
        </div>

        <h3 className="mt-5 text-2xl leading-tight font-semibold tracking-tight">
          A little less friction.
          <br />A better campus day.
        </h3>

        <div role="tablist" aria-label="From idea to prototype" className="mt-5 flex flex-wrap gap-2">
          {STEPS.map((step) => {
            const selected = step.id === active;
            return (
              <button
                key={step.id}
                id={`project-tab-${step.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="project-tabpanel"
                onClick={() => setActive(step.id)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-lg px-4 text-sm font-medium transition-[background-color,color,box-shadow]",
                  selected ? cn(step.tone, "shadow-sm") : "bg-surface text-muted hover:bg-brand-soft",
                )}
              >
                {step.label}
              </button>
            );
          })}
        </div>

        <div
          id="project-tabpanel"
          role="tabpanel"
          aria-labelledby={`project-tab-${active}`}
          className="mt-5 min-h-14"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm leading-relaxed text-muted"
            >
              {current.line}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-[0.6875rem] tracking-[0.06em] text-muted uppercase">
        Example project brief · not a launched product
      </p>
    </div>
  );
}
