/* Image → per-cell luminance/alpha grids for ASCII rendering. */

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

export type Sampled = {
  cols: number;
  rows: number;
  /** Luminance 0 (black) … 1 (white), auto-levelled over opaque pixels. */
  lum: Float32Array;
  /** Coverage 0 … 1 (transparent PNG/WebP cut-outs). */
  alpha: Float32Array;
  /** Source colour, 3 bytes per cell. */
  rgb: Uint8ClampedArray;
  /** Local contrast 0 … 1 (edges, text, UI outlines); only when sharpened. */
  detail: Float32Array;
};

/**
 * Downsamples `img` to a cols×rows grid. `fit: "cover"` crops to fill like
 * object-fit: cover; "contain" letterboxes (empty cells get alpha 0).
 */
export function sampleImage(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  cellAspect: number,
  fit: "cover" | "contain" = "cover",
  /** Unsharp-mask amount; >0 boosts local contrast so detail survives the ramp. */
  sharpen = 0,
): Sampled {
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = "high";

  // grid is cols×rows cells, but each cell is cellAspect times taller than wide
  const boxW = cols, boxH = rows * cellAspect;
  const s = fit === "cover"
    ? Math.max(boxW / img.naturalWidth, boxH / img.naturalHeight)
    : Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight);
  const w = img.naturalWidth * s, h = (img.naturalHeight * s) / cellAspect;
  g.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);

  const data = g.getImageData(0, 0, cols, rows).data;
  const n = cols * rows;
  const lum = new Float32Array(n);
  const alpha = new Float32Array(n);
  const rgb = new Uint8ClampedArray(n * 3);
  const opaque: number[] = [];
  for (let i = 0; i < n; i++) {
    const r = data[i * 4], gg = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255;
    lum[i] = (0.2126 * r + 0.7152 * gg + 0.0722 * b) / 255;
    alpha[i] = a;
    rgb[i * 3] = r; rgb[i * 3 + 1] = gg; rgb[i * 3 + 2] = b;
    if (a > 0.5) opaque.push(lum[i]);
  }

  // auto-levels: stretch the 3rd–97th percentile to the full range
  if (opaque.length > 16) {
    opaque.sort((x, y) => x - y);
    const lo = opaque[Math.floor(opaque.length * 0.03)];
    const hi = opaque[Math.floor(opaque.length * 0.97)];
    const span = Math.max(0.05, hi - lo);
    for (let i = 0; i < n; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / span));
  }
  const detail = new Float32Array(n);
  if (sharpen > 0) {
    const blur = new Float32Array(n);
    const R = 2;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        let sum = 0, k = 0;
        for (let dy = -R; dy <= R; dy++) {
          const rr = r + dy;
          if (rr < 0 || rr >= rows) continue;
          for (let dx = -R; dx <= R; dx++) {
            const cc = col + dx;
            if (cc < 0 || cc >= cols) continue;
            sum += lum[rr * cols + cc];
            k++;
          }
        }
        blur[r * cols + col] = sum / k;
      }
    }
    for (let i = 0; i < n; i++) {
      detail[i] = Math.min(1, Math.abs(lum[i] - blur[i]) * 3);
      lum[i] = Math.min(1, Math.max(0, lum[i] + (lum[i] - blur[i]) * sharpen));
    }
  }
  return { cols, rows, lum, alpha, rgb, detail };
}

export const RAMP = " .:-=+*#%@";
/** Random glyphs used while text/images are "decoding". */
export const NOISE = "!<>-_\\/[]{}=+*^?#%&$@01";
