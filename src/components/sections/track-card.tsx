"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityIcon } from "@/components/shared/entity-icon";
import { Illustration, hasIllustration } from "@/components/shared/illustration";
import { TRACK_EYEBROW } from "@/lib/content";
import type { Track } from "@/lib/types";
import { cn, safeColor, safeInternalHref } from "@/lib/utils";

/** Tinted illustration panel for a track, driven by the colour in the API. */
export function TrackVisual({ track, className }: { track: Track; className?: string }) {
  const color = safeColor(track.color);

  return (
    <div
      aria-hidden="true"
      className={cn("relative grid h-52 place-items-center overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${color} 24%, white), color-mix(in srgb, ${color} 6%, white))`,
      }}
    >
      <div
        className="absolute -top-10 -right-8 size-44 rounded-full opacity-40 blur-3xl"
        style={{ backgroundColor: color }}
      />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative size-60"
        style={{ color }}
      >
        {hasIllustration(track.id) ? (
          <Illustration id={track.id} className="h-full w-full object-contain" />
        ) : (
          <EntityIcon id={track.id} className="size-full p-6" strokeWidth={1.5} />
        )}
      </motion.div>
    </div>
  );
}

interface TrackCardProps {
  track: Track;
  /** Do not jump to the top of the page when following the link. */
  keepScroll?: boolean;
}

export function TrackCard({ track, keepScroll }: TrackCardProps) {
  const href = safeInternalHref(track.explore_link, `/overview?track=${track.id}`);
  const skills = track.skills.slice(0, 3).join(" · ");

  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift">
      <TrackVisual track={track} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.6875rem] font-semibold tracking-[0.06em] text-brand uppercase">
            {TRACK_EYEBROW[track.id] ?? track.tagline}
          </p>
          {!track.open ? <Badge variant="neutral">Closed</Badge> : null}
        </div>

        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{track.name}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{track.description}</p>

        {skills ? (
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">{skills}</p>
        ) : null}

        <Link
          href={href}
          scroll={keepScroll ? false : undefined}
          aria-label={`Explore the ${track.name} track`}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-[0.9375rem] font-medium text-brand after:absolute after:inset-0 after:content-['']"
        >
          Explore this track
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover/card:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}