import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { stagger } from "@/lib/motion";
import { ArrowLink, Eyebrow } from "@/components/shared/section-heading";
import { ContactSection } from "@/components/sections/contact-section";
import { CONTACT_GUIDANCE } from "@/lib/content";
import { Emphasis } from "@/components/shared/emphasis";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "A question, a collaboration, or an idea for the community? Tell GDGoC UGM what's on your mind.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-10 pb-10 sm:pt-16 sm:pb-14">
        <Container>
          <Reveal y={16}>
            <Eyebrow>Contact • Let&apos;s connect</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1.04] font-semibold tracking-tight">
              Good things start with <Emphasis color="amber">hello.</Emphasis>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
              A question, a collaboration, or an idea for the community? Tell us what&apos;s on your
              mind.
            </p>
          </Reveal>
        </Container>
      </section>

      <ContactSection />

      <section className="border-t border-line py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>A little guidance</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight">
              Help us understand <Emphasis color="green">your idea.</Emphasis>
            </h2>
            <ArrowLink href="/overview" className="mt-4">
              Explore the programs first
            </ArrowLink>
          </Reveal>
          <ul className="border-t border-line">
            {CONTACT_GUIDANCE.map((item, index) => (
              <li key={item.title} className="border-b border-line">
                <Reveal delay={stagger(index)} className="py-6">
                  <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
