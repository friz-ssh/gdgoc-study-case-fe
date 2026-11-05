"use client";

import Link from "next/link";
import { CodeXml } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { InstagramIcon, LinkedinIcon } from "@/components/shared/social-icons";
import { getNavigation, getStats } from "@/lib/api";
import {
  FALLBACK_NAVIGATION,
  FALLBACK_TAGLINE,
  SITE_YEAR,
  buildSocialLinks,
} from "@/lib/content";
import { useApi } from "@/hooks/use-api";

export function Footer() {
  const navigation = useApi("navigation", getNavigation);
  const stats = useApi("stats", getStats);

  const items = navigation.data && navigation.data.length > 0 ? navigation.data : FALLBACK_NAVIGATION;
  const social = buildSocialLinks(stats.data?.social);
  const tagline = stats.data?.tagline ?? FALLBACK_TAGLINE;

  const socialClass =
    "grid size-11 place-items-center rounded-xl text-muted transition-colors hover:bg-white hover:text-brand";

  return (
    <footer className="mt-auto bg-surface">
      <Container className="pt-14 pb-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Logo className="-ml-1" />
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
              A student community for curious minds, shared learning, and technology with purpose.
            </p>
          </div>

          <div>
            <h2 className="text-[0.9375rem] font-semibold">Explore</h2>
            <ul className="mt-3 flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.9375rem] font-semibold">Keep in the loop</h2>
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-lg text-brand hover:underline"
            >
              {social.instagram.handle}
            </a>
            <div className="-ml-2 flex items-center">
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialClass}
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href={social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialClass}
              >
                <LinkedinIcon className="size-5" />
              </a>
              <a
                href={social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={socialClass}
              >
                <CodeXml className="size-5" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-2 text-sm text-muted">{tagline}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© GDGoC Universitas Gadjah Mada • {SITE_YEAR}</p>
          <p>Made for the campus. Open to possibilities.</p>
        </div>

        <div aria-hidden="true" className="mt-8 flex h-1 w-40 overflow-hidden rounded-full">
          <span className="flex-1 bg-action" />
          <span className="flex-1 bg-g-red" />
          <span className="flex-1 bg-g-yellow" />
          <span className="flex-1 bg-g-green" />
        </div>
      </Container>
    </footer>
  );
}
