import { useEffect, type RefObject } from "react";

/**
 * Pixel-raster a heading: each text run is redrawn into a small canvas at
 * 1/cell scale, its alpha snapped to on/off, and the canvas laid over the
 * (now transparent) text at full size with nearest-neighbour scaling, so the
 * serif reads as a bitmap. Desktop only (above 1200px), and not in Safari,
 * whose text rendering makes the snap look ragged.
 */
const WIDE = "(min-width: 1201px)";
const SAFARI = typeof CSS !== "undefined" && CSS.supports("background", "-webkit-named-image(i)");

function rasterRun(node: Text, cell: number, weight: number) {
  const host = node.parentElement!;
  const cs = getComputedStyle(host);
  const size = parseFloat(cs.fontSize);
  const range = document.createRange();
  range.selectNodeContents(node);
  const r = range.getClientRects()[0];
  const box = host.getBoundingClientRect();
  if (!r || !size) return;
  const pad = Math.ceil((size * 0.3) / cell) * cell;
  const left = Math.round((r.left - box.left - pad) / cell) * cell;
  const top = Math.round((r.top - box.top - pad) / cell) * cell;
  const w = Math.ceil((r.width + pad * 2) / cell);
  const h = Math.ceil((r.height + pad * 2) / cell);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d", { willReadFrequently: true })!;
  g.font = `${cs.fontStyle} ${cs.fontWeight} ${size / cell}px ${cs.fontFamily}`;
  if ("letterSpacing" in g && cs.letterSpacing !== "normal") g.letterSpacing = `${parseFloat(cs.letterSpacing) / cell}px`;
  g.textBaseline = "alphabetic";
  const text = node.textContent ?? "";
  const m = g.measureText(text);
  const y0 = (r.top - box.top - top) / cell;
  const lead = (r.height / cell - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
  g.fillStyle = "#000";
  g.fillText(text, (r.left - box.left - left) / cell, y0 + lead + m.fontBoundingBoxAscent);
  const img = g.getImageData(0, 0, w, h);
  const [cr, cg, cb] = (cs.color.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
  const cut = weight * 255;
  for (let i = 0; i < img.data.length; i += 4) {
    const on = img.data[i + 3] >= cut;
    img.data[i] = cr;
    img.data[i + 1] = cg;
    img.data[i + 2] = cb;
    img.data[i + 3] = on ? 255 : 0;
  }
  g.putImageData(img, 0, 0);
  canvas.className = "raster-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = `left:${left}px;top:${top}px;width:${w * cell}px;height:${h * cell}px`;
  host.classList.add("raster-host");
  host.appendChild(canvas);
}

function raster(el: HTMLElement) {
  el.querySelectorAll(".raster-canvas").forEach((c) => c.remove());
  el.classList.remove("is-rastered");
  if (SAFARI || !matchMedia(WIDE).matches) return;
  const size = parseFloat(getComputedStyle(el).fontSize);
  if (!size || !el.offsetWidth) return;
  const dpr = window.devicePixelRatio || 1;
  const cell = dpr >= 2 && size < 56 ? 1.25 : Math.max(2, Math.round((size / 32) * dpr)) / dpr;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.textContent ?? "").trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const runs: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) runs.push(n as Text);
  runs.forEach((n) => rasterRun(n, cell, 0.45));
  el.classList.add("is-rastered");
}

export function useRaster(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => raster(el));
    };
    void document.fonts.ready.then(run);
    const ro = new ResizeObserver(run);
    ro.observe(el);
    const mq = matchMedia(WIDE);
    mq.addEventListener("change", run);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mq.removeEventListener("change", run);
      el.querySelectorAll(".raster-canvas").forEach((c) => c.remove());
      el.classList.remove("is-rastered");
    };
  }, [ref]);
}
