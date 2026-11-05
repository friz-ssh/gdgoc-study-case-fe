"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "tracks", label: "Learning tracks" },
  { id: "formats", label: "Learning formats" },
  { id: "journey", label: "Your learning journey" },
  { id: "start", label: "Find a starting point" },
] as const;

/** Matches `scroll-mt-36` on the sections: clears the header and this bar. */
const SCROLL_OFFSET = 144;

/**
 * Sticky in-page navigation with scroll-spy: the link of the section that is
 * currently in view is highlighted with a shared-layout underline.
 */
export function OverviewSubnav() {
  const [active, setActive] = React.useState<string>(ITEMS[0].id);

  React.useEffect(() => {
    // Scroll-spy by position instead of IntersectionObserver: an observer only
    // fires when a threshold is crossed, so it missed sections after scrolling
    // back up from the bottom of the page. Here the answer is recomputed from
    // the real scroll position on every (frame-throttled) scroll.
    const targets = ITEMS.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (targets.length === 0) return;

    /** A section counts as current once its top passes this line (below the sticky bars). */
    const LINE = 200;
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 2;
      let current = targets[0].id;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= LINE) current = target.id;
      }
      // The last section can be too short to reach the line; at the very bottom it wins.
      if (atBottom) current = targets[targets.length - 1].id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    // Measured by hand: the native anchor jump stopped about 100px short of the
    // section because of the sticky bars.
    const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="sticky top-16 z-40 border-y border-line bg-white/90 backdrop-blur-md md:top-[4.25rem]">
      <Container>
        <nav
          aria-label="On this page"
          className="-mx-1 flex gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => goTo(event, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex min-h-11 shrink-0 items-center gap-1.5 px-3 text-sm transition-colors sm:px-4",
                  isActive ? "font-medium text-brand" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
                <ArrowDown aria-hidden="true" className="size-3.5" />
                {isActive ? (
                  <motion.span
                    layoutId="subnav-underline"
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand sm:inset-x-4"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                ) : null}
              </a>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}