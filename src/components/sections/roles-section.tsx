"use client";

import { DataState } from "@/components/shared/data-state";
import { iconFor } from "@/components/shared/icon-map";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { ArrowLink } from "@/components/shared/section-heading";
import { ListSkeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getRoles, getStats } from "@/lib/api";
import { buildSocialLinks, resolveCta } from "@/lib/content";

/** The ways to take part, from /roles. Each row's CTA slug is resolved to a real link. */
export function RolesSection() {
  const roles = useApi("roles", getRoles);
  const stats = useApi("stats", getStats);
  const instagramUrl = buildSocialLinks(stats.data?.social).instagram.url;

  return (
    <DataState query={roles} skeleton={<ListSkeleton rows={3} />} emptyTitle="Roles are being defined">
      {(items) => (
        <ul className="border-t border-line">
          {items.map((role, index) => {
            const Icon = iconFor(role.id);
            const cta = resolveCta(role.cta, instagramUrl);
            return (
              <li key={role.id} className="border-b border-line">
                <Reveal delay={stagger(index)} className="flex gap-4 py-6">
                  <span
                    aria-hidden="true"
                    className="mt-1 hidden size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand sm:grid"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{role.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                      {role.description}
                    </p>
                    <ArrowLink href={cta.href} external={cta.external} className="mt-1">
                      {cta.label}
                    </ArrowLink>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
    </DataState>
  );
}
