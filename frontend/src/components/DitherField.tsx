import { readDotColor } from "@/lib/dither";
import { useEffect, useRef } from "react";

const PITCH = 3; // css px per dot cell, matches .dot-grid --cell-pitch
const COARSE = 6; // field is sampled every COARSE cells, then interpolated
const LEVELS = 5;
const FPS = 30;

// 4×4 Bayer matrix, normalised to [0, 1)
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16);

type Blob = { ax: number; ay: number; fx: number; fy: number; px: number; py: number; r: number; w: number };

const BLOBS: Blob[] = [
  { ax: 0.42, ay: 0.3, fx: 0.031, fy: 0.023, px: 0.0, py: 1.3, r: 0.34, w: 0.7 },
  { ax: 0.38, ay: 0.36, fx: 0.019, fy: 0.029, px: 2.1, py: 0.4, r: 0.42, w: 0.55 },
  { ax: 0.45, ay: 0.28, fx: 0.025, fy: 0.017, px: 4.2, py: 2.7, r: 0.28, w: 0.6 },
  { ax: 0.3, ay: 0.4, fx: 0.014, fy: 0.021, px: 1.1, py: 5.0, r: 0.5, w: 0.4 },
];

type Ripple = { x: number; y: number; t0: number };

/**
 * Full-viewport field of dots behind the page. Soft blobs drift through it,
 * the cursor brightens the dots under it, and clicks send out a ripple.
 * Values are quantised with ordered (Bayer) dithering.
 */
export default function DitherField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0, rows = 0, gc = 0, gr = 0;
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);
    let field = new Float32Array(0);
    let [cr, cg, cb] = readDotColor();
    let maxAlpha = 0.18;
    const mouse = { x: -1, y: -1, tx: -1, ty: -1, energy: 0 };
    const ripples: Ripple[] = [];
    let raf = 0, last = 0;
    const t0 = performance.now();

    function readTheme() {
      [cr, cg, cb] = readDotColor();
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dot-max"));
      maxAlpha = Number.isFinite(v) ? v : 0.18;
    }

    function resize() {
      cols = Math.ceil(window.innerWidth / PITCH);
      rows = Math.ceil(window.innerHeight / PITCH);
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = `${cols * PITCH}px`;
      canvas.style.height = `${rows * PITCH}px`;
      gc = Math.ceil(cols / COARSE) + 2;
      gr = Math.ceil(rows / COARSE) + 2;
      field = new Float32Array(gc * gr);
      image = ctx.createImageData(cols, rows);
      pixels = new Uint32Array(image.data.buffer);
      draw(performance.now());
    }

    function sample(now: number) {
      const t = (now - t0) / 1000;
      const unit = Math.min(cols, rows) * PITCH; // blobs scale with the short side
      const w = cols * PITCH, h = rows * PITCH;
      const cursorR2 = (unit * 0.16) ** 2;
      // drop finished ripples
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > 1800) ripples.splice(i, 1);

      const bx: number[] = [], by: number[] = [], br2: number[] = [];
      for (const b of BLOBS) {
        bx.push(w * (0.5 + b.ax * Math.sin(t * b.fx * 6.283 + b.px)));
        by.push(h * (0.5 + b.ay * Math.cos(t * b.fy * 6.283 + b.py)));
        br2.push((unit * b.r) ** 2);
      }

      for (let gy = 0; gy < gr; gy++) {
        const y = gy * COARSE * PITCH;
        for (let gx = 0; gx < gc; gx++) {
          const x = gx * COARSE * PITCH;
          let v = 0;
          for (let i = 0; i < BLOBS.length; i++) {
            const dx = x - bx[i], dy = y - by[i];
            v += BLOBS[i].w * Math.exp(-(dx * dx + dy * dy) / br2[i]);
          }
          if (mouse.energy > 0.01) {
            const dx = x - mouse.x, dy = y - mouse.y;
            v += 0.9 * mouse.energy * Math.exp(-(dx * dx + dy * dy) / cursorR2);
          }
          for (const r of ripples) {
            const age = (now - r.t0) / 1800;
            const radius = age * unit * 0.9;
            const d = Math.hypot(x - r.x, y - r.y) - radius;
            v += 0.8 * (1 - age) * Math.exp(-(d * d) / (unit * 0.035) ** 2);
          }
          field[gy * gc + gx] = v;
        }
      }
    }

    function draw(now: number) {
      if (!image) return;
      sample(now);
      const color = (cb << 16) | (cg << 8) | cr; // little-endian RGBA
      const step = 1 / COARSE;
      for (let r = 0; r < rows; r++) {
        const fy = r * step, gy = fy | 0, ty = fy - gy;
        const row0 = gy * gc, row1 = row0 + gc;
        const bayerRow = (r & 3) << 2;
        for (let c = 0; c < cols; c++) {
          const fx = c * step, gx = fx | 0, tx = fx - gx;
          const a = field[row0 + gx], b = field[row0 + gx + 1];
          const d = field[row1 + gx], e = field[row1 + gx + 1];
          const top = a + (b - a) * tx, bottom = d + (e - d) * tx;
          // stretch contrast so the blobs read as distinct clouds
          let v = (top + (bottom - top) * ty - 0.2) * 1.8;
          if (v > 1) v = 1;
          const q = Math.floor(v * LEVELS + BAYER[bayerRow | (c & 3)]) / LEVELS;
          const alpha = q <= 0 ? 0.03 : 0.03 + q * maxAlpha;
          pixels[r * cols + c] = (((alpha * 255) | 0) << 24) | color;
        }
      }
      ctx.putImageData(image, 0, 0);
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / FPS) return;
      last = now;
      // ease the glow towards the pointer, and fade it when the pointer rests
      if (mouse.tx >= 0) {
        mouse.x += (mouse.tx - mouse.x) * 0.18;
        mouse.y += (mouse.ty - mouse.y) * 0.18;
      }
      mouse.energy *= 0.985;
      draw(now);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (mouse.tx < 0) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.energy = Math.min(1, mouse.energy + 0.08);
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(frame);
    };

    readTheme();
    resize();
    window.addEventListener("resize", resize);
    const mo = new MutationObserver(() => {
      readTheme();
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="dot-grid pointer-events-none fixed top-0 left-0 -z-10"
    />
  );
}
