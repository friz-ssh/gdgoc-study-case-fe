import {
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  CodeXml,
  Diamond,
  GraduationCap,
  Hammer,
  Handshake,
  Heart,
  Lightbulb,
  Palette,
  Plus,
  Search,
  Sparkles,
  Sprout,
  Telescope,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * The API returns emoji for `icon`. Emoji render differently on every OS, so
 * the UI maps each stable API `id` to a consistent Lucide icon instead and
 * falls back to a sparkle for ids it does not know yet.
 */
const ICONS: Record<string, LucideIcon> = {
  // tracks
  "research-discovery": Search,
  "design-creativity": Palette,
  development: CodeXml,
  // learning formats
  "study-groups": BookOpen,
  "project-circles": Users,
  "hands-on-workshops": Wrench,
  "knowledge-sharing": Lightbulb,
  // values
  "stay-curious": Telescope,
  "make-room": Users,
  "learn-by-building": Hammer,
  "give-something-back": Heart,
  // roles
  learner: GraduationCap,
  collaborator: Handshake,
  contributor: Sprout,
  // inquiry categories
  "joining-learning": ArrowUpRight,
  collaboration: Plus,
  "speaking-sharing": Diamond,
  "general-inquiry": CircleHelp,
};

export function iconFor(id: string): LucideIcon {
  return ICONS[id] ?? Sparkles;
}
