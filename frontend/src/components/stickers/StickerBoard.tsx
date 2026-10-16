import { play } from "@/lib/sfx";
import { useEffect, useMemo, useRef } from "react";
import { STICKERS, stickerSrc, type StickerKey } from "./art";
import "./stickers.css";

/**
 * The quests page's sign-off: a sticker sheet, a to-do list on lined paper
 * and a photo, laid on the desk. Hover a sticker and its corner lifts; drag
 * and it peels back along the fold, flips over and comes away in your hand.
 * Drop it anywhere from the board to the end of the page (it remembers, per
 * browser); drop one back on the sheet to put it away. RESET brings the
 * defaults (and the to-do) back.
 *
 * The markup is static React; everything that moves is driven imperatively
 * in mountBoard, which owns the placed stickers inside the catch area.
 */

const STICKERS_KEY = "anton-stickers-v1";
const TODO_KEY = "anton-todo-v1";

const TODO = [
  "rebuild my portfolio",
  "ship Chewws to the App Store",
  "learn PyTorch past the fundamentals",
  "finish The Pragmatic Programmer",
];
const TODO_DEFAULT = [true, false, false, false];

/** an anchor on the paper or photo: fractions of that element's box */
type Anchor = { at: "paper" | "photo"; x: number; y: number };
type Placed = {
  key: StickerKey;
  tall: boolean;
  /** centre, as fractions of the catch area */
  fx: number;
  fy: number;
  rot: number;
  /** defaults only: pinned to the paper / photo (desktop, mobile) until first moved */
  dk?: Anchor;
  m?: Anchor;
  d?: [number, number];
};

const DEFAULTS: Omit<Placed, "d">[] = [
  { key: "leaf", tall: false, fx: 0.7, fy: 0.17, rot: 12, dk: { at: "paper", x: 0.85, y: 0.003 }, m: { at: "paper", x: 0.9, y: 0.03 } },
  { key: "pet", tall: false, fx: 0.891, fy: 0.94, rot: -8, dk: { at: "photo", x: 0.76, y: 1.04 }, m: { at: "photo", x: 0.03, y: 0.92 } },
];

/* ------------------------------------------------------------------ tweens */
const EASE = {
  out2: (t: number) => 1 - Math.pow(1 - t, 3),
  out3: (t: number) => 1 - Math.pow(1 - t, 4),
};
function tweener() {
  const live = new Map<object, number>();
  const kill = (o: object) => {
    const id = live.get(o);
    if (id) cancelAnimationFrame(id);
    live.delete(o);
  };
  const to = <T extends object>(
    o: T,
    key: keyof T & string,
    target: number,
    seconds: number,
    ease: (t: number) => number,
    onUpdate?: () => void,
    onComplete?: () => void,
  ) => {
    kill(o);
    const rec = o as Record<string, number>;
    const from = rec[key];
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / (seconds * 1000));
      rec[key] = from + (target - from) * ease(k);
      onUpdate?.();
      if (k < 1) live.set(o, requestAnimationFrame(step));
      else {
        live.delete(o);
        onComplete?.();
      }
    };
    live.set(o, requestAnimationFrame(step));
  };
  return { to, kill, killAll: () => [...live.keys()].forEach(kill) };
}

/* -------------------------------------------------------------- geometry */
type Pt = [number, number];
const CORNERS: Pt[] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
/** the part of a (padded) square on one side of a line */
function clipSide(size: number, through: Pt, n: Pt, side: number, rect?: number[]): Pt[] {
  const P = 10;
  const r = rect ?? [-P, -P, size + P, size + P];
  const quad: Pt[] = [
    [r[0], r[1]],
    [r[2], r[1]],
    [r[2], r[3]],
    [r[0], r[3]],
  ];
  const out: Pt[] = [];
  const dist = (p: Pt) => side * ((p[0] - through[0]) * n[0] + (p[1] - through[1]) * n[1]);
  for (let i = 0; i < 4; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % 4];
    const da = dist(a);
    const db = dist(b);
    if (da >= 0) out.push(a);
    if (da >= 0 !== db >= 0) {
      const t = da / (da - db);
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  }
  return out;
}
const polygon = (pts: Pt[], off: number) =>
  pts.length ? `polygon(${pts.map((p) => `${(p[0] + off).toFixed(2)}px ${(p[1] + off).toFixed(2)}px`).join(", ")})` : "polygon(0 0, 0 0, 0 0)";
function area(pts: Pt[]) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return Math.abs(s) / 2;
}

