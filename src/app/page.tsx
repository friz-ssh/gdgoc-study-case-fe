import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/shared/callout";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { Reveal } from "@/components/shared/reveal";
import { Emphasis } from "@/components/shared/emphasis";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/shared/section-heading";
import { HeroBanner } from "@/components/sections/hero-banner";
import { HeroArt } from "@/components/shared/hero-art";
import { MarqueeRibbon } from "@/components/sections/marquee-ribbon";
import { FaqSection } from "@/components/sections/faq-section";
import { FormatsSection } from "@/components/sections/formats-section";
import { JourneySteps } from "@/components/sections/journey-section";
import { ProjectPreview } from "@/components/sections/project-preview";
import { StatsBand } from "@/components/sections/stats-band";
import { TracksPreview } from "@/components/sections/tracks-preview";

export const metadata: Metadata = {
  title: { absolute: "GDGoC UGM — Big ideas. Built together." },
  description:
    "A place for curious minds at Universitas Gadjah Mada to learn, connect, and build technology that matters.",
};

export default function HomePage() {
  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="flex flex-col">
        <HeroBanner>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Reveal y={16}>
                <Eyebrow className="justify-center text-ink/70 lg:justify-start">GDGoC UGM • 2026/2027</Eyebrow>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-4 text-balance text-[clamp(2.5rem,6.6vw,5rem)] leading-[1.02] font-semibold tracking-tight text-ink">
                  Big ideas.
                  <br />
                  <Emphasis color="blue">Built together.</Emphasis>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mx-auto mt-5 max-w-xl lg:mx-0 text-pretty text-lg leading-relaxed text-ink/75 sm:text-xl">
                  A place for curious minds at Universitas Gadjah Mada to learn, connect, and build
                  technology that matters.
                </p>
              </Reveal>
              <Reveal
                delay={0.24}
                className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center lg:mx-0 lg:justify-start"
              >
                <Button asChild size="lg">
                  <Link href="/overview#tracks">
                    Find your learning track
                    <ArrowRight aria-hidden="true" className="group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="soft">
                  <Link href="/about">
                    Get to know us
                    <ArrowRight aria-hidden="true" className="group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
              </Reveal>
              <Reveal
                delay={0.32}
                className="mt-6 flex flex-col items-center justify-center gap-2.5 text-center text-sm text-ink/70 sm:flex-row sm:gap-3 lg:justify-start lg:text-left"
              >
                <span aria-hidden="true" className="flex gap-1">
                  <span className="size-3 rounded-full bg-g-red" />
                  <span className="size-3 rounded-full bg-g-yellow" />
                  <span className="size-3 rounded-full bg-g-green" />
                  <span className="size-3 rounded-full bg-action" />
                </span>
                Different backgrounds. A shared curiosity.
              </Reveal>
            </div>
            <HeroArt />
          </div>
        </HeroBanner>

        <MarqueeRibbon />
      </section>

      {/* ------------------------------ intro ----------------------------- */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>A campus. A community.</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight">
              Not just learning tech.
              <br />
              <Emphasis color="green">Finding your people.</Emphasis>
            </h2>
            <ArrowLink href="/about" className="mt-4">
              More about GDGoC UGM
            </ArrowLink>
          </Reveal>
          <Reveal delay={0.1} className="max-w-2xl self-center">
            <p className="text-pretty text-xl leading-relaxed text-ink sm:text-2xl">
              Google Developer Groups on Campus, Universitas Gadjah Mada, brings students together
              around one simple idea: we can go <strong className="font-semibold">further</strong> when
              we <strong className="font-semibold">learn</strong> with each other.
            </p>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              From your first line of code to your next product idea, there&apos;s room to ask
              questions, share what you know, and try something new.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              <li>
                <Badge>Student-led</Badge>
              </li>
              <li>
                <Badge>Peer-powered</Badge>
              </li>
              <li>
                <Badge>Curiosity-first</Badge>
              </li>
            </ul>
          </Reveal>
        </Container>
      </section>

      <StatsBand />

      {/* ------------------------------ tracks ---------------------------- */}
      <section id="tracks" className="py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Find your starting point"
                title={<>Many interests. <Emphasis color="red">One shared journey.</Emphasis></>}
                description="Follow what excites you. Explore a track, then connect the dots with others."
              />
            </Reveal>
            <ArrowLink href="/overview">See the overview</ArrowLink>
          </div>
          <TracksPreview />
        </Container>
      </section>

      {/* ------------------------------ formats --------------------------- */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading
              eyebrow="More than a classroom"
              title={<>Less watching. <Emphasis color="amber">More making.</Emphasis></>}
              description="Learn in a way that turns a new concept into something you can actually use."
            />
          </Reveal>
          <FormatsSection columns={4} />
        </Container>
      </section>

      {/* ------------------------------ project teaser -------------------- */}
      <section className="py-16 sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ProjectPreview />
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>Build something that matters</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight">
              Your next project could <Emphasis color="blue">start on campus.</Emphasis>
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              What if finding a study partner, sharing resources, or navigating campus felt easier?
              Small, familiar problems can be the beginning of meaningful work.
            </p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Bring research, design, and development together. Try an idea, get feedback, and make
              the next version better.
            </p>
            <ArrowLink href="/overview#formats" className="mt-3">
              Explore project-based learning
            </ArrowLink>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------ journey --------------------------- */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading
              eyebrow="Make your first move"
              title={<>You don&apos;t need to have it all <Emphasis color="red">figured out.</Emphasis></>}
            />
          </Reveal>
          <JourneySteps />
        </Container>
      </section>

      <Callout tone="mint" title={<>Different majors. Different starting points. <Emphasis color="green">A place for all of them.</Emphasis></>}>
        You don&apos;t have to be the most experienced person in the room. Curiosity, kindness, and a
        willingness to learn are a good place to start.
      </Callout>

      <FaqSection />

      <CtaBanner />
    </>
  );
}