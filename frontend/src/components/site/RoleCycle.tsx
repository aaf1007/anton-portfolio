import { useEffect, useState, type CSSProperties } from "react";

const HOLD_MS = 3000;
const OUT_MS = 450;

const letters = (word: string) =>
  [...word].map((ch, i) => (
    <span key={i} style={{ "--i": i } as CSSProperties}>
      {ch}
    </span>
  ));

/** The line under the name: each role blurs out letter by letter as the next blurs in. */
export default function RoleCycle({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (roles.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setIndex((i) => {
        setLeaving(i);
        return (i + 1) % roles.length;
      });
    }, HOLD_MS);
    return () => clearInterval(t);
  }, [roles.length]);

  useEffect(() => {
    if (leaving === null) return;
    const t = window.setTimeout(() => setLeaving(null), OUT_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  return (
    <span className="s-role">
      <span className="sr-only">{roles.join(", ")}</span>
      {leaving !== null && (
        <span key={`out-${leaving}`} className="s-role-word is-leaving" aria-hidden>
          {letters(roles[leaving])}
        </span>
      )}
      <span key={`in-${index}`} className="s-role-word" aria-hidden>
        {letters(roles[index])}
      </span>
    </span>
  );
}
