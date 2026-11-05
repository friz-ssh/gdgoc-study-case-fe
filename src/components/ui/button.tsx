import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // min-h-11 = 44px: the minimum comfortable touch target
    "group/button inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5",
    "text-[0.9375rem] font-medium whitespace-nowrap select-none",
    "transition-[background-color,box-shadow,transform,color] duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform",
  ],
  {
    variants: {
      variant: {
        primary: "bg-action text-white shadow-sm hover:bg-brand",
        soft: "bg-brand-soft text-brand hover:bg-[#d2e3fc]",
        outline: "border border-line bg-white text-ink hover:bg-surface",
        ghost: "text-brand hover:bg-brand-soft",
        link: "px-0 text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "px-4 text-sm",
        lg: "min-h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
