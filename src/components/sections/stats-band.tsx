"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { DataState } from "@/components/shared/data-state";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { Skeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getStats } from "@/lib/api";
import type { Stats } from "@/lib/types";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduceMotion) {
      node.textContent = value.toLocaleString("en-US");
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = Math.round(latest).toLocaleString("en-US");
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span aria-label={`${value.toLocaleString("en-US")}${suffix}`}>
      <span ref={ref} aria-hidden="true">
        0
      </span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

function StatsItems({ stats }: { stats: Stats }) {
  const items: ReadonlyArray<{ label: string; value: number; suffix?: string }> = [
    { label: "Community members", value: stats.community_members, suffix: "+" },
    { label: "Workshops held", value: stats.workshops_held, suffix: "+" },
    { label: "Projects shipped", value: stats.projects_shipped, suffix: "+" },
    { label: "Active learning tracks", value: stats.active_tracks },
  ];

  return (
    <>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.label} delay={stagger(index)} className="flex flex-col-reverse">
            <dt className="mt-2 text-sm text-muted">{item.label}</dt>
            <dd className="text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-tight text-ink">
              <CountUp value={item.value} suffix={item.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
      <p className="mt-8 text-sm text-muted">
        Student-led since {stats.founded_year} · {stats.university}, {stats.city}
      </p>
    </>
  );
}

/** Community numbers from /stats with a count-up animation. */
export function StatsBand() {
  const stats = useApi("stats", getStats);

  return (
    <section aria-label="Community in numbers" className="border-y border-line bg-surface/60 py-12 sm:py-16">
      <Container>
        <DataState
          query={stats}
          skeleton={
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          }
          isEmpty={() => false}
        >
          {(data) => <StatsItems stats={data} />}
        </DataState>
      </Container>
    </section>
  );
}
