import ScrambleText from "@/components/ascii/ScrambleText";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Huge expanded wordmark; letters rise out of a mask one after another. */
export function PageTitle({
  children,
  className,
  aside,
}: {
  children: string;
  className?: string;
  /** Small mono note set against the title's baseline, e.g. a count. */
  aside?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  // the widest glyphs run ~0.74em, so cap the size so the longest word fits the viewport
  const longest = Math.max(...words.map((w) => w.length));
  let n = 0;
  return (
    <div className={cn("flex flex-wrap items-end gap-x-4 gap-y-2", className)}>
      <h1
        aria-label={children}
        className="display text-foreground [--gutter:3.5rem] sm:[--gutter:7rem]"
        style={{
          fontSize: `min(clamp(3.1rem, 15vw, 8rem), calc((100vw - var(--gutter)) / ${(longest * 0.74).toFixed(2)}))`,
        }}
      >
        {words.map((word, w) => (
          <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            {Array.from(word).map((ch) => {
              const i = n++;
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.08 + i * 0.028 }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {w < words.length - 1 && " "}
          </span>
        ))}
      </h1>
      {aside && <div className="pb-[0.6em] text-[11px] text-muted-foreground">{aside}</div>}
    </div>
  );
}

/** Lowercase mono section label over a hairline rule. */
export function Label({
  children,
  className,
  right,
  as = "h2",
}: {
  children: string;
  className?: string;
  right?: ReactNode;
  as?: "h2" | "h3" | "p";
}) {
  return (
    <div
      className={cn(
        "mb-3.5 flex items-baseline justify-between gap-4 border-b border-rule pb-2 text-muted-foreground",
        className,
      )}
    >
      <ScrambleText as={as} text={children.toLowerCase()} className="text-[13px] font-normal" duration={700} />
      {right && <div className="text-[11px]">{right}</div>}
    </div>
  );
}

/** A block that fades up once it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}
