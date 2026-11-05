"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntityIcon } from "@/components/shared/entity-icon";
import { Illustration, hasIllustration } from "@/components/shared/illustration";
import { useApi } from "@/hooks/use-api";
import { getTrack } from "@/lib/api";
import type { Track } from "@/lib/types";
import { safeColor } from "@/lib/utils";

/**
 * Body of the track detail dialog. It renders immediately from the list data
 * and upgrades to the /tracks/:id response when that arrives. If the detail
 * request fails the list data is already enough, so no error UI is needed.
 */
export function TrackDialogBody({ track }: { track: Track }) {
  const fetchDetail = React.useCallback(() => getTrack(track.id), [track.id]);
  const detail = useApi(`track:${track.id}`, fetchDetail);
  const info = detail.data ?? track;

  const color = safeColor(info.color);

  return (
    <>
      <div
        aria-hidden="true"
        className="mb-5 grid size-24 place-items-center rounded-2xl"
        style={{
          color,
          background: `color-mix(in srgb, ${color} 16%, white)`,
        }}
      >
        {hasIllustration(info.id) ? (
          <Illustration id={info.id} className="h-full w-full object-contain p-1" />
        ) : (
          <EntityIcon id={info.id} className="size-8" strokeWidth={1.6} />
        )}
      </div>

      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={info.open ? "green" : "neutral"}>{info.open ? "Open to join" : "Closed"}</Badge>
          <Badge variant="blue">{info.tagline}</Badge>
        </div>
        <DialogTitle className="mt-1">{info.name}</DialogTitle>
        <DialogDescription>{info.description}</DialogDescription>
      </DialogHeader>

      {info.what_you_do ? (
        <section className="mt-6">
          <h4 className="text-sm font-semibold text-ink">In practice</h4>
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{info.what_you_do}</p>
        </section>
      ) : null}

      {info.skills.length > 0 ? (
        <section className="mt-6">
          <h4 className="text-sm font-semibold text-ink">Skills you&apos;ll grow</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {info.skills.map((skill) => (
              <li key={skill}>
                <Badge variant="outline">{skill}</Badge>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="sm:flex-1">
          <Link href="/contact?category=joining-learning">
            Ask about this track
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <DialogClose asChild>
          <Button variant="outline" className="sm:flex-1">
            Keep exploring
          </Button>
        </DialogClose>
      </div>
    </>
  );
}