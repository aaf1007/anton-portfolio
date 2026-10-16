import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";
import { FLING_MS, firstPaint, takeFling } from "@/lib/go";
import { useLayoutEffect, useRef } from "react";

const latestFirst = [...projects].reverse();

/**
 * Arriving on works (not by deep link), the cards first stack into a small
 * fanned deck just above mid-screen, one after another, then deal out to
 * their places in the grid. After the home fling the deck waits for the
 * fling to clear. Wide screens only.
 */
function useDeal(ref: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid || firstPaint || innerWidth <= 1200 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const cards = [...grid.querySelectorAll<HTMLElement>(".work-card")];
    const n = cards.length;
    grid.classList.remove("stacking", "emerge");

    const since = takeFling();
    const wait = Math.max(0, FLING_MS + 120 - since); // the fling's tail
    const stackFor = (n - 1) * 95 + 300 + 25;
    const lead = Math.max(0, wait - stackFor - 120);
    const cx = innerWidth / 2;
    const cy = innerHeight * 0.44;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const k = i - (n - 1) / 2;
      card.style.setProperty("--sx", `${cx - (r.left + r.width / 2) + k * 9}px`);
      card.style.setProperty("--sy", `${cy - (r.top + r.height / 2) - Math.abs(k) * 3}px`);
      card.style.setProperty("--srot", `${k * 2.5}deg`);
      card.style.setProperty("--sscale", "0.35");
      card.style.animationDelay = `${lead + i * 95}ms`;
    });
    root.classList.add("works-arriving");
    grid.classList.add("is-dealing", "stacking");

    let settle = 0;
    const deal = window.setTimeout(() => {
      cards.forEach((card, i) => (card.style.animationDelay = `${i * 30}ms`));
      grid.classList.remove("stacking");
      grid.classList.add("emerge");
      settle = window.setTimeout(() => {
        root.classList.remove("works-arriving");
        grid.classList.remove("is-dealing", "emerge");
      }, 850 + (n - 1) * 30);
    }, Math.max(lead + stackFor, wait));

    return () => {
      clearTimeout(deal);
      clearTimeout(settle);
      root.classList.remove("works-arriving");
      grid.classList.remove("is-dealing", "stacking", "emerge");
      cards.forEach((card) => (card.style.animationDelay = ""));
    };
  }, [ref]);
}

export default function ProjectsPage() {
  const grid = useRef<HTMLDivElement>(null);
  useDeal(grid);

  return (
    <div className="works">
      <h1 className="sr-only">Works</h1>
      <div className="snap-col">
        <div ref={grid} className="works-grid">
          {latestFirst.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
