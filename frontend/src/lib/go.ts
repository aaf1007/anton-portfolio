/**
 * Moving between the dock's pages, with the two special trips:
 * home → works flings the hero up off the screen before works deals its
 * cards out, and works → home pushes the cards down while home scrolls back
 * in from above. Everything else is a plain route change (the page fades in).
 */

type Navigate = (to: string) => void;

let navigate: Navigate = () => {};
let busy = false;

/** When the home → works fling started (ms, performance.now), for the deal's timing. */
export let flingAt = 0;
/** True until the first route has rendered: a deep link lands settled, without the deal. */
export let firstPaint = true;
export const markPainted = () => {
  firstPaint = false;
};

export const FLING_MS = 400;

/** How long ago the fling started, once (then forgotten). */
export function takeFling(): number {
  const since = flingAt ? performance.now() - flingAt : Infinity;
  flingAt = 0;
  return since;
}
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function bindNavigate(fn: Navigate) {
  navigate = fn;
}

const page = () => document.querySelector<HTMLElement>("#main > .page");

export function go(to: string) {
  if (busy || document.documentElement.classList.contains("tank-mode")) return;
  const from = location.pathname;
  if (to === from) return;

  // home → works: the hero flicks up and away, then works deals in
  if (from === "/" && to === "/projects" && !reduce() && innerWidth > 480) {
    busy = true;
    page()?.classList.add("leaving");
    flingAt = performance.now();
    window.setTimeout(() => {
      busy = false;
      navigate(to);
    }, FLING_MS);
    return;
  }

  // works → home (desktop): the cards fall away down the screen as home arrives from above
  if (from === "/projects" && to === "/" && !reduce() && innerWidth > 1200) {
    const grid = document.querySelector<HTMLElement>(".works-grid");
    if (grid) pushCardsDown(grid);
    document.documentElement.classList.add("home-arriving");
    window.setTimeout(() => document.documentElement.classList.remove("home-arriving"), 600);
  }
  navigate(to);
}

/** Copy the works grid into a fixed layer where it is, and let every card drop out of view. */
function pushCardsDown(grid: HTMLElement) {
  const r = grid.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "works-pushing";
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:20;pointer-events:none`;
  const clone = grid.cloneNode(true) as HTMLElement;
  const cards = grid.querySelectorAll<HTMLElement>(".work-card");
  clone.querySelectorAll<HTMLElement>(".work-card").forEach((c, i) => {
    const cs = getComputedStyle(cards[i]);
    c.style.setProperty("--push-from", cs.transform === "none" ? "translate(0, 0)" : cs.transform);
    c.style.setProperty("--push-op", cs.opacity);
    c.style.animationDelay = "0ms";
  });
  clone.querySelectorAll("video").forEach((v) => v.remove());
  layer.appendChild(clone);
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 580);
}
