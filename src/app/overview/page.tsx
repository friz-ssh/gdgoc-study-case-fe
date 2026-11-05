import type { Metadata } from "next";
import { Suspense } from "react";
import { Callout } from "@/components/shared/callout";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { HeroVisual } from "@/components/shared/hero-visual";
import { Emphasis } from "@/components/shared/emphasis";
import { Reveal } from "@/components/shared/reveal";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/shared/section-heading";
import { CardGridSkeleton } from "@/components/shared/skeleton";
import { FormatsSection } from "@/components/sections/formats-section";
import { JourneySteps } from "@/components/sections/journey-section";
import { OutcomesTable } from "@/components/sections/outcomes-table";
import { OverviewSubnav } from "@/components/sections/overview-subnav";
import { TracksExplorer } from "@/components/sections/tracks-explorer";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Explore how research, creativity, and development connect. Start with one interest and grow through practice and the people around you.",
};

export default function OverviewPage() {
  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="py-10 sm:py-16 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div>
            <Reveal y={16}>
              <Eyebrow>Overview • Programs &amp; learning tracks</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.04] font-semibold tracking-tight">
                Find your spark.
                <br />
                <Emphasis color="green">Build your own path.</Emphasis>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
                Explore how research, creativity, and development connect. Start with one interest.
                Grow through practice and the people around you.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={32} className="hidden sm:block">
            <HeroVisual variant="overview" className="max-lg:mx-auto max-lg:max-w-md" />
          </Reveal>
        </Container>
      </section>

      <OverviewSubnav />

      {/* ------------------------------ tracks ---------------------------- */}
      <section id="tracks" className="scroll-mt-36 py-16 sm:py-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading
              eyebrow="Explore your interests"
              title={<>Three ways in. <Emphasis color="blue">Plenty of ways forward.</Emphasis></>}
              description="These pathways are starting points, not boxes. Follow one deeply or bring different skills together."
            />
          </Reveal>
          <Suspense fallback={<CardGridSkeleton count={3} cardClassName="h-[28rem]" />}>
            <TracksExplorer />
          </Suspense>

          <div className="mt-16 sm:mt-20">
            <Reveal>
              <h2 className="mb-6 text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] font-semibold tracking-tight">
                From an interest to <Emphasis color="red">something you can show.</Emphasis>
              </h2>
            </Reveal>
            <OutcomesTable />
          </div>
        </Container>
      </section>

      {/* ------------------------------ formats --------------------------- */}
      <section id="formats" className="scroll-mt-36 bg-surface py-16 sm:py-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading
              eyebrow="Ways to learn"
              title={<>The format changes. <Emphasis color="blue">The curiosity stays.</Emphasis></>}
              description="Explore the kinds of experiences that help you move from understanding to doing."
            />
          </Reveal>
          <FormatsSection columns={2} />
        </Container>
      </section>

      {/* ------------------------------ journey --------------------------- */}
      <section id="journey" className="scroll-mt-36 py-16 sm:py-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading eyebrow="Progress, not perfection" title={<>A journey you can <Emphasis color="amber">keep building on.</Emphasis></>} />
          </Reveal>
          <JourneySteps />
        </Container>
      </section>

      {/* ------------------------------ starting point -------------------- */}
      <div id="start" className="scroll-mt-36">
        <Callout
          tone="cream"
          layout="split"
          eyebrow="Start where you are"
          title={
            <>
              New to tech?
              <br />
              That&apos;s a <Emphasis color="green">starting point, too.</Emphasis>
            </>
          }
          action={
            <ArrowLink href="/contact?category=joining-learning">Ask about getting started</ArrowLink>
          }
        >
          You don&apos;t need a finished portfolio or the perfect track choice. Pick a topic you&apos;re
          curious about. If you&apos;re unsure, tell us what interests you and we can start a
          conversation.
        </Callout>
      </div>

      <div className="pt-16 sm:pt-24">
        <CtaBanner />
      </div>
    </>
  );
}