"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

/**
 * Full-width home hero.
 *
 * Layers, bottom to top:
 *  1. soft Google-colour fields (CSS, compositor-only, paused off-screen),
 *  2. a white scrim behind the copy so text always stays readable,
 *  3. a canvas dot grid. Dots near the pointer grow and take their own Google
 *     colour; at the centre of the light they turn into code glyphs (< / >),
 *     echoing the </> in the GDG mark. A tap or click sends a wider pulse. One
 *     light sweep plays when the page opens so touch screens see the effect too,
 *  4. the hero copy (children), centred.
 *
 * A single canvas replaces hundreds of DOM nodes, and the rAF loop only runs
 * while something is changing, so an idle hero costs nothing. Decorative layers
 * are aria-hidden. The intro sweep and pulse respect prefers-reduced-motion.
 */

/** Order follows the logo: blue, red, yellow, green. */
const PALETTE = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;
const GLYPHS = ["<", "/", ">"] as const;
const REST_COLOR = "rgba(60, 64, 67, 0.26)";
const REST_RADIUS = 1.3;
const TAU = Math.PI * 2;
/** Above this light level a dot turns into a glyph. */
const GLYPH_THRESHOLD = 0.62;

/** Deterministic 0..1 noise so the colour mosaic is stable between renders. */
function noise(col: number, row: number): number {
  const value = Math.imul(col + 1, 73856093) ^ Math.imul(row + 1, 19349663);
  return ((value >>> 0) % 1000) / 1000;
}

function colorFor(col: number, row: number, cols: number, rows: number): string {
  const x = cols > 1 ? col / (cols - 1) : 0;
  const y = rows > 1 ? row / (rows - 1) : 0;
  const position = x * 0.72 + y * 0.28 + noise(col, row) * 0.22;
  const band = Math.min(PALETTE.length - 1, Math.floor((position / 1.1) * PALETTE.length));
  return PALETTE[band];
}

interface Blob {
  className: string;
  color: string;
  dx: string;
  dy: string;
  duration: number;
}

// Round on phones (sized in vw so a tall, narrow banner does not stretch them
// into vertical stripes), wide ovals from md up.
const BLOBS: Blob[] = [
  {
    className:
      "size-[78vw] -top-[6%] -left-[30%] md:size-auto md:h-[110%] md:w-[42%] md:-top-[40%] md:-left-[8%]",
    color: "#F28B82",
    dx: "10%",
    dy: "12%",
    duration: 11,
  },
  {
    className:
      "size-[80vw] top-[4%] -right-[36%] md:size-auto md:h-[115%] md:w-[44%] md:-top-[36%] md:-right-[8%]",
    color: "#8AB4F8",
    dx: "-9%",
    dy: "9%",
    duration: 13,
  },
  {
    className:
      "size-[76vw] bottom-[4%] -left-[28%] md:size-auto md:h-[115%] md:w-[42%] md:-bottom-[50%] md:left-[4%]",
    color: "#FDD663",
    dx: "12%",
    dy: "-10%",
    duration: 12,
  },
  {
    className:
      "size-[78vw] -bottom-[4%] -right-[32%] md:size-auto md:h-[110%] md:w-[42%] md:-right-[4%] md:-bottom-[46%]",
    color: "#81C995",
    dx: "-12%",
    dy: "-12%",
    duration: 14,
  },
];

