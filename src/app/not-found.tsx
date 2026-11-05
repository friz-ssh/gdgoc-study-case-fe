import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Emphasis } from "@/components/shared/emphasis";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100dvh-10rem)] flex-col items-start justify-center py-20">
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] font-semibold tracking-tight">
        This page wandered <Emphasis color="red">off.</Emphasis>
      </h1>
      <p className="mt-5 max-w-lg text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          <ArrowLeft aria-hidden="true" />
          Back to home
        </Link>
      </Button>
    </Container>
  );
}
