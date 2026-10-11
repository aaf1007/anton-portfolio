import { bayer8, readDotColor } from "@/lib/dither";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PITCH = 6;
const DURATION = 620;
const BAND = 0.38; // width of the sweeping band, in sweep units

/**
 * On route change, a dithered band of dots sweeps across the screen from left
 * to right, covering the old page as it leaves and uncovering the new one.
 */
export default function PageWipe() {
  const { pathname } = useLocation();
  const ref = useRef<HTMLCanvasElement>(null);
  const shownFor = useRef(pathname);

  useEffect(() => {
    // only on an actual route change, not on mount (or StrictMode's re-run)
    if (shownFor.current === pathname) return;
    shownFor.current = pathname;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const cols = Math.ceil(window.innerWidth / PITCH);
    const rows = Math.ceil(window.innerHeight / PITCH);
    canvas.width = cols;
    canvas.height = rows;
    canvas.style.width = `${cols * PITCH}px`;
    canvas.style.height = `${rows * PITCH}px`;
    canvas.style.display = "block";
    const image = ctx.createImageData(cols, rows);
    const pixels = new Uint32Array(image.data.buffer);
    const [r, g, b] = readDotColor();
    const on = (0xff << 24) | (b << 16) | (g << 8) | r;

    // each cell's position along the sweep: mostly x, a little y, dithered edge
    const pos = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        pos[y * cols + x] = (x / cols) * 0.8 + (y / rows) * 0.2 + bayer8(x, y) * 0.22;
      }
    }

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - (1 - p) ** 3;
      const head = eased * (1.22 + BAND); // leading edge of the band
      const tail = head - BAND;
      for (let i = 0; i < pos.length; i++) {
        const s = pos[i];
        pixels[i] = s < head && s > tail ? on : 0;
      }
      ctx.putImageData(image, 0, 0);
      if (p < 1) raf = requestAnimationFrame(step);
      else canvas.style.display = "none";
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      canvas.style.display = "none";
    };
  }, [pathname]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="dot-grid pointer-events-none fixed top-0 left-0 z-[60] hidden opacity-90 [--cell-dot:4px] [--cell-pitch:6px]"
    />
  );
}
