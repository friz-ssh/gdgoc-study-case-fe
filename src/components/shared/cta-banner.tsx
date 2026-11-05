import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { Eyebrow, ArrowLink } from "./section-heading";
import { Reveal } from "./reveal";
import { Emphasis } from "@/components/shared/emphasis";

/** Closing call to action shared by Home, About and Overview. */
export function CtaBanner() {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <Reveal className="rounded-[2rem] bg-brand-soft px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Eyebrow>Your next chapter</Eyebrow>
              <h2 className="mt-4 text-balance text-[clamp(1.875rem,4vw,3rem)] leading-[1.08] font-semibold tracking-tight">
                Bring your curiosity.
                <br />
                <Emphasis color="red">We&apos;ll build from there.</Emphasis>
              </h2>
              <p className="mt-4 text-base text-muted sm:text-lg">
                Find a learning track, meet a collaborator, or start a conversation.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-1 sm:items-start lg:items-center">
              <Button asChild size="lg">
                <Link href="/overview">
                  Explore the overview
                  <ArrowRight aria-hidden="true" className="group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
              <ArrowLink href="/contact" className="justify-center sm:justify-start">
                Talk to the community
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
