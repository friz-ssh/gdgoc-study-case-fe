import * as React from "react";
import type { LucideProps } from "lucide-react";
import { iconFor } from "./icon-map";

/**
 * Renders the Lucide icon mapped to an API entity id. Use this instead of
 * assigning `iconFor(id)` to a local variable when the id comes from async
 * state, so the icon component is not treated as created during render.
 */
export function EntityIcon({ id, ...props }: { id: string } & LucideProps) {
  return React.createElement(iconFor(id), props);
}
