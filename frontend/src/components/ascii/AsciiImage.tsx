import { loadImage, NOISE, RAMP, sampleImage, type Sampled } from "@/lib/ascii/sample";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type PointerEvent } from "react";

type AsciiImageProps = {
  src: string;
  alt: string;
  /** Size the box with this (e.g. "aspect-video w-full"); the glyph grid fills it. */
  className?: string;
  /** Glyph cell width in px. */
  cell?: number;
  /** "dark" — glyphs are darker than the page, so dark pixels get dense glyphs. */
  ink?: "dark" | "light";
  /** "ink" draws in the CSS `color`; "source" tints each glyph with the pixel colour. */
  color?: "ink" | "source";
  /** Hover behaviour: a circular window onto the real photo, or a full resolve. */
  lens?: "circle" | "full" | "none";
  /** Decode the glyphs in (scramble → image) the first time it scrolls into view. */
  reveal?: boolean;
  fit?: "cover" | "contain";
  /** Force the hover state from outside (e.g. when a parent card is hovered). */
  active?: boolean;
  font?: string;
  /** Floor for glyph density inside the image's opaque area, so tiny renders keep their silhouette. */
  minInk?: number;
};

const DURATION = 1100;

/** Renders an image as a field of ASCII glyphs, with optional hover lens. */
export default function AsciiImage({
  src,
  alt,
  className,
  cell = 7,
  ink = "dark",
  color = "ink",
  lens = "circle",
  reveal = true,
  fit = "cover",
  active,
  font = '"Commit Mono", ui-monospace, Menlo, monospace',
  minInk = 0,
}: AsciiImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const shown = active ?? hover;

  useEffect(() => {
    const wrap = wrapRef.current!, canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let grid: Sampled | null = null;
    let delays = new Float32Array(0);
    let img: HTMLImageElement | null = null;
    let raf = 0, start = -1, visible = false, revealed = !reveal || reduced, disposed = false;
    const cellH = cell * 1.6;

    function draw(progress: number) {
      if (!grid) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { cols, rows, lum, alpha, rgb, detail } = grid;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${cell * 1.32}px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const inkColor = getComputedStyle(wrap).color;
      if (color === "ink") ctx.fillStyle = inkColor;
      const steps = RAMP.length - 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          // tone plus edges, so flat light screenshots still show their UI as line art
          const tone = ink === "dark" ? 1 - lum[i] : lum[i];
          const d = Math.min(1, Math.max(tone, detail[i] * 0.85, minInk)) * alpha[i];
          let ch: string;
          let a: number;
          const delay = delays[i];
          if (progress >= delay) {
            if (d < 0.06) continue;
            ch = RAMP[Math.min(steps, Math.max(1, Math.round(d * steps)))];
            a = 0.3 + 0.7 * d;
          } else if (progress > delay - 0.18 && d > 0.04) {
            ch = NOISE[(Math.random() * NOISE.length) | 0];
            a = 0.35;
          } else {
            continue;
          }
          if (color === "source") {
            ctx.fillStyle = `rgb(${rgb[i * 3]},${rgb[i * 3 + 1]},${rgb[i * 3 + 2]})`;
          }
          ctx.globalAlpha = a;
          ctx.fillText(ch, c * cell + cell / 2, r * cellH + cellH / 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    function animate(now: number) {
      if (start < 0) start = now;
      const p = Math.min(1.3, (now - start) / DURATION);
      draw(p);
      if (p < 1.3) raf = requestAnimationFrame(animate);
      else revealed = true;
    }

    function layout() {
      if (!img || disposed) return;
      const { width, height } = wrap.getBoundingClientRect();
      if (width < 4 || height < 4) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const cols = Math.max(4, Math.floor(width / cell));
      const rows = Math.max(4, Math.floor(height / cellH));
      grid = sampleImage(img, cols, rows, 1.6, fit, 0.9);
      delays = new Float32Array(cols * rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // left-to-right sweep with grain
          delays[r * cols + c] = (c / cols) * 0.45 + Math.random() * 0.55;
        }
      }
      if (revealed) draw(2);
      else if (visible) {
        start = -1;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(animate);
      } else draw(-1);
    }

    loadImage(src).then((loaded) => {
      img = loaded;
      layout();
    });

    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || visible) return;
        visible = true;
        if (!revealed && grid) {
          start = -1;
          raf = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);
    const mo = new MutationObserver(() => revealed && draw(2));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [src, cell, ink, color, reveal, fit, font, minInk]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={alt}
      data-lens={lens}
      data-active={shown || undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerMove={lens === "circle" ? onMove : undefined}
      className={cn("ascii-image relative overflow-hidden", className)}
    >
      {lens !== "none" && (
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          className={cn("absolute inset-0 size-full", fit === "cover" ? "object-cover" : "object-contain")}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
