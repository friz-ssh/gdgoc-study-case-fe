"use client";

import { DataState } from "@/components/shared/data-state";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getTracks } from "@/lib/api";
import { TrackCard } from "./track-card";

/** The three learning tracks, straight from /tracks (used on Home). */
export function TracksPreview() {
  const tracks = useApi("tracks", getTracks);

  return (
    <DataState
      query={tracks}
      skeleton={<CardGridSkeleton count={3} cardClassName="h-[28rem]" />}
      emptyTitle="Tracks are coming soon"
      emptyMessage="We're preparing the next set of learning tracks. Follow our updates to hear first."
    >
      {(items) => (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((track, index) => (
            <li key={track.id} className="md:last:odd:col-span-2 lg:last:odd:col-span-1">
              <Reveal delay={stagger(index)} className="h-full">
                <TrackCard track={track} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </DataState>
  );
}