export function HeroBanner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const inView = useInView(bannerRef, { margin: "100px 0px" });

  React.useEffect(() => {
    const banner = bannerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!banner || !canvas || !context) return;
    const ctx = context;

    let width = 0;
    let height = 0;
    let spacing = 28;
    let cols = 0;
    let rows = 0;
    let originX = 0;
    let originY = 0;
    let levels = new Float32Array(0);
    let colors: string[] = [];

    let pointerX = 0;
    let pointerY = 0;
    let active = false;
    let pulse = 0;
    let introStart = 0;
    let introPlayed = false;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Resting dots share one path: a single fill for most of the grid.
      ctx.fillStyle = REST_COLOR;
      ctx.beginPath();
      for (let i = 0; i < levels.length; i++) {
        if (levels[i] >= 0.02) continue;
        const x = originX + (i % cols) * spacing;
        const y = originY + Math.floor(i / cols) * spacing;
        ctx.moveTo(x + REST_RADIUS, y);
        ctx.arc(x, y, REST_RADIUS, 0, TAU);
      }
      ctx.fill();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        if (level < 0.02) continue;
        const col = i % cols;
        const x = originX + col * spacing;
        const y = originY + Math.floor(i / cols) * spacing;
        ctx.fillStyle = colors[i];
        if (level >= GLYPH_THRESHOLD) {
          const grow = (level - GLYPH_THRESHOLD) / (1 - GLYPH_THRESHOLD);
          ctx.globalAlpha = 1;
          ctx.font = `600 ${Math.round(14 + grow * 7)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          ctx.fillText(GLYPHS[col % GLYPHS.length], x, y);
        } else {
          ctx.globalAlpha = 0.3 + level * 0.7;
          ctx.beginPath();
          ctx.arc(x, y, REST_RADIUS + level * 3.6, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      frame = 0;
      let busy = false;

      if (introStart) {
        const t = (now - introStart) / 1500;
        if (t >= 1) {
          introStart = 0;
          active = false;
        } else {
          active = true;
          pointerX = -spacing * 3 + t * (width + spacing * 6);
          pointerY = height * 0.55 + Math.sin(t * Math.PI * 3) * height * 0.18;
          busy = true;
        }
      }

      if (pulse > 0.01) {
        pulse *= 0.9;
        busy = true;
      } else {
        pulse = 0;
      }
      const radius = spacing * 4.8 * (1 + pulse * 1.2);

      for (let i = 0; i < levels.length; i++) {
        let target = 0;
        if (active) {
          const distance = Math.hypot(
            originX + (i % cols) * spacing - pointerX,
            originY + Math.floor(i / cols) * spacing - pointerY,
          );
          if (distance < radius) target = (1 - distance / radius) ** 1.5;
        }
        const difference = target - levels[i];
        if (Math.abs(difference) < 0.003) {
          levels[i] = target;
        } else {
          levels[i] += difference * 0.2;
          busy = true;
        }
      }

      draw();
      if (busy) frame = requestAnimationFrame(step);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const layout = () => {
      const rect = banner.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      spacing = width < 640 ? 22 : 28;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      originX = (width - (cols - 1) * spacing) / 2;
      originY = (height - (rows - 1) * spacing) / 2;
      levels = new Float32Array(cols * rows);
      colors = Array.from({ length: cols * rows }, (_, i) =>
        colorFor(i % cols, Math.floor(i / cols), cols, rows),
      );
      draw();

      if (!introPlayed && !reduceMotion) {
        introPlayed = true;
        introStart = performance.now();
        kick();
      }
    };

    const track = (event: PointerEvent) => {
      const rect = banner.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };
    const onMove = (event: PointerEvent) => {
      introStart = 0;
      track(event);
      active = true;
      kick();
    };
    const onDown = (event: PointerEvent) => {
      introStart = 0;
      track(event);
      active = true;
      if (!reduceMotion) pulse = 1;
      kick();
    };
    const onRelease = (event: PointerEvent) => {
      // A finger has no hover: let the light fade once it lifts.
      if (event.pointerType !== "mouse") {
        active = false;
        kick();
      }
    };
    const onLeave = () => {
      active = false;
      kick();
    };

    const observer = new ResizeObserver(layout);
    observer.observe(banner);
    banner.addEventListener("pointermove", onMove);
    banner.addEventListener("pointerdown", onDown);
    banner.addEventListener("pointerup", onRelease);
    banner.addEventListener("pointercancel", onRelease);
    banner.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      banner.removeEventListener("pointermove", onMove);
      banner.removeEventListener("pointerdown", onDown);
      banner.removeEventListener("pointerup", onRelease);
      banner.removeEventListener("pointercancel", onRelease);
      banner.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={bannerRef}
      data-paused={!inView}
      className={cn("relative isolate w-full touch-pan-y overflow-hidden bg-[#f8fafe]", className)}
    >
      {/* 1 — soft Google colour fields */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {BLOBS.map((blob) => (
          <div
            key={blob.color}
            className={cn("hero-blob absolute rounded-full opacity-70", blob.className)}
            style={
              {
                background: `radial-gradient(closest-side, ${blob.color} 0%, ${blob.color}00 100%)`,
                "--dx": blob.dx,
                "--dy": blob.dy,
                "--dur": `${blob.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 2 — scrim keeps the copy legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_48%_62%_at_50%_50%,rgb(255_255_255/0.82),rgb(255_255_255/0)_80%)] lg:bg-[radial-gradient(ellipse_42%_72%_at_28%_50%,rgb(255_255_255/0.85),rgb(255_255_255/0)_80%)]"
      />

      {/* 3 — dot grid */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />

      {/* 4 — copy */}
      <Container className="relative z-10 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-16 lg:pb-28">
        {children}
      </Container>
    </div>
  );
}