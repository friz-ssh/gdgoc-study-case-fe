import * as React from "react";
import { cn } from "@/lib/utils";

/** Page-width wrapper: generous side margins on desktop, tight on mobile. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
