"use client";

import { DataState } from "@/components/shared/data-state";
import { iconFor } from "@/components/shared/icon-map";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { ArrowLink } from "@/components/shared/section-heading";
import { useApi } from "@/hooks/use-api";
import { getFormats, getStats } from "@/lib/api";
import { FORMAT_BEST_FOR, buildSocialLinks, resolveCta } from "@/lib/content";
import { cn } from "@/lib/utils";

const TILE_TONES = [
  "bg-brand-soft text-brand",
  "bg-mint text-[#137333]",
  "bg-cream text-[#b06000]",
  "bg-[#fce8e6] text-[#c5221f]",
] as const;

/** Learning formats from /formats. `columns` controls the desktop grid. */
export function FormatsSection({ columns = 2 }: { columns?: 2 | 4 }) {
  const formats = useApi("formats", getFormats);
  const stats = useApi("stats", getStats);
  const instagramUrl = buildSocialLinks(stats.data?.social).instagram.url;

  return (
    <DataState
      query={formats}
      skeleton={
        <CardGridSkeleton
          count={4}
          className={cn("md:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2")}
          cardClassName="h-56"
        />
      }
      emptyTitle="Learning formats are coming soon"
    >
      {(items) => (
        <ul
          className={cn(
            "grid gap-5 md:grid-cols-2",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2",
          )}
        >
          {items.map((format, index) => {
            const Icon = iconFor(format.id);
            const cta = resolveCta(format.cta, instagramUrl);
            const bestFor = FORMAT_BEST_FOR[format.id];
            return (
              <li key={format.id}>
                <Reveal delay={stagger(index)} className="h-full">
                  <article className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-11 place-items-center rounded-xl",
                        TILE_TONES[index % TILE_TONES.length],
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">{format.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                      {format.description}
                    </p>
                    {bestFor ? (
                      <p className="mt-4 border-t border-line pt-4 text-xs text-brand">
                        Best for • {bestFor}
                      </p>
                    ) : null}
                    <ArrowLink href={cta.href} external={cta.external} className="mt-auto pt-2">
                      {cta.label}
                    </ArrowLink>
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
