"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CircleCheck, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { iconFor } from "@/components/shared/icon-map";
import { Reveal } from "@/components/shared/reveal";
import { ArrowLink, Eyebrow } from "@/components/shared/section-heading";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/shared/skeleton";
import { Container } from "@/components/shared/container";
import { useApi } from "@/hooks/use-api";
import { useDraft, type Draft } from "@/hooks/use-draft";
import { getInquiryCategories, getStats } from "@/lib/api";
import { DEFAULT_CATEGORY_ID, FALLBACK_CATEGORIES, buildSocialLinks } from "@/lib/content";
import { isInquirySimulated, submitInquiry } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import { Emphasis } from "@/components/shared/emphasis";

type FieldName = keyof Draft | "category" | "consent";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INPUT =
  "min-h-11 w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-[#80868b] transition-colors focus:ring-2 focus:ring-brand/25 focus:outline-none";

function inputClass(invalid: boolean): string {
  return cn(INPUT, invalid ? "border-g-red focus:border-g-red" : "border-line focus:border-brand");
}

function validate(draft: Draft, category: string, consent: boolean, knownIds: string[]): Errors {
  const errors: Errors = {};
  if (!draft.firstName.trim()) errors.firstName = "Please tell us your first name.";
  if (!draft.email.trim()) errors.email = "We need an email address to reply to you.";
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = "That email address doesn't look right.";
  if (!knownIds.includes(category)) errors.category = "Please choose a category.";
  if (draft.subject.trim().length < 3) errors.subject = "Add a short subject (at least 3 characters).";
  if (draft.message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  if (!consent) errors.consent = "Please agree so we can respond to your inquiry.";
  return errors;
}

const FIELD_ORDER: FieldName[] = [
  "firstName",
  "email",
  "category",
  "subject",
  "message",
  "consent",
];

function Field({
  id,
  label,
  required,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-g-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactLayout({ initialCategory }: { initialCategory: string }) {
  const categoriesQuery = useApi("inquiry-categories", getInquiryCategories);
  const stats = useApi("stats", getStats);
  const social = buildSocialLinks(stats.data?.social);

  const categories =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data
      : FALLBACK_CATEGORIES;
  const knownIds = categories.map((category) => category.id);

  const { draft, updateDraft, clearDraft } = useDraft();
  const [categoryId, setCategoryId] = React.useState(
    knownIds.includes(initialCategory) ? initialCategory : DEFAULT_CATEGORY_ID,
  );
  const [consent, setConsent] = React.useState(false);
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, boolean>>>({});
  const [attempted, setAttempted] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [sent, setSent] = React.useState<{ name: string; email: string } | null>(null);

  const errors = validate(draft, categoryId, consent, knownIds);
  const show = (field: FieldName): string | undefined =>
    touched[field] || attempted ? errors[field] : undefined;
  const touch = (field: FieldName) => setTouched((current) => ({ ...current, [field]: true }));

  const invalidProps = (field: FieldName) => ({
    "aria-invalid": show(field) ? (true as const) : undefined,
    "aria-describedby": show(field) ? `field-${field}-error` : undefined,
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await submitInquiry({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        email: draft.email.trim(),
        organization: draft.organization.trim(),
        category: categoryId,
        subject: draft.subject.trim(),
        message: draft.message.trim(),
      });
      setSent({ name: draft.firstName.trim(), email: draft.email.trim() });
      clearDraft();
      setConsent(false);
      setTouched({});
      setAttempted(false);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Container className="pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 xl:gap-20">
        {/* ------------------------------ topics ------------------------------ */}
        <div>
          <Reveal>
            <h2 className="text-[1.75rem] font-semibold tracking-tight">What <Emphasis color="blue">brings you here?</Emphasis></h2>
            <p className="mt-2 text-[0.9375rem] text-muted">
              Pick the closest topic in the form. We&apos;ll take it from there.
            </p>
          </Reveal>

          <div role="group" aria-label="Inquiry topic" className="mt-6 flex flex-col gap-3">
            {categoriesQuery.isLoading
              ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-[5.5rem] rounded-2xl" />)
              : categories.map((category, index) => {
                  const Icon = iconFor(category.id);
                  const selected = category.id === categoryId;
                  return (
                    <Reveal key={category.id} delay={index * 0.05}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setCategoryId(category.id)}
                        className={cn(
                          "relative flex min-h-[5rem] w-full cursor-pointer items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors",
                          selected ? "border-transparent" : "border-line bg-white hover:border-brand/40",
                        )}
                      >
                        {selected ? (
                          <motion.span
                            layoutId="category-highlight"
                            aria-hidden="true"
                            className="absolute inset-0 rounded-2xl bg-brand-soft"
                            transition={{ type: "spring", stiffness: 420, damping: 38 }}
                          />
                        ) : null}
                        <Icon aria-hidden="true" className="relative mt-0.5 size-5 shrink-0 text-brand" />
                        <span className="relative">
                          <span className="block text-base font-medium text-ink">{category.label}</span>
                          <span className="mt-0.5 block text-sm text-muted">{category.description}</span>
                        </span>
                      </button>
                    </Reveal>
                  );
                })}
          </div>

          {categoriesQuery.isError ? (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              Showing default topics because the live list couldn&apos;t load.
              <button
                type="button"
                onClick={categoriesQuery.refetch}
                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 font-medium text-brand hover:underline"
              >
                <RefreshCw aria-hidden="true" className="size-3.5" />
                Retry
              </button>
            </p>
          ) : null}

          <Reveal className="mt-6 rounded-[1.75rem] bg-cream p-6 sm:p-7">
            <Eyebrow>Stay curious, stay connected</Eyebrow>
            <h3 className="mt-3 text-2xl leading-tight font-semibold tracking-tight">
              Looking for <Emphasis color="blue">community updates?</Emphasis>
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              Follow <strong className="font-semibold">{social.instagram.handle}</strong> for learning
              opportunities and what&apos;s happening in the community.
            </p>
            <ArrowLink href={social.instagram.url} external className="mt-2">
              Find {social.instagram.handle}
            </ArrowLink>
          </Reveal>
        </div>

        {/* ------------------------------- form ------------------------------- */}
        <Reveal delay={0.1}>
          <form
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="contact-form-title"
            className="rounded-[1.75rem] bg-surface p-5 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="contact-form-title" className="text-[1.75rem] font-semibold tracking-tight">
                Send us a message
              </h2>
              <ArrowUpRight aria-hidden="true" className="mt-1.5 size-5 text-brand" />
            </div>
            <p className="mt-3 text-xs text-muted">Fields marked * are required.</p>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="field-firstName" label="First name" required error={show("firstName")}>
                  <input
                    id="field-firstName"
                    name="firstName"
                    autoComplete="given-name"
                    value={draft.firstName}
                    onChange={(event) => updateDraft({ firstName: event.target.value })}
                    onBlur={() => touch("firstName")}
                    placeholder="Your first name"
                    className={inputClass(Boolean(show("firstName")))}
                    {...invalidProps("firstName")}
                  />
                </Field>
                <Field id="field-lastName" label="Last name">
                  <input
                    id="field-lastName"
                    name="lastName"
                    autoComplete="family-name"
                    value={draft.lastName}
                    onChange={(event) => updateDraft({ lastName: event.target.value })}
                    placeholder="Your last name"
                    className={inputClass(false)}
                  />
                </Field>
              </div>

              <Field id="field-email" label="Email address" required error={show("email")}>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={draft.email}
                  onChange={(event) => updateDraft({ email: event.target.value })}
                  onBlur={() => touch("email")}
                  placeholder="Where we can reply to you"
                  className={inputClass(Boolean(show("email")))}
                  {...invalidProps("email")}
                />
              </Field>

              <Field id="field-organization" label="University / organization">
                <input
                  id="field-organization"
                  name="organization"
                  autoComplete="organization"
                  value={draft.organization}
                  onChange={(event) => updateDraft({ organization: event.target.value })}
                  placeholder="Where you study or work (optional)"
                  className={inputClass(false)}
                />
              </Field>

              <Field id="field-category" label="Inquiry category" required error={show("category")}>
                <div className="relative">
                  <select
                    id="field-category"
                    name="category"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    onBlur={() => touch("category")}
                    className={cn(inputClass(Boolean(show("category"))), "cursor-pointer appearance-none pr-11")}
                    {...invalidProps("category")}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 7.5 5 5 5-5" />
                  </svg>
                </div>
              </Field>

              <Field id="field-subject" label="Subject" required error={show("subject")}>
                <input
                  id="field-subject"
                  name="subject"
                  value={draft.subject}
                  onChange={(event) => updateDraft({ subject: event.target.value })}
                  onBlur={() => touch("subject")}
                  placeholder="A short introduction to your question"
                  className={inputClass(Boolean(show("subject")))}
                  {...invalidProps("subject")}
                />
              </Field>

              <Field id="field-message" label="Your message" required error={show("message")}>
                <textarea
                  id="field-message"
                  name="message"
                  rows={5}
                  value={draft.message}
                  onChange={(event) => updateDraft({ message: event.target.value })}
                  onBlur={() => touch("message")}
                  placeholder="Tell us a little about your question or idea…"
                  className={cn(inputClass(Boolean(show("message"))), "min-h-36 resize-y py-3")}
                  {...invalidProps("message")}
                />
              </Field>

              <div>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-muted">
                  <input
                    id="field-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      touch("consent");
                    }}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
                    {...invalidProps("consent")}
                  />
                  I agree that the information I share can be used to respond to this inquiry.
                </label>
                {show("consent") ? (
                  <p id="field-consent-error" role="alert" className="mt-1 text-sm text-g-red">
                    {errors.consent}
                  </p>
                ) : null}
              </div>
            </div>

            {status === "error" ? (
              <ErrorState
                className="mt-6"
                title="We couldn't send your message"
                message="Your draft is safe. Check your connection and try again."
              />
            ) : null}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" disabled={status === "submitting"} className="sm:w-auto">
                {status === "submitting" ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight aria-hidden="true" className="group-hover/button:translate-x-0.5" />
                  </>
                )}
              </Button>
              <p className="max-w-[16rem] text-xs leading-relaxed text-muted">
                Please don&apos;t include passwords or sensitive personal information.
              </p>
            </div>
          </form>
        </Reveal>
      </div>

      <Dialog open={sent !== null} onOpenChange={(open) => !open && setSent(null)}>
        <DialogContent>
          <span
            aria-hidden="true"
            className="mb-5 grid size-14 place-items-center rounded-2xl bg-mint text-g-green"
          >
            <CircleCheck className="size-7" />
          </span>
          <DialogHeader>
            <DialogTitle>Message sent</DialogTitle>
            <DialogDescription>
              Thanks{sent?.name ? `, ${sent.name}` : ""}. We&apos;ll reply to{" "}
              <strong className="font-medium text-ink">{sent?.email}</strong> as soon as we can.
            </DialogDescription>
          </DialogHeader>
          {isInquirySimulated ? (
            <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
              Demo mode: the provided API has no inquiry endpoint, so nothing was transmitted. Set
              NEXT_PUBLIC_INQUIRY_ENDPOINT to send messages to a real backend.
            </p>
          ) : null}
          <DialogClose asChild>
            <Button className="mt-6 w-full">Done</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function ContactFallback() {
  return (
    <Container className="pb-16 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[5.5rem] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[48rem] rounded-[1.75rem]" />
      </div>
    </Container>
  );
}

function ContactSectionInner() {
  const params = useSearchParams();
  const requested = params.get("category") ?? DEFAULT_CATEGORY_ID;
  // Re-mount when ?category= changes so the form picks the new preselection.
  return <ContactLayout key={requested} initialCategory={requested} />;
}

export function ContactSection() {
  return (
    <React.Suspense fallback={<ContactFallback />}>
      <ContactSectionInner />
    </React.Suspense>
  );
}
