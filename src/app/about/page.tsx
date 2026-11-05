import type { Metadata } from "next";
import { Callout } from "@/components/shared/callout";
import { Container } from "@/components/shared/container";
import { CtaBanner } from "@/components/shared/cta-banner";
import { HeroVisual } from "@/components/shared/hero-visual";
import { Emphasis } from "@/components/shared/emphasis";
import { Reveal } from "@/components/shared/reveal";
import { Eyebrow, SectionHeading } from "@/components/shared/section-heading";
import { RolesSection } from "@/components/sections/roles-section";
import { ValuesSection } from "@/components/sections/values-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "We're a community of learners and makers at Universitas Gadjah Mada, connected by curiosity and the belief that technology can do good.",
};

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="py-10 sm:py-16 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <Reveal y={16}>
              <Eyebrow>About GDGoC UGM</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 text-[clamp(2.75rem,7vw,5.25rem)] leading-[1.04] font-semibold tracking-tight">
                Built by students.
                <br />
                <Emphasis color="red">For what&apos;s next.</Emphasis>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
                We&apos;re a community of learners and makers at Universitas Gadjah Mada, connected by
                curiosity and the belief that technology can do good.
              </p>
              <p className="mt-6 text-[0.6875rem] tracking-[0.06em] text-muted uppercase">
                Universitas Gadjah Mada • 2026/2027
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={32}>
            <HeroVisual variant="about" />
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------ why ------------------------------- */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>Why we come together</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.08] font-semibold tracking-tight">
              A bridge from
              <br />
              <Emphasis color="blue">“I wonder”</Emphasis> to
              <br />
              <Emphasis color="green">“I made this.”</Emphasis>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-2xl">
            <p className="text-pretty text-xl leading-relaxed text-ink sm:text-2xl">
              Learning feels different when there&apos;s someone to exchange ideas with, a problem you
              care about, and the space to give it a try.
            </p>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              That&apos;s the spirit of Google Developer Groups on Campus at UGM. We create room for
              students to explore technology, develop practical skills, and learn from one another.
            </p>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Our campus is the starting point. The questions we ask and the things we build can reach
              beyond it.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------ values ---------------------------- */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="mb-10 sm:mb-12">
            <SectionHeading eyebrow="What guides us" title={<>Good technology starts with <Emphasis color="blue">good company.</Emphasis></>} />
          </Reveal>
          <ValuesSection />
        </Container>
      </section>

      {/* ------------------------------ roles ----------------------------- */}
      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>People, not labels</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight">
              There&apos;s <Emphasis color="amber">more than one way</Emphasis> to contribute.
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-base leading-relaxed text-muted">
              You can be learning one day and helping someone else the next. A community grows through
              both.
            </p>
          </Reveal>
          <RolesSection />
        </Container>
      </section>

      <Callout tone="cream" title={<>A space to learn. <Emphasis color="red">A responsibility to care.</Emphasis></>}>
        We want every conversation and learning experience to be respectful, inclusive, and
        constructive. Be kind, give credit, and make room for people who are just getting started.
      </Callout>

      <div className="pt-16 sm:pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
