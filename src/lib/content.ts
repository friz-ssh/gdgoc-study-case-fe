import type { InquiryCategory, NavItem, Stats } from "./types";

/**
 * Copy and fallbacks that are not part of the API. Anything that *is* in the
 * API (tracks, formats, values, roles, journey, FAQs, ...) is rendered from
 * the API response; this file only holds supporting content and safe defaults
 * so the UI never shows an empty shell while data loads.
 */

export const SITE_YEAR = "2026/2027";

export const FALLBACK_NAVIGATION: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Overview", href: "/overview" },
  { label: "Contact", href: "/contact" },
];

export const FALLBACK_SOCIAL: Stats["social"] = {
  instagram: "@gdgoc.ugm",
  linkedin: "gdgoc-ugm",
  github: "gdgoc-ugm",
};

export const FALLBACK_TAGLINE = "Learn together. Build together.";

export const DEFAULT_CATEGORY_ID = "joining-learning";

/**
 * Used by the contact form while /inquiry-categories loads (or if it fails),
 * so the form is always usable. Mirrors the API response.
 */
export const FALLBACK_CATEGORIES: InquiryCategory[] = [
  {
    id: "joining-learning",
    label: "Joining & learning",
    description: "Getting started, learning tracks, and participation",
    icon: "↗",
    guidance: "Tell us which topic interests you and where you are in your learning journey.",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    description: "Community activities and shared ideas",
    icon: "+",
    guidance: "Share the idea, who it's for, and how you imagine working with the community.",
  },
  {
    id: "speaking-sharing",
    label: "Speaking & sharing",
    description: "Workshops, knowledge sharing, and mentorship",
    icon: "◇",
    guidance: "Tell us what you'd like to share and who it could help.",
  },
  {
    id: "general-inquiry",
    label: "General inquiry",
    description: "Anything else you'd like to ask",
    icon: "?",
    guidance: "A clear question is always a good starting point. We'll take it from there.",
  },
];

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

export interface SocialLinks {
  instagram: { handle: string; url: string };
  linkedin: { handle: string; url: string };
  github: { handle: string; url: string };
}

export function buildSocialLinks(social: Stats["social"] = FALLBACK_SOCIAL): SocialLinks {
  const bare = (value: string) => value.replace(/^@/, "");
  return {
    instagram: {
      handle: social.instagram,
      url: `https://www.instagram.com/${bare(social.instagram)}`,
    },
    linkedin: {
      handle: social.linkedin,
      url: `https://www.linkedin.com/company/${bare(social.linkedin)}`,
    },
    github: {
      handle: social.github,
      url: `https://github.com/${bare(social.github)}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Supporting copy keyed by API ids                                    */
/* ------------------------------------------------------------------ */

export const TRACK_EYEBROW: Record<string, string> = {
  "research-discovery": "Explore the why",
  "design-creativity": "Make it meaningful",
  development: "Bring ideas to life",
};

export const FORMAT_BEST_FOR: Record<string, string> = {
  "study-groups": "Learning the fundamentals",
  "hands-on-workshops": "Trying something new",
  "project-circles": "Putting skills into practice",
  "knowledge-sharing": "Exchanging perspectives",
};

/** Illustrative outcomes table on the Overview page. */
export const OUTCOMES: ReadonlyArray<{
  pathway: string;
  practice: string;
  outcome: string;
}> = [
  {
    pathway: "Research & discovery",
    practice: "Listening, problem framing, and testing assumptions",
    outcome: "A research insight and a focused problem brief",
  },
  {
    pathway: "Design & creativity",
    practice: "Ideation, user flows, and prototype feedback",
    outcome: "An interactive prototype and a design story",
  },
  {
    pathway: "Development",
    practice: "Coding, testing, and connecting tools",
    outcome: "A working demo with a clear explanation",
  },
];

/** Contact page guidance block (static, mirrors the design). */
export const CONTACT_GUIDANCE: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "For learning questions",
    body: "Tell us which topic interests you and where you are in your learning journey.",
  },
  {
    title: "For collaborations",
    body: "Share the idea, who it's for, and how you imagine working with the community.",
  },
  {
    title: "Not sure which category fits?",
    body: "Choose General inquiry. A clear question is always a good starting point.",
  },
];

/* ------------------------------------------------------------------ */
/* Call-to-action slugs returned by /roles and /formats                */
/* ------------------------------------------------------------------ */

export interface ResolvedCta {
  href: string;
  label: string;
  external: boolean;
}

export function resolveCta(cta: string, instagramUrl: string): ResolvedCta {
  switch (cta) {
    case "find-a-track":
      return { href: "/overview#tracks", label: "Find a track", external: false };
    case "join-a-project":
      return {
        href: "/contact?category=collaboration",
        label: "Join a project",
        external: false,
      };
    case "talk-about-getting-involved":
      return {
        href: "/contact?category=joining-learning",
        label: "Let's talk about getting involved",
        external: false,
      };
    case "join-a-group":
      return {
        href: "/contact?category=joining-learning",
        label: "Join a group",
        external: false,
      };
    case "start-a-circle":
      return {
        href: "/contact?category=collaboration",
        label: "Start a circle",
        external: false,
      };
    case "see-upcoming":
      return { href: instagramUrl, label: "See what's coming", external: true };
    case "propose-a-session":
      return {
        href: "/contact?category=speaking-sharing",
        label: "Propose a session",
        external: false,
      };
    default:
      return { href: "/contact", label: "Get in touch", external: false };
  }
}
