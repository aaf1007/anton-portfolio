/**
 * Anton's mark: a front-facing pixel laptop with code on its screen and a
 * matcha latte beside it, cut out as a die-cut sticker (a thick white border
 * and a thin grey edge that follow the stepped pixel silhouette).
 *
 * Plain data and string building only (no imports, erasable types), so Node
 * can run it directly: `node scripts/make-favicon.ts` writes public/favicon.svg.
 */

// one character per pixel; "." is empty
export const MARK_ROWS = [
  "..KKKKKKKKKKKKKKKKKKKK............",
  "..KNNNNNNNNNNNNNNNNNNK............",
  "..KNYYYNPPPPNNNNNNNNNK............",
  "..KNNNPPNWWWWWNNNNNNNK............",
  "..KNNNGGGGNRRNNNNNNNNK............",
  "..KNWWNNNNNNNNNNNNNNNK......V.....",
  "..KNNNNNNNNNNNNNNNNNNK.....V......",
  "..KNRRRRNYYNNNNNNNNNNK......V.....",
  "..KNNNGGGNPPPPPNNNNNNK...OFFFFFO..",
  "..KNNNWWWWNNNNNNNNNNNK...OGWGGGOOO",
  "..KNPPPNNNNNNNNNNNNNNK...OGWGGGO.O",
  "..KNNNNNNNNNNNNNNNNNNK...OGGGHGOOO",
  "..KKKKKKKKKKKKKKKKKKKK...OGGGGGO..",
  "OSSSSSSSSSSTTTTSSSSSSSSO.OGGGGGO..",
  "OMMMMMMMMMMMMMMMMMMMMMMO..OGGGO...",
  ".OOOOOOOOOOOOOOOOOOOOOO....OOO....",
];

export const MARK_PALETTE: Record<string, string> = {
  K: "#2a2d33", // the lid's bezel
  N: "#1f2838", // the screen
  Y: "#f2c94c", // code
  P: "#8fa8f0",
  R: "#e8a0b4",
  G: "#8fcfa0",
  W: "#e6e8ee",
  S: "#cfd3d8", // the base: silver deck
  T: "#9aa1aa", // trackpad slot
  M: "#8e949c", // front lip
  O: "#3a3f47", // outlines
  F: "#f4f0de", // milk foam
  V: "#cdd6cf", // steam
};
// the matcha itself is a different green from the code's mint
export const MATCHA: Record<string, string> = { G: "#7fb35a", H: "#a6cf7c", W: "#e9f2dc" };
// which columns belong to the cup (its G/H/W are matcha, not code)
const CUP_FROM = 24;

const BORDER = 2; // white sticker border, in art pixels
const EDGE = "#e4e2df";

type Cell = { x: number; y: number; c: string };

function cells(): Cell[] {
  const out: Cell[] = [];
  MARK_ROWS.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const c = x >= CUP_FROM && MATCHA[ch] ? MATCHA[ch] : MARK_PALETTE[ch];
      out.push({ x, y, c });
    }),
  );
  return out;
}

/** Grow the art's silhouette by r pixels, in steps (a rounded diamond), so the cut stays pixel-stepped. */
function grow(filled: Set<string>, r: number, w: number, h: number): Set<string> {
  const out = new Set<string>();
  for (let y = -r - 1; y < h + r + 1; y++)
    for (let x = -r - 1; x < w + r + 1; x++) {
      let hit = false;
      for (let dy = -r; dy <= r && !hit; dy++)
        for (let dx = -r; dx <= r && !hit; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > r + 1) continue;
          if (filled.has(`${x + dx},${y + dy}`)) hit = true;
        }
      if (hit) out.add(`${x},${y}`);
    }
  return out;
}

/** Rows of same-colour runs as SVG rects (fewer nodes than one rect per pixel). */
function runs(map: Map<string, string>, off: number): string {
  const byRow = new Map<number, [number, string][]>();
  for (const [k, c] of map) {
    const [x, y] = k.split(",").map(Number);
    if (!byRow.has(y)) byRow.set(y, []);
    byRow.get(y)!.push([x, c]);
  }
  let s = "";
  for (const [y, list] of byRow) {
    list.sort((a, b) => a[0] - b[0]);
    let i = 0;
    while (i < list.length) {
      let j = i;
      while (j + 1 < list.length && list[j + 1][0] === list[j][0] + 1 && list[j + 1][1] === list[i][1]) j++;
      s += `<rect x="${list[i][0] + off}" y="${y + off}" width="${j - i + 1}" height="1" fill="${list[i][1]}"/>`;
      i = j + 1;
    }
  }
  return s;
}

export const MARK_W = MARK_ROWS[0].length;
export const MARK_H = MARK_ROWS.length;
/** The full sticker's size in art pixels (art + border + edge on every side). */
export const STICKER_W = MARK_W + 2 * (BORDER + 1);
export const STICKER_H = MARK_H + 2 * (BORDER + 1);

/** The inner markup of the sticker SVG (viewBox 0 0 STICKER_W STICKER_H). */
export function markInner(withSticker = true): string {
  const art = cells();
  const off = BORDER + 1;
  const filled = new Set(art.map((p) => `${p.x},${p.y}`));
  let s = "";
  if (withSticker) {
    const white = grow(filled, BORDER, MARK_W, MARK_H);
    const edge = grow(white, 0, MARK_W, MARK_H);
    const edgeMap = new Map<string, string>();
    for (const k of edge) if (!white.has(k)) edgeMap.set(k, EDGE);
    const whiteMap = new Map<string, string>();
    for (const k of white) whiteMap.set(k, "#ffffff");
    s += runs(edgeMap, off) + runs(whiteMap, off);
  }
  s += runs(new Map(art.map((p) => [`${p.x},${p.y}`, p.c])), off);
  return s;
}

/** A standalone SVG document of the sticker, e.g. for the favicon. */
export function markSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STICKER_W} ${STICKER_H}" shape-rendering="crispEdges">${markInner()}</svg>\n`;
}