/* ------------------------------------------------------------ baked art */
const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
/** a square dilation, done as a horizontal then a vertical smear */
function dilate(src: HTMLCanvasElement, r: number) {
  const a = canvas(src.width, src.height);
  const b = canvas(src.width, src.height);
  const ax = a.getContext("2d")!;
  const bx = b.getContext("2d")!;
  for (let i = -r; i <= r; i++) ax.drawImage(src, i, 0);
  for (let i = -r; i <= r; i++) bx.drawImage(a, 0, i);
  return b;
}
function tint(src: HTMLCanvasElement, color: string) {
  const c = canvas(src.width, src.height);
  const x = c.getContext("2d")!;
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}
const blobURL = (c: HTMLCanvasElement) =>
  new Promise<string>((ok, fail) => c.toBlob((b) => (b ? ok(URL.createObjectURL(b)) : fail()), "image/png"));

/* ---------------------------------------------------------------- the board */
type Peel = {
  el: HTMLElement;
  p: number;
  dragging: boolean;
  /** coverage of art near each corner, to pick a corner that has something to lift */
  art: number[] | null;
  bb: number[];
  v: Pt;
  corner: Pt;
  dir: Pt;
  box: HTMLElement;
  front: HTMLElement;
  flap: HTMLElement;
  back: HTMLImageElement;
  shade: HTMLElement;
  fold: HTMLElement;
  bakedKey?: string | null;
  bakedUrls?: string[];
};

