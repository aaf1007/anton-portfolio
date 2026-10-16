import { useEffect, useRef } from "react";

const PITCH = 24; // grid pitch, CSS px
const BLUR = 60; // the paper sheet's blur; the grid feathers out over the same run

/**
 * The page's ground under everything: a still film grain (random greys laid
 * on with `overlay`) and, over it, a 24px grid from the viewport origin,
 * faded out toward the edges where the white paper sheet blurs into grey.
 */
export default function Ground() {
  const grid = useRef<HTMLCanvasElement>(null);
  const film = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const g = grid.current!;
      const box = g.getBoundingClientRect();
      const W = Math.round(box.width) || innerWidth;
      const H = Math.round(box.height) || innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 3);
      const w = Math.round(W * dpr);
      const h = Math.round(H * dpr);
      if (g.width !== w || g.height !== h) {
        g.width = w;
        g.height = h;
      }
      const c = g.getContext("2d")!;
      c.clearRect(0, 0, w, h);
      c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--grid-color").trim() || "#efefec";
      const step = PITCH * dpr;
      const line = Math.max(1, Math.round(dpr));
      for (let x = 0; x < w; x += step) c.fillRect(Math.round(x), 0, line, h);
      for (let y = 0; y < h; y += step) c.fillRect(0, Math.round(y), w, line);

      // the clip: a blurred rect in a 100×100 box stretched to the viewport,
      // inset 0.7 blur-widths and feathered over 0.6 of one, per axis
      const ix = (BLUR / W) * 100 * 0.7;
      const iy = (BLUR / H) * 100 * 0.7;
      const bx = (BLUR / W) * 100 * 0.6;
      const by = (BLUR / H) * 100 * 0.6;
      const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>` +
        `<filter id='b' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='${bx.toFixed(2)} ${by.toFixed(2)}'/></filter>` +
        `<rect x='${ix}' y='${iy}' width='${100 - 2 * ix}' height='${100 - 2 * iy}' fill='black' filter='url(#b)'/></svg>`;
      const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      g.style.maskImage = uri;
      g.style.webkitMaskImage = uri;
      g.style.maskSize = "100% 100%";
      g.style.webkitMaskSize = "100% 100%";

      // film: one grey per CSS px, still
      const f = film.current;
      if (f) {
        const fw = Math.ceil(innerWidth);
        const fh = Math.ceil(innerHeight);
        if (f.width !== fw || f.height !== fh) {
          f.width = fw;
          f.height = fh;
          const fc = f.getContext("2d")!;
          const img = fc.createImageData(fw, fh);
          for (let i = 0; i < img.data.length; i += 4) {
            const v = (Math.random() * 256) | 0;
            img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
            img.data[i + 3] = 255;
          }
          fc.putImageData(img, 0, 0);
        }
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    draw();
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <canvas ref={film} aria-hidden className="film-grain" />
      <canvas ref={grid} aria-hidden className="ground-grid" />
    </>
  );
}
