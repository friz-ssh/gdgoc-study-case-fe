"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

/** Route-level error boundary: catches anything the section boundaries miss. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[calc(100dvh-10rem)] flex-col items-start justify-center py-20">
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] font-semibold tracking-tight">
        We hit an <span className="text-g-red">unexpected</span> snag.
      </h1>
      <p className="mt-5 max-w-lg text-lg text-muted">
        Don&apos;t worry, nothing is lost. Try again, and if it keeps happening, let us know through the contact page.
      </p>
      <Button size="lg" className="mt-8" onClick={reset}>
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    </Container>
  );
}
