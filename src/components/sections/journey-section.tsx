"use client";

import { DataState } from "@/components/shared/data-state";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { Skeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getJourney } from "@/lib/api";

/** Blue, red, amber, green: one Google colour per step. */
const STEP_COLORS = ["#4285F4", "#EA4335", "#E37400", "#1E8E3E"] as const;

/** The numbered learning journey from /journey. */
export function JourneySteps() {
  const journey = useApi("journey", getJourney);

  return (
    <DataState
      query={journey}
      skeleton={
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      }
      emptyTitle="Your journey is being mapped out"
    >
      {(steps) => (
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[...steps]
            .sort((a, b) => a.step - b.step)
            .map((step, index) => (
              <li key={step.id}>
                <Reveal delay={stagger(index)}>
                  <p
                    aria-hidden="true"
                    className="text-[2rem] leading-none font-semibold tracking-tight"
                    style={{ color: STEP_COLORS[index % STEP_COLORS.length] }}
                  >
                    {String(step.step).padStart(2, "0")}
                  </p>
                  <div className="mt-5 border-t border-line pt-5">
                    <h3 className="text-xl font-semibold tracking-tight">
                      <span className="sr-only">Step {step.step}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
        </ol>
      )}
    </DataState>
  );
}
