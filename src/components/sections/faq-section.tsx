"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { DataState } from "@/components/shared/data-state";
import { Reveal } from "@/components/shared/reveal";
import { ArrowLink, Eyebrow } from "@/components/shared/section-heading";
import { ListSkeleton } from "@/components/shared/skeleton";
import { EmptyState } from "@/components/shared/states";
import { useApi } from "@/hooks/use-api";
import { getFaqs, getInquiryCategories } from "@/lib/api";
import type { Faq } from "@/lib/types";
import { cn, humanize } from "@/lib/utils";
import { Emphasis } from "@/components/shared/emphasis";

const PAGE_SIZE = 4;

function FaqList({ items, labels }: { items: Faq[]; labels: Record<string, string> }) {
  const [category, setCategory] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null | undefined>(undefined);
  const [limit, setLimit] = React.useState<{ signature: string; count: number }>({
    signature: "",
    count: PAGE_SIZE,
  });

  const categories = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [items]);

  const needle = search.trim().toLowerCase();
  const filtered = items.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!needle ||
        item.question.toLowerCase().includes(needle) ||
        item.answer.toLowerCase().includes(needle)),
  );

  // Pagination resets whenever the filter changes (derived, no effect needed).
  const signature = `${category}|${needle}`;
  const count = limit.signature === signature ? limit.count : PAGE_SIZE;
  const shown = filtered.slice(0, count);
  const remaining = filtered.length - shown.length;

  // First visible item is open by default until the visitor picks one.
  const activeId = openId === undefined ? shown[0]?.id : openId;

  const labelFor = (id: string) => labels[id] ?? humanize(id);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          />
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the questions"
            className="min-h-11 w-full rounded-xl border border-line bg-white pr-4 pl-10 text-base text-ink placeholder:text-[#80868b] focus:border-brand focus:ring-2 focus:ring-brand/25 focus:outline-none"
          />
        </div>

        <div role="group" aria-label="Filter questions by topic" className="flex flex-wrap gap-2">
          {[["all", items.length] as const, ...categories].map(([id, total]) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(id)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors sm:min-h-9",
                  active
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line bg-white text-muted hover:border-brand/40 hover:text-ink",
                )}
              >
                {id === "all" ? "All" : labelFor(id)}
                <span className="ml-1.5 text-xs opacity-70">{total}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "question" : "questions"} found
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No questions match that"
          message="Try fewer words, or ask us directly — we're happy to help."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="border-t border-line">
          {shown.map((faq) => {
            const open = activeId === faq.id;
            return (
              <div key={faq.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => setOpenId(open ? null : faq.id)}
                    className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[1.0625rem] font-medium text-ink transition-colors hover:text-brand"
                  >
                    {faq.question}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-5 shrink-0 text-brand transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={`faq-panel-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pr-8 pb-5 text-[0.9375rem] leading-relaxed text-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {remaining > 0 || count > PAGE_SIZE ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining > 0 ? (
            <Button
              variant="soft"
              onClick={() =>
                setLimit({ signature, count: Math.min(count + PAGE_SIZE, filtered.length) })
              }
            >
              Show more ({remaining})
            </Button>
          ) : null}
          {count > PAGE_SIZE ? (
            <Button variant="ghost" onClick={() => setLimit({ signature, count: PAGE_SIZE })}>
              Show fewer
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** FAQ block for Home: data from /faqs, topic labels from /inquiry-categories. */
export function FaqSection() {
  const faqs = useApi("faqs", getFaqs);
  const categories = useApi("inquiry-categories", getInquiryCategories);

  const labels = React.useMemo(
    () => Object.fromEntries((categories.data ?? []).map((item) => [item.id, item.label])),
    [categories.data],
  );

  return (
    <section id="faq" className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Eyebrow>A few good questions</Eyebrow>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-tight">
              Wondering
              <br />
              <Emphasis color="blue">where to begin?</Emphasis>
            </h2>
            <ArrowLink href="/contact" className="mt-4">
              Ask a question
            </ArrowLink>
          </Reveal>

          <Reveal delay={0.1}>
            <DataState
              query={faqs}
              skeleton={<ListSkeleton rows={4} />}
              emptyTitle="No questions yet"
              emptyMessage="Be the first to ask. We'd love to hear what you're wondering."
            >
              {(items) => <FaqList items={items} labels={labels} />}
            </DataState>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
