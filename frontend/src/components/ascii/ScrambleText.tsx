import { NOISE } from "@/lib/ascii/sample";
import { useCallback, useEffect, useRef, useState, type ElementType } from "react";

type ScrambleTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** When to decode: on mount, or the first time it scrolls into view. */
  trigger?: "mount" | "inView";
  /** Re-scramble on hover. */
  hover?: boolean;
  duration?: number;
  delay?: number;
  chars?: string;
};

/** Text that resolves out of random glyphs, character by character. */
export default function ScrambleText({
  text,
  as: Tag = "span",
  className,
  trigger = "inView",
  hover = false,
  duration = 900,
  delay = 0,
  chars = NOISE,
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);
  const rafRef = useRef(0);

  const run = useCallback(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(rafRef.current);
    const resolveAt = Array.from(text, (_, i) => (i / text.length) * 0.55 + Math.random() * 0.45);
    let start = -1;
    const step = (now: number) => {
      if (start < 0) start = now;
      const p = (now - start) / duration;
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        s += ch === " " || p >= resolveAt[i] ? ch : chars[(Math.random() * chars.length) | 0];
      }
      setOut(s);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else setOut(text);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [text, duration, chars]);

  useEffect(() => {
    const el = ref.current!;
    let timer = 0;
    const go = () => {
      timer = window.setTimeout(run, delay);
    };
    if (trigger === "mount") {
      go();
      return () => {
        window.clearTimeout(timer);
        cancelAnimationFrame(rafRef.current);
      };
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          go();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, delay, run]);

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      onPointerEnter={hover ? run : undefined}
    >
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
