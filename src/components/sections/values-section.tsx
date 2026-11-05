"use client";

import { DataState } from "@/components/shared/data-state";
import { iconFor } from "@/components/shared/icon-map";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getValues } from "@/lib/api";
import { safeColor } from "@/lib/utils";

/** The four guiding values from /values; each card is tinted by its API colour. */
export function ValuesSection() {
  const values = useApi("values", getValues);

  return (
    <DataState
      query={values}
      skeleton={
        <CardGridSkeleton count={4} className="lg:grid-cols-4" cardClassName="h-56" />
      }
      emptyTitle="Our values are being written"
    >
      {(items) => (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((value, index) => {
            const Icon = iconFor(value.id);
            const color = safeColor(value.color);
            return (
              <li key={value.id}>
                <Reveal delay={stagger(index)} className="h-full">
                  <article className="group/value flex h-full flex-col rounded-card border border-line bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span
                      aria-hidden="true"
                      className="h-1 w-8 rounded-full transition-[width] duration-300 group-hover/value:w-14"
                      style={{ backgroundColor: color }}
                    />
                    <Icon aria-hidden="true" className="mt-5 size-5 text-brand" strokeWidth={1.8} />
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">{value.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                      {value.description}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
    </DataState>
  );
}
