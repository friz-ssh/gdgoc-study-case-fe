import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Figma illustrations keyed by track id, with their native size. */
const ART = {
  development: { src: "/illustrations/hacker.svg", width: 354, height: 316 },
  "research-discovery": { src: "/illustrations/hustler.svg", width: 335, height: 305 },
  "design-creativity": { src: "/illustrations/hipster.svg", width: 350, height: 316 },
} as const;

/** The glow in the artwork is cropped at the file edge; fade it out instead of showing a hard line. */
const FADE = "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)";
const FADE_Y = "linear-gradient(to bottom, #000 82%, transparent)";
const FEATHER = {
  maskImage: `${FADE}, ${FADE_Y}`,
  WebkitMaskImage: `${FADE}, ${FADE_Y}`,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as React.CSSProperties;

export type IllustrationId = keyof typeof ART;

export function hasIllustration(id: string): id is IllustrationId {
  return id in ART;
}

/**
 * Static SVG, rendered as an image: the browser paints it once, so the heavy
 * shadow filters inside the file cost nothing per frame. `unoptimized` keeps
 * the markup identical on server and client.
 */
export function Illustration({
  id,
  className,
  priority = false,
}: {
  id: IllustrationId;
  className?: string;
  /** Preload: set for art that is part of the first screen (helps LCP). */
  priority?: boolean;
}) {
  const art = ART[id];
  return (
    <Image
      src={art.src}
      alt=""
      width={art.width}
      height={art.height}
      unoptimized
      priority={priority}
      className={cn("h-auto w-full select-none", className)}
      style={FEATHER}
    />
  );
}