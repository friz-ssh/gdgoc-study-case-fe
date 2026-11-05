"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const pathname = usePathname();

  // Clicking the logo always ends at the top of the home page. On "/" Next does
  // not navigate (same URL), so scroll ourselves; from another page, reset the
  // scroll first so the sticky header can't make the router skip the reset.
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Google Developer Groups on Campus, Universitas Gadjah Mada — home"
      className={cn("flex min-h-11 items-center gap-2.5 rounded-lg", className)}
    >
      <Image
        src="/gdgoc-logo.png"
        alt=""
        width={70}
        height={39}
        priority
        className="h-7 w-auto sm:h-8"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-normal tracking-tight text-ink sm:text-[1.3rem]">
          Google Developer Groups
        </span>
        <span className="mt-1 text-[0.6rem] font-medium text-ink sm:text-[0.72rem]">
          <span className="text-brand">On Campus</span> • Universitas Gadjah Mada
        </span>
      </span>
    </Link>
  );
}