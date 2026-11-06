"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { getNavigation } from "@/lib/api";
import { FALLBACK_NAVIGATION } from "@/lib/content";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  const path = href.split(/[?#]/)[0] || "/";
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const navigation = useApi("navigation", getNavigation);
  // The nav is never blank: use the API list when present, a static one otherwise.
  const items = navigation.data && navigation.data.length > 0 ? navigation.data : FALLBACK_NAVIGATION;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Sliding active pill. It is one element moved with `x` and `width`, measured
  // from the active link's offsetLeft/offsetWidth. Those are layout coordinates,
  // so page scroll can never affect them. (A shared `layoutId` pill inside this
  // sticky header flew in from the old scroll offset when navigating after
  // scrolling, because the page scroll resets on route change.)
  const reduceMotion = useReducedMotion();
  const navRef = React.useRef<HTMLElement>(null);
  const placed = React.useRef(false);
  const pillX = useMotionValue(0);
  const pillWidth = useMotionValue(0);
  const pillOpacity = useMotionValue(0);

  const lastPath = React.useRef(pathname);

  /**
   * `animated` is true only for a real route change. Every other re-measure
   * (links arriving from the API, web fonts changing text widths, a resize)
   * snaps instantly: animating those made the pill visibly slide from a stale
   * position on refresh, so it looked as if the neighbouring link got the pill.
   */
  const placePill = React.useCallback(
    (animated: boolean) => {
      const nav = navRef.current;
      if (!nav) return;
      const link = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!link) {
        pillOpacity.set(0);
        return;
      }
      pillOpacity.set(1);
      if (!animated || !placed.current || reduceMotion) {
        pillX.jump(link.offsetLeft);
        pillWidth.jump(link.offsetWidth);
        placed.current = true;
        nav.dataset.ready = "true";
        return;
      }
      const spring = { type: "spring", stiffness: 420, damping: 36 } as const;
      animate(pillX, link.offsetLeft, spring);
      animate(pillWidth, link.offsetWidth, spring);
    },
    [pillOpacity, pillWidth, pillX, reduceMotion],
  );

  // Route change: slide. Link list change: snap.
  React.useEffect(() => {
    const routeChanged = lastPath.current !== pathname;
    lastPath.current = pathname;
    placePill(routeChanged);
  }, [placePill, pathname, items]);

  // Keep the pill aligned when fonts load or the viewport is resized (always a snap).
  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new ResizeObserver(() => placePill(false));
    observer.observe(nav);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) placePill(false);
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [placePill]);

  // Lock page scroll and support Escape while the mobile menu is open.
  React.useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-50 border-b bg-white/92 backdrop-blur-md transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-line shadow-[0_6px_24px_-16px_rgba(60,64,67,0.35)]" : "border-line/70",
      )}
    >
      <Container
        className={cn(
          "flex h-16 items-center justify-between gap-4 transition-[height] duration-300",
          scrolled ? "md:h-[4.25rem]" : "md:h-20",
        )}
      >
        <Logo />

        <nav
          ref={navRef}
          aria-label="Primary"
          data-pill
          className="relative hidden items-center gap-1 md:flex"
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-brand-soft"
            style={{ x: pillX, width: pillWidth, opacity: pillOpacity }}
          />
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] transition-colors",
                  active ? "font-semibold text-brand" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/overview#tracks">
              Find your track
              <ArrowRight aria-hidden="true" className="group-hover/button:translate-x-0.5" />
            </Link>
          </Button>

          <button
            type="button"
            className="grid size-11 cursor-pointer place-items-center rounded-xl text-ink transition-colors hover:bg-surface md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -60, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.8 }}
                transition={{ duration: 0.16 }}
                className="grid place-items-center"
              >
                {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <Container className="pt-3 pb-6">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {items.map((item, index) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.05, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex min-h-12 items-center rounded-xl px-4 text-lg transition-colors",
                          active
                            ? "bg-brand-soft font-semibold text-brand"
                            : "text-ink hover:bg-surface",
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <Button asChild size="lg" className="mt-4 w-full">
                <Link href="/overview#tracks" onClick={() => setMenuOpen(false)}>
                  Find your track
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/** Static stand-in used while the client navbar is being hydrated. */
export function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-white/92 backdrop-blur-md">
      <Container className="flex h-16 items-center md:h-20">
        <Logo />
      </Container>
    </header>
  );
}