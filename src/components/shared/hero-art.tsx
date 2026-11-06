import { Illustration } from "@/components/shared/illustration";

/**
 * Home hero art (desktop only): the Figma glass puzzle pieces over the dot grid,
 * with the two small chips from the design.
 *
 * Deliberately static: no JS, no animation. The SVGs carry heavy blur filters,
 * and animating them forced repaints (visible stutter in dev). Painted once, they
 * cost nothing afterwards. Hidden below `lg` so phones never fetch them.
 */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden aspect-[1/0.88] w-full max-w-[34rem] lg:block">
      <div className="absolute top-[2%] left-[-2%] w-[58%] -rotate-2">
        <Illustration id="research-discovery" priority />
      </div>
      <div className="absolute right-[-4%] bottom-[8%] w-[78%]">
        <Illustration id="development" priority />
      </div>

      <div className="absolute bottom-[4%] left-[2%] -rotate-3 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-[0_14px_30px_-16px_rgba(60,64,67,0.5)]">
        hello, possibilities<span className="text-action">_</span>
      </div>

      <div className="absolute right-[2%] bottom-[0%] inline-flex items-center gap-2 rounded-full border border-line bg-white/95 px-3.5 py-1.5 text-xs font-medium text-ink/80 shadow-soft">
        <span className="size-2 rounded-full bg-g-green" />
        Built on curiosity. Rooted in UGM.
      </div>
    </div>
  );
}