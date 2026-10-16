/**
 * Anton's sticker pack, drawn as pixel art in code: each sticker is a small
 * grid of palette keys painted 1:1 onto a canvas and handed out as a PNG
 * data URL (shown large with image-rendering: pixelated, die-cut by the
 * page's #sticker-outline filter).
 */

import { PET } from "@/lib/pet-sprite";

type Grid = (string | null)[][];

export type StickerKey = "cube" | "pizza" | "nigiri" | "latte" | "leaf" | "laptop" | "pet";

export type StickerDef = {
  key: StickerKey;
  label: string;
  /** a tall sticker fills its whole cell (and lands at the tall size) */
  tall?: boolean;
  /** a size nudge for art that reads small in its box */
  k?: number;
};

/** sheet order: the tall one sits in the middle cell */
export const STICKERS: StickerDef[] = [
  { key: "cube", label: "rubik's cube sticker" },
  { key: "pizza", label: "pizza sticker" },
  { key: "nigiri", label: "salmon nigiri sticker", k: 1.12 },
  { key: "latte", label: "iced matcha latte sticker", tall: true },
  { key: "leaf", label: "maple leaf sticker" },
  { key: "laptop", label: "laptop sticker" },
  { key: "pet", label: "tamagotchi fish sticker" },
];

const grid = (w: number, h: number): Grid => Array.from({ length: h }, () => new Array<string | null>(w).fill(null));

/** rows of palette keys ('.' is empty) → a grid of colours */
function fromRows(rows: string[], pal: Record<string, string>): Grid {
  const w = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => Array.from(r.padEnd(w, "."), (ch) => (ch === "." ? null : (pal[ch] ?? null))));
}

/** a 1px outline grown around the art's silhouette (4-neighbour) */
function outline(g: Grid, color: string): Grid {
  const h = g.length + 2;
  const w = g[0].length + 2;
  const out = grid(w, h);
  for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) out[y + 1][x + 1] = g[y][x];
  const filled = (x: number, y: number) => y >= 0 && y < h && x >= 0 && x < w && out[y][x] !== null && out[y][x] !== "edge";
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (out[y][x] === null && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) out[y][x] = "edge";
  return out.map((r) => r.map((c) => (c === "edge" ? color : c)));
}

/* ------------------------------------------------------------------ cube */
function cube(): Grid {
  // cabinet projection: a 3×3 front, the top and right faces sheared back
  const S = 4; // sticker px on the front
  const F = 3 * S + 4; // front face incl. the black gaps
  const D = 7; // depth of the sheared faces
  const g = grid(F + D, F + D);
  const K = "#1b1b1d";
  const front = [
    ["#2fa56a", "#f28a2e", "#2fa56a"],
    ["#f5c63f", "#2fa56a", "#2fa56a"],
    ["#2fa56a", "#2f6fe4", "#f5c63f"],
  ];
  const top = ["#f7f5ee", "#f7f5ee", "#e2443a"];
  const right = ["#e2443a", "#f7f5ee", "#e2443a"];
  // front
  for (let y = 0; y < F; y++)
    for (let x = 0; x < F; x++) {
      const gx = x % (S + 1) === 0;
      const gy = y % (S + 1) === 0;
      const cx = Math.min(2, Math.floor(x / (S + 1)));
      const cy = Math.min(2, Math.floor(y / (S + 1)));
      let c = gx || gy ? K : front[cy][cx];
      // a soft highlight on each sticker's top-left pixel
      if (!gx && !gy && x % (S + 1) === 1 && y % (S + 1) === 1) c = shade(c, 0.35);
      g[y + D][x] = c;
    }
  // top: rows recede up and to the right
  for (let z = 1; z <= D; z++) {
    const y = D - z;
    for (let x = 0; x < F; x++) {
      const gx = x % (S + 1) === 0;
      const band = z === 1 || z === D || z === 4;
      const cx = Math.min(2, Math.floor(x / (S + 1)));
      g[y][x + z] = gx || band ? K : z < 4 ? top[cx] : shade(top[cx], -0.08);
    }
  }
  // right side, a little darker
  for (let z = 1; z <= D; z++) {
    const x = F - 1 + z;
    for (let y = 0; y < F; y++) {
      const gy = y % (S + 1) === 0;
      const band = z === D || z === 4;
      const cy = Math.min(2, Math.floor(y / (S + 1)));
      g[y + D - z][x] = gy || band ? K : shade(right[cy], -0.22);
    }
  }
  return outline(g, K);
}

/* ----------------------------------------------------------------- pizza */
function pizza(): Grid {
  const W = 19;
  const H = 21;
  const g = grid(W, H);
  const crust = ["#b86a2a", "#d9893b", "#e9a457"];
  const pepperoni: [number, number][] = [
    [6, 6],
    [11, 8],
    [8, 12],
    [12, 4],
  ];
  for (let y = 0; y < H; y++) {
    const inset = Math.round(y * 0.43);
    for (let x = inset; x < W - inset; x++) {
      let c = y < 3 ? crust[y === 0 ? 1 : y === 1 ? 2 : 0] : "#ffcf4a";
      if (y >= 3 && (x === inset || x === W - 1 - inset)) c = "#f3b43a"; // the cheese's toasted rim
      if (y === 3 && (x + y) % 3 === 0) c = "#fff0a8";
      g[y][x] = c;
    }
  }
  for (const [px, py] of pepperoni)
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (Math.abs(dx) + Math.abs(dy) > 1 && !(dx === -1 && dy === -1)) continue;
        if (g[py + dy]?.[px + dx]) g[py + dy][px + dx] = dx === -1 && dy === -1 ? "#ef6a5a" : "#d9433a";
      }
  // a strand of melted cheese off the tip
  g[H - 1][Math.floor(W / 2)] = "#ffcf4a";
  return outline(g, "#6b3a1f");
}

