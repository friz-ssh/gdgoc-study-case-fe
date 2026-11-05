import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Highlights a key phrase in one solid Google colour. Shades are slightly
 * deeper than the logo colours so large headings keep enough contrast on
 * white, cream and light-grey sections. Server-safe, no JavaScript.
 */
const COLORS = {
  blue: "text-[#1A73E8]",
  red: "text-[#D93025]",
  amber: "text-[#E37400]",
  green: "text-[#1E8E3E]",
} as const;

export type EmphasisColor = keyof typeof COLORS;

export function Emphasis({
  color = "blue",
  className,
  children,
}: {
  color?: EmphasisColor;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn(COLORS[color], className)}>{children}</span>;
}
