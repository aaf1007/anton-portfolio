/** The `--dot` theme token ("r g b") as numbers, for canvases that draw in the ink colour. */
export function readDotColor(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--dot").trim();
  const [r, g, b] = raw.split(/[\s,]+/).map(Number);
  return [r || 0, g || 0, b || 0];
}

/** 8×8 Bayer threshold for cell (c, r), in [0, 1). */
export function bayer8(c: number, r: number): number {
  // bit-interleave x, x^y to build the recursive Bayer index
  const x = c & 7, y = r & 7, z = x ^ y;
  const v =
    ((z & 1) << 5) | ((x & 1) << 4) | ((z & 2) << 2) | ((x & 2) << 1) | ((z & 4) >> 1) | ((x & 4) >> 2);
  return v / 64;
}
