"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Illustration } from "@/components/shared/illustration";
import { cn } from "@/lib/utils";

/**
 * Hero art: the Figma illustration (overview) or the GDG mark (about), floating
 * on a colour wash. Reduced motion is respected via <MotionConfig />.
 */

function Float({
  children,
  className,
  duration = 6,
  delay = 0,
  distance = 10,
  rotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0], rotate: [rotate, rotate + 1.5, rotate] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function GlassTile({
  className,
  children,
  tint,
}: {
  className?: string;
  children: React.ReactNode;
  tint: "blue" | "green" | "white";
}) {
  const tints = {
    blue: "from-[#b8d1fb]/90 to-[#e8f0fe]/70 shadow-[0_24px_60px_-24px_rgba(26,115,232,0.7)]",
    green: "from-[#a8dab5]/90 to-[#e6f4ea]/70 shadow-[0_24px_60px_-24px_rgba(52,168,83,0.6)]",
    white: "from-white to-white/80 shadow-[0_24px_60px_-28px_rgba(60,64,67,0.5)]",
  } as const;
  return (
    <div
      className={cn(
        "grid place-items-center rounded-[2rem] border border-white/70 bg-gradient-to-br backdrop-blur-md",
        tints[tint],
        className,
      )}
    >
      {children}
    </div>
  );
}

function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/80 bg-white/90 px-3.5 py-2 text-xs font-medium text-ink shadow-soft backdrop-blur sm:text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HeroVisual({
  variant,
  className,
}: {
  variant: "overview" | "about";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate aspect-[5/4] w-full overflow-hidden rounded-[2rem] bg-[#dbe7fd]",
        className,
      )}
    >
      {/* colour wash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,#8ab4f8_0%,transparent_55%),radial-gradient(circle_at_8%_96%,#fde293_0%,transparent_52%),radial-gradient(circle_at_50%_55%,#eaf1fe_0%,transparent_72%)]" />
      {/* soft tile grid */}
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:56px_56px] opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />

      {variant === "overview" ? (
        <>
          <Float className="absolute inset-[8%_18%_8%_18%]" duration={8} distance={12}>
            <Illustration id="research-discovery" className="h-full w-full object-contain" />
          </Float>
          <Float className="absolute top-[8%] left-[6%]" duration={5.5} delay={0.4} distance={8}>
            <Chip className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-g-yellow" /> Start with one interest
            </Chip>
          </Float>
        </>
      ) : null}

      {variant === "about" ? (
        <Float className="absolute inset-[14%_10%_14%_12%]" duration={8} distance={10} rotate={-4}>
          <GlassTile tint="white" className="h-full w-full">
              <Image
                src="/gdgoc-mark.svg"
                alt=""
                width={272}
                height={151}
                unoptimized
                priority
                className="h-auto w-[62%]"
              />
            </GlassTile>
        </Float>
      ) : null}
    </div>
  );
}