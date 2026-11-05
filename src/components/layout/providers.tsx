"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/** Global motion settings: honour the user's "reduce motion" OS preference. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
