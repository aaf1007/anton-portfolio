import type { CSSProperties } from "react";

/** Staggered load-in (`.s-in`): the nth block rises in n × 70ms after the first. */
export const delay = (n: number) => ({ "--d": n }) as CSSProperties;
