"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

/**
 * Straight ribbon that straddles the bottom edge of the hero, half over the
 * banner and half over the next section.
 *
 * - Always drifts at a calm base speed, even when the page is still.
 * - Scroll speed adds to that speed; scrolling up reverses the direction.
 * - White phrases on a Google-blue band (no separators).
 * - Work stops while the ribbon is off-screen or reduced motion is requested.
 *
 * The motion is a transform driven from requestAnimationFrame through motion
 * values, so it never re-renders React.
 */

const PHRASES = ["Learn by doing", "Connect across disciplines", "Build with purpose"] as const;

/**
 * Colours are assigned per phrase and cycle through four Google colours, but a
 * copy holds three phrases. The pattern therefore only repeats every four
 * copies (12 phrases), so the row wraps after four copies, and the row holds
 * eight so it always covers the screen while shifting.
 */
const COPIES = 8;
const PERIOD_COPIES = 4;
const WRAP_PERCENT = (100 * PERIOD_COPIES) / COPIES;

interface BandConfig {
  background: string;
  /** Four colours that stay legible on this background (blue, red, yellow, green). */
  colors: readonly [string, string, string, string];
  /** Shifts which colour the first phrase starts with. */
  offset: number;
  /** Percent of the row width per second. Negative = right-to-left. */
  speed: number;
}

const BAND: BandConfig = {
  // White on #1A73E8 is 4.5:1 (WCAG AA); the text is large and bold on top of that.
  background: "#1A73E8",
  colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
  offset: 0,
  speed: -0.55,
};

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function Band({
  config,
  velocityFactor,
  running,
}: {
  config: BandConfig;
  velocityFactor: MotionValue<number>;
  running: boolean;
}) {
  const offset = useMotionValue(0);
  const x = useTransform(offset, (value) => `${wrap(-WRAP_PERCENT, 0, value)}%`);
  const direction = React.useRef(1);

  useAnimationFrame((_, delta) => {
    if (!running) return;
    const factor = velocityFactor.get();
    if (factor < -0.01) direction.current = -1;
    else if (factor > 0.01) direction.current = 1;
    const step = config.speed * (delta / 1000) * direction.current * (1 + Math.abs(factor));
    offset.set(offset.get() + step);
  });

  return (
    <div
      className="overflow-hidden py-3 shadow-[0_16px_32px_-16px_rgb(26_115_232/0.55)] sm:py-4"
      style={{ background: config.background }}
    >
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {PHRASES.map((phrase, index) => (
              <span
                key={phrase}
                className="mr-12 text-[clamp(1.5rem,3.6vw,2.9rem)] leading-tight font-semibold tracking-tight whitespace-nowrap sm:mr-20"
                style={{
                  color: config.colors[(copy * PHRASES.length + index + config.offset) % config.colors.length],
                }}
              >
                {phrase}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function MarqueeRibbon() {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  // ~1000 px/s of scrolling roughly adds 5x the base speed; capped for comfort.
  const velocityFactor = useTransform(smoothVelocity, (value) =>
    Math.max(-6, Math.min(6, value / 200)),
  );

  const running = inView && !reduceMotion;

  return (
    <section ref={ref} aria-label="What we stand for" className="relative z-20 -mt-9 sm:-mt-12">
      {/* The moving text is decoration; screen readers get the phrases once. */}
      <ul className="sr-only">
        {PHRASES.map((phrase) => (
          <li key={phrase}>{phrase}</li>
        ))}
      </ul>
      <div aria-hidden="true">
        <Band config={BAND} velocityFactor={velocityFactor} running={running} />
      </div>
    </section>
  );
}