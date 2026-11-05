import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** "joining-learning" -> "Joining learning" (used only as a label fallback). */
export function humanize(slug: string): string {
  const spaced = slug.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Accept only hex colours from API data before using them in inline styles. */
export function safeColor(value: string | undefined, fallback = "#4285f4"): string {
  return value && /^#[0-9a-f]{3,8}$/i.test(value) ? value : fallback;
}

/** Only allow same-site paths coming from API data to be used as links. */
export function safeInternalHref(href: string | undefined, fallback: string): string {
  if (!href) return fallback;
  return href.startsWith("/") && !href.startsWith("//") ? href : fallback;
}