/* ---------------------------------------------------------------- nigiri */
const NIGIRI = fromRows(
  [
    "......SSSSSSSS......",
    "....SSsWssssWsSS....",
    "..SSssWsssssWsssSS..",
    ".SsssWssssssWsssssS.",
    "SsssWssssssWsssssWsS",
    "SssWssssssWsssssWssS",
    "DDDDDDDDDDDDDDDDDDDD",
    "rrrrrrrrrrrrrrrrrrrr",
    "rrRrrrrrRrrrrrrRrrrr",
    ".rrrrrRrrrrrrRrrrrr.",
    "..rrrrrrrrrrrrrrrr..",
  ],
  { S: "#f47a3c", s: "#f8935a", W: "#ffd9bd", D: "#d65f2a", r: "#fbfaf4", R: "#e2ded1" },
);

/* ----------------------------------------------------- iced matcha latte */
const LATTE = fromRows(
  [
    "......PP....",
    ".....PP.....",
    ".....PP.....",
    "...OOPPOO...",
    "..OLLPPLLO..",
    ".OLLLLLLLLO.",
    "OOOOOOOOOOOO",
    "OLLLLLLLLLLO",
    "OOOOOOOOOOOO",
    ".OHmmmmmmmO.",
    ".OHmmmmImmO.",
    ".OHmmmmmmmO.",
    ".OHmMmmmmMO.",
    ".OHMgMmmMgO.",
    ".OHggMMMggO.",
    ".OHgggIgggO.",
    "..OHgggggO..",
    "..OHgGgggO..",
    "..OHggIgGO..",
    "..OHgggggO..",
    "..OHGgggGO..",
    "..OggggggO..",
    "...OgGggO...",
    "...OOOOOO...",
  ],
  {
    P: "#3f8f5a",
    O: "#46604a",
    L: "#eef5f1",
    H: "#ffffff",
    m: "#f4f1e3",
    M: "#c9dca0",
    g: "#86b552",
    G: "#6c9a3f",
    I: "#dff1f6",
  },
);

/* ------------------------------------------------------------ maple leaf */
const LEAF = fromRows(
  [
    "........R........",
    ".......RRR.......",
    "....R..RDR..R....",
    "....RR.RDR.RR....",
    ".R..RRRRDRRRR..R.",
    ".RR.RRRRDRRRR.RR.",
    "..RRRRRRDRRRRRR..",
    "RRRRDRRRDRRRDRRRR",
    ".RRRRDRRDRRDRRRR.",
    "..RRRRDRDRDRRRR..",
    "...RRRRDDDRRRR...",
    "....RRRRDRRRR....",
    "...RRR.RDR.RRR...",
    "..RR...RDR...RR..",
    ".......RDR.......",
    "........S........",
    "........S........",
  ],
  { R: "#e2443a", D: "#b8302a", S: "#9a2a22" },
);

/* ---------------------------------------------------------------- laptop */
function laptop(): Grid {
  const W = 24;
  const g = grid(W, 17);
  const code = ["#7fd1ae", "#f5c63f", "#8fb3ff", "#f39ab2", "#dfe6f0"];
  // the lid
  for (let y = 0; y < 13; y++)
    for (let x = 3; x < W - 3; x++) {
      const bezel = y === 0 || y === 12 || x === 3 || x === W - 4;
      g[y][x] = bezel ? "#3a3f47" : "#1f2a3a";
    }
  // lines of code
  const lines: [number, number, number][] = [
    [2, 5, 6],
    [3, 7, 9],
    [4, 7, 5],
    [5, 5, 3],
    [7, 5, 8],
    [8, 7, 6],
    [9, 7, 9],
    [10, 5, 4],
  ];
  lines.forEach(([y, x0, len], i) => {
    for (let x = x0; x < x0 + len && x < W - 5; x++) g[y][x] = code[(i + Math.floor(x / 4)) % code.length];
  });
  // the deck
  for (let y = 13; y < 17; y++)
    for (let x = 0; x < W; x++) {
      if (y === 16 && (x === 0 || x === W - 1)) continue;
      g[y][x] = y === 13 ? "#e4e8ee" : y === 16 ? "#9aa1ab" : "#c9ced6";
    }
  for (let x = 9; x < 15; x++) g[14][x] = "#b3b9c2"; // the trackpad's notch
  return outline(g, "#2a2e35");
}

/* the tamagotchi's pet (its own sprite, shared with the tank) */
const PET_ART = fromRows(PET.rows, PET.palette);

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)),
  );
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

const ART: Record<StickerKey, () => Grid> = {
  cube,
  pizza,
  nigiri: () => outline(NIGIRI, "#7a3a24"),
  latte: () => LATTE,
  leaf: () => outline(LEAF, "#7c1e18"),
  laptop,
  pet: () => PET_ART,
};

const cache = new Map<StickerKey, string>();

/** The sticker as a PNG data URL, drawn once per page. */
export function stickerSrc(key: StickerKey): string {
  const hit = cache.get(key);
  if (hit) return hit;
  const g = ART[key]();
  const h = g.length;
  const w = g[0].length;
  // square canvas with a pixel of air, so object-fit: contain centres the art
  const side = Math.max(w, h) + 2;
  const c = document.createElement("canvas");
  c.width = c.height = side;
  const ctx = c.getContext("2d")!;
  const ox = Math.floor((side - w) / 2);
  const oy = Math.floor((side - h) / 2);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const col = g[y][x];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  const url = c.toDataURL("image/png");
  cache.set(key, url);
  return url;
}