function mountBoard(board: HTMLElement): () => void {
  const sheet = board.querySelector<HTMLElement>(".sq-board-sheet")!;
  const grid = board.querySelector<HTMLElement>(".sq-board-grid")!;
  const zone = board.querySelector<HTMLElement>(".sq-board-area")!;
  const reset = board.querySelector<HTMLButtonElement>(".sq-board-reset")!;
  const choices = [...sheet.querySelectorAll<HTMLElement>(".sq-board-choice")];
  const todoItems = [...board.querySelectorAll<HTMLElement>(".sq-board-todo li")];
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrow = matchMedia("(max-width: 900px)");
  const tw = tweener();
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn as EventListener);
    cleanups.push(() => el.removeEventListener(type, fn as EventListener));
  };

  /* the catch area: the page's full width, from the board down to the page's end */
  function sizeZone() {
    const r = board.getBoundingClientRect();
    if (!r.width) return;
    let top = 0;
    let left = 0;
    for (let n: HTMLElement | null = board; n; n = n.offsetParent as HTMLElement | null) {
      top += n.offsetTop;
      left += n.offsetLeft;
    }
    zone.style.display = "none";
    const page = Math.max(root.scrollHeight, document.body.scrollHeight);
    zone.style.display = "";
    zone.style.left = -left + "px";
    zone.style.width = document.body.clientWidth + "px";
    zone.style.height = Math.max(r.height, page - top) + "px";
    const grew = Math.max(root.scrollHeight, document.body.scrollHeight) - page;
    if (grew > 0) zone.style.height = Math.max(r.height, page - top - grew) + "px";
  }
  /** grid fractions → catch-area fractions */
  function gridToZone(x: number, y: number): Pt {
    const g = grid.getBoundingClientRect();
    const z = zone.getBoundingClientRect();
    return !z.width || !z.height ? [x, y] : [(g.left - z.left + x * g.width) / z.width, (g.top - z.top + y * g.height) / z.height];
  }

  let placed: Placed[] = [];
  let moved = false;
  const choiceOf = (key: string) => choices.find((c) => c.dataset.key === key);

  function sizeVars() {
    const plain = sheet.querySelector<HTMLElement>(".sq-board-choice:not(.is-tall):not([data-k]) .sq-peel");
    const tall = sheet.querySelector<HTMLElement>(".sq-board-choice.is-tall .sq-peel");
    if (plain?.offsetWidth) root.style.setProperty("--sticker-size", plain.offsetWidth + "px");
    if (tall?.offsetWidth) root.style.setProperty("--sticker-size-tall", tall.offsetWidth + "px");
  }
  const sizeRO = new ResizeObserver(sizeVars);
  sizeRO.observe(sheet);
  sizeVars();

  const defaults = (): Placed[] => DEFAULTS.map((p) => ({ ...p, d: [p.fx, p.fy] }));
  function load() {
    placed = defaults();
    try {
      const raw = localStorage.getItem(STICKERS_KEY);
      if (raw) {
        placed = (JSON.parse(raw) as Placed[]).filter((p) => choiceOf(p.key));
        moved = true;
      }
    } catch {
      /* corrupt or blocked: the defaults */
    }
  }
  function save() {
    moved = true;
    try {
      localStorage.setItem(STICKERS_KEY, JSON.stringify(placed));
    } catch {
      /* not remembered */
    }
  }
  const syncReset = () => reset.classList.toggle("is-live", moved);

  function position(el: HTMLElement, p: Placed) {
    const z = zone.getBoundingClientRect();
    const anchor = p.d ? (narrow.matches ? p.m : p.dk) : null;
    if (anchor) {
      const host = board.querySelector(anchor.at === "paper" ? ".sq-board-paper" : ".sq-board-photo")!.getBoundingClientRect();
      if (host.width && z.width) {
        p.fx = (host.left + anchor.x * host.width - z.left) / z.width;
        p.fy = (host.top + anchor.y * host.height - z.top) / z.height;
      } else if (p.d) {
        [p.fx, p.fy] = gridToZone(p.d[0], p.d[1]);
      }
    }
    el.style.transform = `translate(${p.fx * z.width}px, ${p.fy * z.height}px) translate(-50%, -50%) rotate(${p.rot}deg)`;
  }
  const bakedFor = (key: string) => peels.find((s) => s.el.dataset.key === key && s.el.classList.contains("is-baked"))?.bakedUrls ?? null;
  /** keep a dropped sticker wholly inside the catch area */
  function clampIn(el: HTMLElement, p: Placed) {
    const z = zone.getBoundingClientRect();
    const r = (el.querySelector("img") ?? el).getBoundingClientRect();
    if (!z.width || !z.height) return;
    const mx = (r.width / 2 + 1) / z.width;
    const my = (r.height / 2 + 1) / z.height;
    p.fx = Math.max(mx, Math.min(1 - mx, p.fx));
    p.fy = Math.max(my, Math.min(1 - my, p.fy));
    position(el, p);
  }
  const overSheet = (x: number, y: number) => {
    const r = sheet.getBoundingClientRect();
    const pad = 16;
    return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
  };
  const inZone = (x: number, y: number) => {
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  function stickerEl(p: Placed) {
    const el = document.createElement("span");
    el.className = "sq-board-sticker" + (p.tall ? " is-tall" : "");
    el.dataset.key = p.key;
    const k = choiceOf(p.key)?.dataset.k;
    if (k) el.style.setProperty("--k", k);
    const baked = bakedFor(p.key);
    if (baked) el.classList.add("is-baked");
    const img = document.createElement("img");
    img.src = baked ? baked[0] : stickerSrc(p.key);
    img.alt = "";
    img.draggable = false;
    el.appendChild(img);
    position(el, p);
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-lifted");
      delete p.m;
      delete p.dk;
      delete p.d;
      p.rot = Math.random() * 30 - 15;
      const z = zone.getBoundingClientRect();
      const start = { px: e.clientX, py: e.clientY, fx: p.fx, fy: p.fy };
      const move = (ev: PointerEvent) => {
        p.fx = start.fx + (ev.clientX - start.px) / z.width;
        p.fy = start.fy + (ev.clientY - start.py) / z.height;
        position(el, p);
      };
      const up = (ev: PointerEvent) => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.classList.remove("is-lifted");
        if (overSheet(ev.clientX, ev.clientY)) {
          // dropped back on the sheet: put away
          placed = placed.filter((x) => x !== p);
          el.remove();
        } else clampIn(el, p);
        save();
        syncReset();
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
    return el;
  }
  function renderPlaced() {
    zone.querySelectorAll(".sq-board-sticker").forEach((n) => n.remove());
    placed.forEach((p) => zone.appendChild(stickerEl(p)));
    syncReset();
  }

  /* ------------------------------------------------------------- the peel */
  const HOVER = 0.15;
  const PRESS = 0.22;
  const DETACH = 0.125;

  function peelState(el: HTMLElement): Peel {
    return {
      el,
      p: 0,
      dragging: false,
      art: null,
      bb: [0, 0, 1, 1],
      v: [0, 0],
      corner: [1, 1],
      dir: [-Math.SQRT1_2, -Math.SQRT1_2],
      box: el.querySelector(".sq-peel")!,
      front: el.querySelector(".sq-peel-front")!,
      flap: el.querySelector(".sq-peel-flap")!,
      back: el.querySelector(".sq-peel-back")!,
      shade: el.querySelector(".sq-peel-flap-shade")!,
      fold: el.querySelector(".sq-peel-fold")!,
    };
  }
  /** measure the art: its bounding box, and how much of it sits near each corner */
  function analyse(s: Peel, src: string) {
    const img = new Image();
    img.onload = () => {
      try {
        const N = 48;
        const c = canvas(N, N);
        const x = c.getContext("2d")!;
        const k = Math.min(N / img.naturalWidth, N / img.naturalHeight);
        const w = img.naturalWidth * k;
        const h = img.naturalHeight * k;
        x.drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
        const d = x.getImageData(0, 0, N, N).data;
        let l = N;
        let t = N;
        let r = -1;
        let b = -1;
        for (let yy = 0; yy < N; yy++)
          for (let xx = 0; xx < N; xx++)
            if (d[(yy * N + xx) * 4 + 3] > 96) {
              l = Math.min(l, xx);
              r = Math.max(r, xx);
              t = Math.min(t, yy);
              b = Math.max(b, yy);
            }
        if (r < 0) return;
        s.bb = [l / N, t / N, (r + 1) / N, (b + 1) / N];
        const reach = 2 * HOVER * N * 1.15;
        s.art = CORNERS.map(([cx, cy]) => {
          const ex = cx ? r + 1 : l;
          const ey = cy ? b + 1 : t;
          let hit = 0;
          let all = 0;
          for (let yy = 0; yy < N; yy++)
            for (let xx = 0; xx < N; xx++) {
              const dx = cx ? ex - xx : xx + 1 - ex;
              const dy = cy ? ey - yy : yy + 1 - ey;
              if (dx > 0 && dy > 0 && dx + dy <= reach) {
                all++;
                if (d[(yy * N + xx) * 4 + 3] > 96) hit++;
              }
            }
          return all ? hit / all : 0;
        });
      } catch {
        /* keep the defaults */
      }
    };
    img.src = src;
  }
  const reachOf = (s: Peel, w: number) => (Math.SQRT2 * w * (s.bb[2] - s.bb[0] + (s.bb[3] - s.bb[1]))) / 2;
  const cornerPt = (s: Peel, w: number): Pt => [s.bb[s.corner[0] ? 2 : 0] * w, s.bb[s.corner[1] ? 3 : 1] * w];
  /** lift the corner nearest the pointer, unless it's empty air */
  function pickCorner(s: Peel, x: number, y: number) {
    const r = s.box.getBoundingClientRect();
    let cx = x - r.left < r.width / 2 ? 0 : 1;
    let cy = y - r.top < r.height / 2 ? 0 : 1;
    if (s.art) {
      const i = CORNERS.findIndex((c) => c[0] === cx && c[1] === cy);
      if (s.art[i] < 0.1) {
        let best = 0;
        s.art.forEach((a, j) => {
          if (a > s.art![best]) best = j;
        });
        [cx, cy] = CORNERS[best];
      }
    }
    s.corner = [cx, cy];
    s.dir = [(cx ? -1 : 1) * Math.SQRT1_2, (cy ? -1 : 1) * Math.SQRT1_2];
  }
  /** draw the fold; returns how much of the art is still stuck down (0..1) */
  function drawPeel(s: Peel): number {
    const w = s.box.getBoundingClientRect().width;
    const reach = reachOf(s, w);
    const v: Pt = s.dragging ? s.v : [s.dir[0] * s.p * 2 * reach, s.dir[1] * s.p * 2 * reach];
    const len = Math.hypot(v[0], v[1]);
    if (len < 0.5) {
      s.front.style.clipPath = "none";
      s.flap.style.visibility = "hidden";
      s.el.classList.remove("is-peeling");
      return 1;
    }
    s.el.classList.add("is-peeling");
    const c = cornerPt(s, w);
    const n: Pt = [v[0] / len, v[1] / len];
    const mid: Pt = [c[0] + v[0] / 2, c[1] + v[1] / 2];
    const mirror = (p: Pt): Pt => {
      const k = 2 * ((p[0] - mid[0]) * n[0] + (p[1] - mid[1]) * n[1]);
      return [p[0] - k * n[0], p[1] - k * n[1]];
    };
    const stuck = clipSide(w, mid, n, 1);
    const lifted = clipSide(w, mid, n, -1).map(mirror);
    s.front.style.clipPath = polygon(stuck, 0);
    s.flap.style.clipPath = polygon(lifted, 1.5 * w);
    s.flap.style.visibility = "visible";
    const t = Math.min(1, len / reach);
    const off = 1 + t * 3;
    const blur = 1.2 + t * t * 6;
    const alpha = 0.22 - t * 0.08;
    s.shade.style.filter = `drop-shadow(${(n[0] * off).toFixed(1)}px ${(n[1] * off + 1).toFixed(1)}px ${blur.toFixed(1)}px rgba(0, 0, 0, ${alpha.toFixed(3)})) drop-shadow(0 0.5px 1px rgba(0, 0, 0, 0.12))`;
    // the flap is the art reflected across the fold line
    const a = 1 - 2 * n[0] * n[0];
    const b = -2 * n[0] * n[1];
    const d = 1 - 2 * n[1] * n[1];
    const e = 2 * (mid[0] * n[0] + mid[1] * n[1]);
    s.back.style.transform = `matrix(${a}, ${b}, ${b}, ${d}, ${e * n[0]}, ${e * n[1]})`;
    s.fold.style.transform = s.back.style.transform;
    // a soft shadow running along the crease
    const span = 1.4 * w;
    const g: Pt = [-n[0], -n[1]];
    const L = span * Math.abs(g[0]) + span * Math.abs(g[1]);
    const T: Pt = [mid[0] + 0.2 * w, mid[1] + 0.2 * w];
    const at = ((T[0] - span / 2) * g[0] + (T[1] - span / 2) * g[1]) / L + 0.5;
    const width = Math.max(3, Math.min(len * 0.3, w * 0.3));
    const end = at + width / L;
    const midStop = at + (width * 0.35) / L;
    const deg = (Math.atan2(g[0], -g[1]) * 180) / Math.PI;
    s.fold.style.background = `linear-gradient(${deg.toFixed(1)}deg, rgba(0, 0, 0, 0.16) ${(at * 100).toFixed(2)}%, rgba(0, 0, 0, 0.07) ${(midStop * 100).toFixed(2)}%, rgba(0, 0, 0, 0) ${(end * 100).toFixed(2)}%)`;
    const bb = [s.bb[0] * w, s.bb[1] * w, s.bb[2] * w, s.bb[3] * w];
    return area(clipSide(w, mid, n, 1, bb)) / Math.max(1, (bb[2] - bb[0]) * (bb[3] - bb[1]));
  }
  /** pre-render the die-cut (and its white back and grey depression) as PNGs, so the fold can mask with them */
  function bake(s: Peel) {
    const r = s.box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const key = `${Math.round(r.width * dpr)}x${Math.round(r.height * dpr)}`;
    if (s.bakedKey === key) return;
    s.bakedKey = key;
    const img = new Image();
    img.src = s.el.dataset.src!;
    img
      .decode()
      .then(() => {
        if (s.bakedKey !== key) return;
        const W = Math.round(r.width * 1.4 * dpr);
        const H = Math.round(r.height * 1.4 * dpr);
        const art = canvas(W, H);
        const x = art.getContext("2d")!;
        x.imageSmoothingEnabled = false;
        const k = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
        const w = img.naturalWidth * k * dpr;
        const h = img.naturalHeight * k * dpr;
        x.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        const cut = canvas(W, H);
        const cx = cut.getContext("2d")!;
        cx.drawImage(tint(dilate(art, Math.round(6 * dpr)), "rgba(228, 225, 222, 0.9)"), 0, 0);
        cx.drawImage(tint(dilate(art, Math.round(5 * dpr)), "#ffffff"), 0, 0);
        cx.drawImage(art, 0, 0);
        return Promise.all([blobURL(cut), blobURL(tint(cut, "rgb(247, 247, 247)")), blobURL(tint(cut, "rgb(230, 230, 230)"))]).then((urls) => {
          if (s.bakedKey !== key) {
            urls.forEach((u) => URL.revokeObjectURL(u));
            return;
          }
          const old = s.bakedUrls ?? [];
          s.bakedUrls = urls;
          return Promise.all(
            urls.map((u) => {
              const i = new Image();
              i.src = u;
              return i.decode().catch(() => {});
            }),
          ).then(() => {
            if (s.bakedKey !== key) return;
            s.front.querySelector("img")!.src = urls[0];
            s.back.src = urls[1];
            const dep = s.el.querySelector<HTMLImageElement>(".sq-peel-depression");
            if (dep) dep.src = urls[2];
            s.fold.style.maskImage = s.fold.style.webkitMaskImage = `url(${urls[1]})`;
            s.el.classList.add("is-baked");
            zone.querySelectorAll<HTMLElement>(".sq-board-sticker").forEach((st) => {
              if (st.dataset.key !== s.el.dataset.key) return;
              st.querySelector("img")!.src = urls[0];
              st.classList.add("is-baked");
            });
            old.forEach((u) => URL.revokeObjectURL(u));
          });
        });
      })
      .catch(() => {
        s.bakedKey = null;
      });
  }
  function tweenPeel(s: Peel, to: number, seconds: number, ease: (t: number) => number) {
    tw.kill(s);
    if (still) {
      s.p = to;
      drawPeel(s);
      return;
    }
    tw.to(s, "p", to, seconds, ease, () => drawPeel(s));
  }

  const peels: Peel[] = [];
  let bakeTimer = 0;
  const bakeRO = new ResizeObserver(() => {
    clearTimeout(bakeTimer);
    bakeTimer = window.setTimeout(() => peels.forEach(bake), 200);
  });
  bakeRO.observe(sheet);

  for (const el of choices) {
    const s = peelState(el);
    peels.push(s);
    analyse(s, el.dataset.src!);
    let holding = false;
    on(el, "pointerenter", (e) => {
      if (e.pointerType === "mouse" && !holding) {
        pickCorner(s, e.clientX, e.clientY);
        tweenPeel(s, HOVER, 0.3, EASE.out2);
      }
    });
    on(el, "pointerleave", (e) => {
      if (e.pointerType === "mouse" && !holding) tweenPeel(s, 0, 0.35, EASE.out2);
    });
    on(el, "pointerdown", (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      holding = true;
      const tall = el.classList.contains("is-tall");
      let origin = { x: e.clientX, y: e.clientY };
      let off = false; // came away from the sheet
      let tearing = false;
      let last = { x: e.clientX, y: e.clientY };
      let ghost: HTMLElement | null = null;
      let flip: HTMLElement | null = null;
      let flipping: {
        t: number;
        cx: number;
        cy: number;
        ax: number;
        ay: number;
        sc: number;
        W: number;
        M: Pt;
        n: Pt;
        pct: (v: number) => string;
      } | null = null;
      let faces: HTMLImageElement[] = [];
      const rot = Math.random() * 30 - 15;

      function moveGhost(x: number, y: number) {
        if (!ghost) return;
        if (flipping) {
          const f = flipping;
          const t = f.t;
          const gx = f.cx + (x - f.cx) * t;
          const gy = f.cy + (y - f.cy) * t;
          ghost.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%) rotate(${rot * t}deg) scale(${f.sc + (1 - f.sc) * t})`;
          flip!.style.transform = `rotate3d(${f.ax}, ${f.ay}, 0, ${180 * (1 - t)}deg)`;
          const u = Math.min(1, t * 2);
          const clip =
            u < 1
              ? `polygon(${clipSide(f.W, [f.M[0] + f.n[0] * u * 2 * f.W, f.M[1] + f.n[1] * u * 2 * f.W], f.n, -1)
                  .map((p) => `${f.pct(p[0])}% ${f.pct(p[1])}%`)
                  .join(", ")})`
              : "none";
          faces.forEach((img) => (img.style.clipPath = clip));
          return;
        }
        faces.forEach((img) => (img.style.clipPath = ""));
        ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;
        if (flip) flip.style.transform = "none";
      }
      function makeGhost() {
        ghost = document.createElement("span");
        ghost.className = "sq-board-ghost" + (tall ? " is-tall" : "");
        if (el.dataset.k) ghost.style.setProperty("--k", el.dataset.k);
        ghost.style.visibility = "hidden";
        flip = document.createElement("span");
        flip.className = "sq-board-ghost-flip";
        const baked = bakedFor(el.dataset.key!);
        if (baked) ghost.classList.add("is-baked");
        const backImg = document.createElement("img");
        backImg.src = baked ? baked[1] : el.dataset.src!;
        backImg.alt = "";
        backImg.className = "sq-board-ghost-back";
        const frontImg = document.createElement("img");
        frontImg.src = baked ? baked[0] : el.dataset.src!;
        frontImg.alt = "";
        flip.append(backImg, frontImg);
        ghost.appendChild(flip);
        faces = [backImg, frontImg];
        faces.forEach((img) => img.decode().catch(() => {}));
        document.body.appendChild(ghost);
      }
      function detach(x: number, y: number) {
        off = true;
        play("peel");
        el.classList.add("is-peeled");
        if (!ghost) makeGhost();
        ghost!.style.visibility = "";
        const baked = bakedFor(el.dataset.key!);
        const r = s.box.getBoundingClientRect();
        const w = r.width;
        const len = Math.hypot(s.v[0], s.v[1]);
        if (!still && s.dragging && len > 0.5) {
          // the ghost starts as the lifted flap (back up) and flips over into your hand
          const n: Pt = [s.v[0] / len, s.v[1] / len];
          const c = cornerPt(s, w);
          const M: Pt = [c[0] + s.v[0] / 2, c[1] + s.v[1] / 2];
          const k = 2 * ((w / 2 - M[0]) * n[0] + (w / 2 - M[1]) * n[1]);
          const centre: Pt = [w / 2 - k * n[0], w / 2 - k * n[1]];
          flipping = {
            t: 0,
            cx: r.left + centre[0],
            cy: r.top + centre[1],
            ax: -n[1],
            ay: n[0],
            sc: w / (ghost!.getBoundingClientRect().width || w),
            W: w,
            M,
            n,
            pct: baked ? (v) => (((v + 0.2 * w) / (1.4 * w)) * 100).toFixed(2) : (v) => ((v / w) * 100).toFixed(2),
          };
          tw.to(
            flipping,
            "t",
            1,
            0.28,
            EASE.out2,
            () => moveGhost(last.x, last.y),
            () => {
              flipping = null;
              moveGhost(last.x, last.y);
            },
          );
        }
        moveGhost(x, y);
      }
      function tear() {
        tearing = true;
        tw.kill(s);
        detach(last.x, last.y);
      }

      if (!(s.p > 0.001)) pickCorner(s, e.clientX, e.clientY);
      makeGhost();
      if (still) detach(e.clientX, e.clientY);
      else tweenPeel(s, PRESS, 0.26, EASE.out2);

      let pending: PointerEvent | null = null;
      let raf = 0;
      const queue = (ev: PointerEvent) => {
        pending = ev;
        if (!raf)
          raf = requestAnimationFrame(() => {
            raf = 0;
            if (pending) {
              const p = pending;
              pending = null;
              step(p);
            }
          });
      };
      function step(ev: PointerEvent) {
        last = { x: ev.clientX, y: ev.clientY };
        if (off) {
          moveGhost(ev.clientX, ev.clientY);
          return;
        }
        if (tearing) return;
        const w = s.box.getBoundingClientRect().width;
        const reach = reachOf(s, w);
        if (!s.dragging) {
          tw.kill(s);
          s.dragging = true;
          s.v = [s.dir[0] * s.p * 2 * reach, s.dir[1] * s.p * 2 * reach];
          origin = { x: ev.clientX, y: ev.clientY };
        }
        const base: Pt = [s.dir[0] * PRESS * 2 * reach, s.dir[1] * PRESS * 2 * reach];
        s.v = [base[0] + (ev.clientX - origin.x), base[1] + (ev.clientY - origin.y)];
        if (drawPeel(s) <= DETACH) tear();
      }
      function release(ev: PointerEvent) {
        el.removeEventListener("pointermove", queue);
        el.removeEventListener("pointerup", release);
        el.removeEventListener("pointercancel", release);
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        if (pending) {
          const p = pending;
          pending = null;
          step(p);
        }
        holding = false;
        if (off) {
          if (flipping) {
            tw.kill(flipping);
            flipping = null;
          }
          ghost?.remove();
          if (inZone(ev.clientX, ev.clientY) && !overSheet(ev.clientX, ev.clientY)) {
            const z = zone.getBoundingClientRect();
            const p: Placed = {
              key: el.dataset.key as StickerKey,
              tall,
              fx: (ev.clientX - z.left) / z.width,
              fy: (ev.clientY - z.top) / z.height,
              rot,
            };
            placed.push(p);
            const st = stickerEl(p);
            zone.appendChild(st);
            clampIn(st, p);
            save();
          }
          s.dragging = false;
          s.p = 0;
          drawPeel(s);
          el.classList.remove("is-peeled");
        } else {
          ghost?.remove();
          ghost = null;
          if (s.dragging) {
            // let go mid-peel: it settles back down from wherever the corner was
            const w = s.box.getBoundingClientRect().width;
            const len = Math.hypot(s.v[0], s.v[1]);
            s.p = len / (2 * reachOf(s, w));
            s.dir = [s.v[0] / Math.max(1e-6, len), s.v[1] / Math.max(1e-6, len)];
            s.dragging = false;
          }
          tweenPeel(s, 0, 0.4, EASE.out3);
        }
        syncReset();
      }
      el.addEventListener("pointermove", queue);
      el.addEventListener("pointerup", release);
      el.addEventListener("pointercancel", release);
      cleanups.push(() => {
        el.removeEventListener("pointermove", queue);
        el.removeEventListener("pointerup", release);
        el.removeEventListener("pointercancel", release);
        ghost?.remove();
      });
    });
  }

  /* ------------------------------------------------------------- the to-do */
  let done = TODO_DEFAULT.slice();
  const mark = (i: number, on: boolean) => {
    todoItems[i].classList.toggle("is-done", on);
    todoItems[i].setAttribute("aria-checked", on ? "true" : "false");
  };
  try {
    const raw = localStorage.getItem(TODO_KEY);
    const saved = raw ? (JSON.parse(raw) as unknown) : null;
    if (Array.isArray(saved) && saved.length === done.length) done = saved.map(Boolean);
  } catch {
    /* the defaults */
  }
  done.forEach((v, i) => mark(i, v));
  todoItems.forEach((li, i) => {
    const toggle = () => {
      done[i] = !done[i];
      mark(i, done[i]);
      try {
        localStorage.setItem(TODO_KEY, JSON.stringify(done));
      } catch {
        /* not remembered */
      }
      moved = true;
      syncReset();
    };
    on(li, "click", toggle);
    on(li, "keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    });
  });

  on(reset, "click", () => {
    try {
      localStorage.removeItem(STICKERS_KEY);
      localStorage.removeItem(TODO_KEY);
    } catch {
      /* nothing to clear */
    }
    moved = false;
    placed = defaults();
    renderPlaced();
    done = TODO_DEFAULT.slice();
    done.forEach((v, i) => mark(i, v));
  });

  let layoutFrame = 0;
  const layoutRO = new ResizeObserver(() => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      sizeZone();
      zone.querySelectorAll<HTMLElement>(".sq-board-sticker").forEach((st, i) => {
        if (placed[i]) position(st, placed[i]);
      });
    });
  });
  layoutRO.observe(grid);
  layoutRO.observe(document.body);
  sizeZone();
  load();
  renderPlaced();

  return () => {
    tw.killAll();
    cancelAnimationFrame(layoutFrame);
    clearTimeout(bakeTimer);
    sizeRO.disconnect();
    bakeRO.disconnect();
    layoutRO.disconnect();
    cleanups.forEach((f) => f());
    zone.querySelectorAll(".sq-board-sticker").forEach((n) => n.remove());
    document.querySelectorAll(".sq-board-ghost").forEach((n) => n.remove());
    peels.forEach((s) => s.bakedUrls?.forEach((u) => URL.revokeObjectURL(u)));
    root.style.removeProperty("--sticker-size");
    root.style.removeProperty("--sticker-size-tall");
  };
}

/* ------------------------------------------------------------------ markup */

/** the sheet's label: a little cube-shaped badge */
function PackBadge() {
  return (
    <svg className="sq-board-pack" viewBox="0 0 100 100" aria-hidden>
      <path d="M50 6 89 28.5v43L50 94 11 71.5v-43Z" fill="#e3f0ea" stroke="#9cc8b1" strokeWidth="3" strokeLinejoin="round" />
      <path d="M11 28.5 50 51l39-22.5M50 51v43" fill="none" stroke="#9cc8b1" strokeWidth="2" strokeLinejoin="round" opacity="0.55" />
      <g fontFamily="DM Mono, monospace" fontSize="11.5" fill="#5f9c7d" textAnchor="middle">
        <text x="50" y="40">anton&rsquo;s</text>
        <text x="50" y="54">sticker</text>
        <text x="50" y="68">pack</text>
      </g>
    </svg>
  );
}

/** lined notebook paper, 726×357, rules every 30 units with a pink margin */
function Paper() {
  const rules = [];
  for (let y = 25; y < 357; y += 30) rules.push(y);
  return (
    <svg className="sq-board-paper-img" viewBox="0 0 726 357" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="paper-tone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fefefd" />
          <stop offset="1" stopColor="#f8f8f6" />
        </linearGradient>
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="726" height="357" fill="url(#paper-tone)" />
      <rect width="726" height="357" fill="#000" filter="url(#paper-grain)" />
      {rules.map((y) => (
        <line key={y} x1="0" x2="726" y1={y} y2={y} stroke="#bcd3f0" strokeWidth="1.4" opacity="0.85" />
      ))}
      <line x1="22" x2="22" y1="0" y2="357" stroke="#f3a6b6" strokeWidth="1.3" />
      {/* a faint crease where it was folded */}
      <line x1="586" x2="584" y1="0" y2="357" stroke="#ffffff" strokeWidth="3" opacity="0.45" />
      <line x1="588" x2="586" y1="0" y2="357" stroke="#000" strokeWidth="0.8" opacity="0.035" />
    </svg>
  );
}

export default function StickerBoard() {
  const ref = useRef<HTMLElement>(null);
  const srcs = useMemo(() => Object.fromEntries(STICKERS.map((s) => [s.key, stickerSrc(s.key)])) as Record<StickerKey, string>, []);

  useEffect(() => mountBoard(ref.current!), []);

  return (
    <section ref={ref} className="sq-board" aria-label="Sign-off, with stickers">
      <div className="sq-board-grid">
        <div className="sq-board-desk">
          <div className="sq-board-sheet">
            <div className="sq-board-sheet-grid">
              <PackBadge />
              {STICKERS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={"sq-board-choice" + (s.tall ? " is-tall" : "")}
                  data-key={s.key}
                  data-src={srcs[s.key]}
                  data-k={s.k}
                  style={s.k ? ({ "--k": s.k } as React.CSSProperties) : undefined}
                  aria-label={s.label}
                >
                  <span className="sq-peel" aria-hidden>
                    <img className="sq-peel-depression" src={srcs[s.key]} alt="" draggable={false} />
                    <span className="sq-peel-front">
                      <img className="sq-peel-front-img" src={srcs[s.key]} alt="" draggable={false} />
                    </span>
                    <span className="sq-peel-flap-shade">
                      <span className="sq-peel-flap">
                        <span className="sq-peel-flap-lift">
                          <img className="sq-peel-back" src={srcs[s.key]} alt="" draggable={false} />
                          <span className="sq-peel-fold" />
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
              <button type="button" className="sq-board-reset">
                reset
              </button>
            </div>
          </div>

          <div className="sq-board-paper">
            <Paper />
            <div className="sq-board-note">
              <p className="sq-board-note-head">to do:</p>
              <ul className="sq-board-todo">
                {TODO.map((t, i) => (
                  <li key={t} className={TODO_DEFAULT[i] ? "is-done" : ""} role="checkbox" aria-checked={TODO_DEFAULT[i]} tabIndex={0}>
                    <svg className="sq-board-tick" viewBox="0 0 24 24" aria-hidden focusable="false">
                      <path className="sq-board-tick-a" d="M5.6 12.6c1.5 0.9 2.7 2.7 3.6 4.9" pathLength={1} />
                      <path className="sq-board-tick-b" d="M9.2 17.5c0.6-2 1.9-4.4 3.6-6.9 1.7-2.5 3.9-5 7-7.6" pathLength={1} />
                    </svg>
                    <span className="sq-board-strike">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <figure className="sq-board-photo">
            <img src="/pics/thumbs/june-4-2026-2.webp" alt="Anton's desk late at night, code on the screen" draggable={false} loading="lazy" />
          </figure>
        </div>
      </div>
      <div className="sq-board-area" />
    </section>
  );
}
