"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataState } from "@/components/shared/data-state";
import { EmptyState } from "@/components/shared/states";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { useApi } from "@/hooks/use-api";
import { getTracks } from "@/lib/api";
import type { Track } from "@/lib/types";
import { TrackCard } from "./track-card";
import { TrackDialogBody } from "./track-dialog";

type SortKey = "default" | "name-asc" | "name-desc";

const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: "default", label: "Suggested order" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

function parseSort(value: string | null): SortKey {
  return value === "name-asc" || value === "name-desc" ? value : "default";
}

function matches(track: Track, needle: string): boolean {
  if (!needle) return true;
  return [track.name, track.tagline, track.description, ...track.skills].some((text) =>
    text.toLowerCase().includes(needle),
  );
}

/**
 * Filter + sort + detail dialog for the tracks. All of it lives in the URL
 * (?q=, ?sort=, ?track=) so a filtered view can be shared, survives a reload,
 * and the browser back button behaves.
 */
function TracksExplorerContent({ tracks }: { tracks: Track[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = parseSort(searchParams.get("sort"));
  const trackId = searchParams.get("track");

  const [search, setSearch] = React.useState(searchParams.get("q") ?? "");
  const debounce = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Merge changes into the *current* URL (read at call time, never stale). */
  const updateParams = React.useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  function onSearchChange(value: string) {
    setSearch(value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => updateParams({ q: value.trim() || null }), 250);
  }

  function clearFilters() {
    clearTimeout(debounce.current);
    setSearch("");
    updateParams({ q: null, sort: null });
  }

  const needle = search.trim().toLowerCase();
  let visible = tracks.filter((track) => matches(track, needle));
  if (sort === "name-asc") visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") visible = [...visible].sort((a, b) => b.name.localeCompare(a.name));

  const filtersActive = needle.length > 0 || sort !== "default";
  const selected = tracks.find((track) => track.id === trackId);

  // Keep the last opened track so the dialog content doesn't vanish mid-close.
  const [lastSelected, setLastSelected] = React.useState<Track | null>(null);
  if (selected && selected !== lastSelected) setLastSelected(selected);
  const dialogTrack = selected ?? lastSelected;

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="track-search" className="sr-only">
            Search tracks
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id="track-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by track, skill, or interest"
            className="min-h-11 w-full rounded-xl border border-line bg-white pr-4 pl-10 text-base text-ink placeholder:text-[#80868b] focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
          />
        </div>

        <div className="relative sm:w-56">
          <label htmlFor="track-sort" className="sr-only">
            Sort tracks
          </label>
          <ListFilter
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <select
            id="track-sort"
            value={sort}
            onChange={(event) =>
              updateParams({ sort: event.target.value === "default" ? null : event.target.value })
            }
            className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-white pr-4 pl-10 text-base text-ink focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filtersActive ? (
          <Button variant="ghost" onClick={clearFilters}>
            <X aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} of {tracks.length} tracks
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="No tracks match that search"
          message="Try a different word, such as a skill (“Figma”) or an interest (“research”)."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear search
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((track, index) => (
            <li key={track.id} className="md:last:odd:col-span-2 lg:last:odd:col-span-1">
              <Reveal delay={stagger(index)} className="h-full">
                <TrackCard track={track} keepScroll />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) updateParams({ track: null });
        }}
      >
        <DialogContent>{dialogTrack ? <TrackDialogBody track={dialogTrack} /> : null}</DialogContent>
      </Dialog>
    </>
  );
}

export function TracksExplorer() {
  const tracks = useApi("tracks", getTracks);

  return (
    <DataState
      query={tracks}
      skeleton={<CardGridSkeleton count={3} cardClassName="h-[28rem]" />}
      emptyTitle="Tracks are coming soon"
      emptyMessage="We're preparing the next set of learning tracks. Follow our updates to hear first."
    >
      {(items) => <TracksExplorerContent tracks={items} />}
    </DataState>
  );
}
