import { PET, PET_EYE, petCanvas } from "@/lib/pet-sprite";
import { play as sfx } from "@/lib/sfx";

/**
 * The tank inside the tamagotchi: Nigiri the koi on a 128×128 canvas.
 * Care persists per browser (fed / full / asleep); hunger sets his mood,
 * fullness slows him down; PLAY is a game of "which side of the rock".
 */

const TAU = Math.PI * 2;
const W = 128;
const H = 128;
const CX = W / 2;
const WT = 6; // water top
const ST = H - H / 4; // sand top
const PX = 3; // scenery pixel
const TANK_W = 160; // scenery is laid out on a slightly wider tank, the card is its centre crop

const SAVE_KEY = "anton-tama";
const BEST_KEY = "anton-tama-best";

const FISH_W = 35;
const FISH_H = 30;

type Pt = { x: number; y: number };
type Food = Pt & { vy: number };
type Bubble = Pt & { r: number; vy: number; a: number };
type Heart = Pt & { vy: number; a: number };
type Zzz = Pt & { s: number; a: number };
type Ripple = Pt & { r: number; a: number };
type Poi = Pt & { phase: "startle" | "approach" | "linger"; tt: number };
type Seek = Pt & { v: number; face?: number };
type Phase = "out" | "over" | "hide" | "wait" | "rise" | "reveal" | "lose" | "back";
type Game = { phase: Phase; tt: number; guess: number; side: number; shown: boolean; score: number };
type Care = { lastSeen: number; lastFed: number; night: boolean; full: number; fullAt: number };

export type TankHooks = {
  /** whether the tank is expanded (taps and PLAY only work then) */
  isOpen: () => boolean;
  /** the keys' cursor labels changed (FEED/LEFT, SLEEP/WAKE/RIGHT) */
  onKeys: (feed: string, lamp: string) => void;
  /** toggle a class on <html> */
  rootClass: (name: string, on: boolean) => void;
  /** the cursor chip should go away (PLAY heading home) */
  hideChip: () => void;
};

export type Tank = {
  feed: () => void;
  play: () => void;
  lamp: () => void;
  /** a key press while the game waits: -1 left, 1 right */
  guess: (side: number) => boolean;
  inGame: () => boolean;
  night: () => boolean;
  greetIfMissed: () => void;
  destroy: () => void;
};

// ---------------------------------------------------------------- art

// pixel font, 3×5
const FONT: Record<string, string[]> = {
  G: ["111", "1..", "1.1", "1.1", "111"],
  U: ["1.1", "1.1", "1.1", "1.1", "111"],
  E: ["111", "1..", "111", "1..", "111"],
  S: ["111", "1..", "111", "..1", "111"],
  "0": ["111", "1.1", "1.1", "1.1", "111"],
  "1": ["11.", ".1.", ".1.", ".1.", "111"],
  "2": ["111", "..1", "111", "1..", "111"],
  "3": ["111", "..1", ".11", "..1", "111"],
  "4": ["1.1", "1.1", "111", "..1", "..1"],
  "5": ["111", "1..", "111", "..1", "111"],
  "6": ["111", "1..", "111", "1.1", "111"],
  "7": ["111", "..1", "..1", ".1.", ".1."],
  "8": ["111", "1.1", "111", "1.1", "111"],
  "9": ["111", "1.1", "111", "..1", "111"],
};
const HEART = [".1.1.", "11111", "11111", ".111.", "..1.."];
const ZED = ["111", "..1", ".1.", "111"];
const CROSS = ["1...1", ".1.1.", "..1..", ".1.1.", "1...1"];
const ARROW = ["..1", ".11", "111", ".11", "..1"]; // points left
// the best-score medal: a green ribbon over a gold coin
const MEDAL = ["r...r", ".r.r.", "..y..", ".yYy.", "yYwYy", ".yYy."];
const MEDAL_PAL: Record<string, string> = { r: "#5aa35c", y: "#e9a93a", Y: "#f6c95a", w: "#fff4c2" };

// the hiding rock for PLAY: a mossy boulder, built from a half-ellipse (row 0 = base)
const BOULDER_COLS = 19;
const BOULDER = Array.from({ length: 11 }, (_, r) => {
  const half = Math.round(9 * Math.sqrt(1 - Math.pow(r / 11.5, 2)));
  return Array.from({ length: BOULDER_COLS }, (_, c) => (Math.abs(c - 9) <= half ? 1 : 0));
});
const BOULDER_SHADES = ["#4a4640", "#55504a", "#625c55", "#706a62", "#7e786f", "#8c867c", "#9c968b", "#aca79b"];
const BOULDER_MOSS = "#6f9a52";
const BOULDER_W = BOULDER_COLS * PX;
const HIDE_Y = ST - 3;
const OVER_Y = ST - 40;
const RISE_Y = ST - 17;

// scenery
const SAND = ["#ecd7ab", "#f2dfb8", "#e2cb9a", "#d6bf8c"];
type Decor = { t: "weed" | "rock" | "matcha"; x: number; tier: number; v: number };
const DECOR: Decor[] = [
  { t: "weed", x: 24, tier: 2, v: 0 },
  { t: "matcha", x: 49, tier: 1, v: 0 },
  { t: "rock", x: 73, tier: 1, v: 0 },
  { t: "rock", x: 88, tier: 0, v: 1 },
  { t: "weed", x: 104, tier: 1, v: 1 },
];
const PEBBLES = [
  [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 0, 0]],
  [[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0, 0, 0]],
];
const PEBBLE_SHADES = [
  ["#57524c", "#6b655d", "#837c72", "#9a9387"],
  ["#4b5260", "#5d6573", "#737b88", "#8d95a1"],
];
const WEEDS = [
  [[-2, 5, 1.3, 0], [2, 4, -1.1, 1.6]],
  [[-2, 9, 2.1, 0], [3, 7, -1.7, 1.8]],
  [[-3, 13, 2.8, 0], [3, 11, -2.4, 1.5]],
];

// ---------------------------------------------------------------- the tank

export function createTank(canvas: HTMLCanvasElement, hooks: TankHooks): Tank {
  const ctx = canvas.getContext("2d")!;
  canvas.width = W;
  canvas.height = H;
  const sprite = petCanvas();

  let food: Food[] = [];
  let bubbles: Bubble[] = [];
  let hearts: Heart[] = [];
  let zzz: Zzz[] = [];
  let ripples: Ripple[] = [];
  let bubTimer = 0;
  let zzzTimer = 0;
  let t = 0;
  let hoverPt: Pt | null = null;
  let game: Game | null = null;
  let camX = 0;
  let destroyed = false;

  // ---- care, persisted
  const now = Date.now();
  const care: Care = { lastSeen: now, lastFed: now - 2 * 3600e3, night: false, full: 0, fullAt: now };
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null") as Partial<Care> | null;
    if (saved && typeof saved === "object") {
      if (typeof saved.lastSeen === "number") care.lastSeen = saved.lastSeen;
      if (typeof saved.lastFed === "number") care.lastFed = saved.lastFed;
      care.night = !!saved.night;
      if (typeof saved.full === "number") care.full = Math.max(0, Math.min(12, saved.full));
      if (typeof saved.fullAt === "number") care.fullAt = saved.fullAt;
    }
  } catch {
    /* blocked or corrupt storage: start fresh */
  }
  const save = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(care));
    } catch {
      /* not remembered */
    }
  };
  // he notices when you've been gone two days
  let missedPending = Date.now() - care.lastSeen > 48 * 3600e3;
  care.lastSeen = Date.now();
  save();
  const onHide = () => {
    care.lastSeen = Date.now();
    save();
  };
  window.addEventListener("pagehide", onHide);

  let best = 0;
  try {
    best = parseInt(localStorage.getItem(BEST_KEY) ?? "", 10) || 0;
  } catch {
    /* no best yet */
  }

  // hunger → mood: 0 peckish, 1 content, 2 happy (he sulks, never suffers)
  const mood = () => {
    const h = (Date.now() - care.lastFed) / 3600e3;
    return h < 6 ? 2 : h < 48 ? 1 : 0;
  };
  const MOOD_SPEED = [0.68, 0.88, 1];
  const MOOD_BUBBLE = [2, 1.35, 1];
  // fullness 0..12: a notch per FEED, digests one every 90s
  const FULL_MAX = 12;
  const fullness = () => Math.max(0, Math.min(FULL_MAX, care.full - (Date.now() - care.fullAt) / 90e3));
  const feedBite = () => {
    care.full = Math.min(FULL_MAX, fullness() + 1);
    care.fullAt = Date.now();
    save();
  };
  const emitHeart = (x: number, y: number) => hearts.push({ x, y, vy: -(0.28 + Math.random() * 0.12), a: 1 });

  // ---- the fish
  const fish = {
    x: CX,
    y: 55,
    vx: 0.5,
    vy: 0,
    ph: Math.random() * TAU,
    eatCD: 0,
    face: 1,
    poi: null as Poi | null,
    seek: null as Seek | null,
    sleepX: undefined as number | undefined,
    sleepY: 0,
  };
  const setSleepSpot = () => {
    fish.sleepX = Math.max(24, Math.min(W - 24, fish.x));
    fish.sleepY = Math.max(WT + 18, Math.min(ST - 16, fish.y));
  };

  function updateFish(dt: number) {
    const f = dt / 16;
    if (fish.eatCD > 0) fish.eatCD -= dt;

    // PLAY steers him straight to a point: no walls, no dinner
    if (fish.seek) {
      const gx = fish.seek.x - fish.x;
      const gy = fish.seek.y - fish.y;
      const gd = Math.hypot(gx, gy) || 1;
      const gk = Math.min(1, gd / 12);
      fish.vx += ((gx / gd) * fish.seek.v * gk - fish.vx) * 0.12;
      fish.vy += ((gy / gd) * fish.seek.v * gk - fish.vy) * 0.12;
      fish.x += fish.vx * f;
      fish.y += fish.vy * f;
      return;
    }

    // nearest pellet (asleep or stuffed, he ignores dinner)
    let ti = -1;
    let td = 999;
    if (!care.night && fullness() < FULL_MAX)
      food.forEach((p, i) => {
        const d = Math.hypot(p.x - fish.x, p.y - fish.y);
        if (d < td) {
          td = d;
          ti = i;
        }
      });
    if (ti >= 0 && td < 8 && fish.eatCD <= 0) {
      const wasHungry = mood() < 2;
      food.splice(ti, 1);
      fish.eatCD = 480;
      ti = -1;
      care.lastFed = Date.now();
      save();
      if (wasHungry) emitHeart(fish.x, fish.y - 10);
    }

    if (ti >= 0 && fish.eatCD <= 0) {
      fish.poi = null; // dinner beats curiosity
      const dx = food[ti].x - fish.x;
      const dy = food[ti].y - fish.y;
      const dd = Math.hypot(dx, dy) || 1;
      fish.vx += ((dx / dd) * 2 - fish.vx) * 0.1;
      fish.vy += ((dy / dd) * 1.6 - fish.vy) * 0.1;
    } else if (fish.poi) {
      // a tap on the glass: dart away, then come and look
      const p = fish.poi;
      if (p.phase === "startle") {
        p.tt -= dt;
        if (p.tt <= 0) p.phase = "approach";
      } else if (p.phase === "approach") {
        const px = p.x - fish.x;
        const py = p.y - fish.y;
        const pd = Math.hypot(px, py) || 1;
        fish.vx += ((px / pd) * 1.8 - fish.vx) * 0.08;
        fish.vy += ((py / pd) * 1.4 - fish.vy) * 0.08;
        if (pd < 9) {
          p.phase = "linger";
          p.tt = 1300;
          bubbles.push({ x: fish.x + (fish.vx >= 0 ? 14 : -14), y: fish.y - 4, r: 1.6, vy: -0.32, a: 0.7 });
        }
      } else {
        p.tt -= dt;
        fish.vx *= 0.92;
        fish.ph += dt * 0.002;
        fish.vy += (Math.sin(fish.ph) * 0.15 - fish.vy) * 0.08;
        if (p.tt <= 0) fish.poi = null;
      }
    } else if (care.night) {
      // asleep: hold the spot, floating a little
      if (fish.sleepX === undefined) setSleepSpot();
      fish.vx += ((fish.sleepX! - fish.x) * 0.04 - fish.vx) * 0.06;
      fish.vy += ((fish.sleepY + Math.sin(t * 0.0015) * 2.5 - fish.y) * 0.05 - fish.vy) * 0.06;
    } else {
      fish.ph += dt * 0.001;
      fish.vy += (Math.sin(fish.ph) * 0.38 - fish.vy) * 0.07;
      // a peckish fish mopes low in the tank
      if (mood() === 0) fish.vy += (WT + (ST - WT) * 0.72 - fish.y) * 0.0008;
      if (Math.abs(fish.vx) < 0.3) fish.vx = fish.vx >= 0 ? 0.5 : -0.5;
    }

    // fullness shows only as a slower and slower waddle
    const spd = MOOD_SPEED[mood()] * (care.night ? 0.8 : 1) * (1 - fullness() * 0.035);
    fish.x += fish.vx * f * spd;
    fish.y += fish.vy * f * spd;

    const pad = 14;
    if (fish.x < pad) {
      fish.x = pad;
      fish.vx = Math.abs(fish.vx) * 0.8;
    }
    if (fish.x > W - pad) {
      fish.x = W - pad;
      fish.vx = -Math.abs(fish.vx) * 0.8;
    }
    if (fish.y > ST - 10) {
      fish.y = ST - 10;
      fish.vy = -0.4;
    }
    if (fish.y < WT + 10) {
      fish.y = WT + 10;
      fish.vy = 0.4;
    }
  }

  function drawFish() {
    // facing only flips on real movement, so a dozing fish doesn't flicker
    if (fish.vx > 0.05) fish.face = 1;
    else if (fish.vx < -0.05) fish.face = -1;
    if (fish.seek?.face) fish.face = fish.seek.face;
    ctx.save();
    ctx.translate(Math.round(fish.x), Math.round(fish.y));
    if (fish.face < 0) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    const asleep = care.night && !fish.poi;
    const k = FISH_W / PET.w;
    // drawn in vertical slices that wave more toward the tail
    const slices = 7;
    const dw = FISH_W / slices;
    const sw = PET.w / slices;
    for (let i = 0; i < slices; i++) {
      const tail = 1 - i / (slices - 1);
      const amp = asleep ? 0.9 : 2.5;
      const sway = Math.sin(t * (asleep ? 0.0018 : 0.004) - i * 0.5) * amp * tail * tail;
      ctx.drawImage(sprite, i * sw, 0, sw, PET.h, -FISH_W / 2 + i * dw, -FISH_H / 2 + sway, dw + 0.5, FISH_H);
    }
    if (asleep) {
      // a closed eye: body colour over it, then the lid line
      const ex = -FISH_W / 2 + PET_EYE.x * k;
      const ey = -FISH_H / 2 + PET_EYE.y * (FISH_H / PET.h);
      ctx.fillStyle = PET.palette.s;
      ctx.fillRect(ex - 0.6 * k, ey - 1.1 * k, 2.2 * k, 2.2 * k);
      ctx.fillStyle = PET.palette.o;
      ctx.fillRect(ex - 0.4 * k, ey + 0.2 * k, 1.8 * k, 0.75 * k);
    }
    ctx.restore();
  }

  // ---- scenery
  function drawBlade(bx: number, segs: number, amp: number, phase: number) {
    for (let i = 0; i < segs; i++) {
      const ratio = (i + 1) / segs;
      const sway = Math.round(Math.sin(t * 0.0012 + phase + i * 0.32) * Math.abs(amp) * ratio);
      const wx = bx + sway;
      const wy = ST - (i + 1) * PX;
      const bw = ratio < 0.5 ? PX * 2 : PX;
      ctx.fillStyle = ratio < 0.4 ? "#2b7748" : ratio < 0.85 ? "#3f9a5e" : "#62b878";
      ctx.fillRect(wx - Math.floor(bw / 2), wy, bw, PX);
      if (bw >= PX * 2) {
        ctx.fillStyle = "#7fcf8f";
        ctx.fillRect(wx - 1, wy, 2, PX);
      }
    }
  }

  function drawPebble(cx: number, rows: number[][], shades: string[]) {
    const x0 = cx - Math.floor(rows[0].length / 2) * PX;
    rows.forEach((row, ri) =>
      row.forEach((on, ci) => {
        if (!on) return;
        ctx.fillStyle = shades[Math.min(shades.length - 1, ri)];
        ctx.fillRect(x0 + ci * PX, ST - (ri + 1) * PX, PX, PX);
      }),
    );
    ctx.fillStyle = "#c2bcb2";
    ctx.fillRect(x0 + PX * 2, ST - rows.length * PX, PX, PX);
  }

  /** A little glass of matcha latte half-sunk in the sand: foam on top, a handle, a glint. */
  function drawMatcha(cx: number) {
    const x0 = Math.round(cx - 6);
    const h = 13;
    ctx.fillStyle = "#3a3f47";
    ctx.fillRect(x0, ST - h, 11, h);
    ctx.fillRect(x0 + 11, ST - h + 3, 3, 1);
    ctx.fillRect(x0 + 13, ST - h + 3, 1, 6);
    ctx.fillRect(x0 + 11, ST - h + 8, 3, 1);
    ctx.fillStyle = "#7fb35a";
    ctx.fillRect(x0 + 1, ST - h + 3, 9, h - 3);
    ctx.fillStyle = "#f4f0de";
    ctx.fillRect(x0 + 1, ST - h + 1, 9, 2);
    ctx.fillStyle = "#a6cf7c";
    ctx.fillRect(x0 + 6, ST - h + 6, 2, 2);
    ctx.fillStyle = "#e9f2dc";
    ctx.fillRect(x0 + 2, ST - h + 4, 1, 5);
  }

  function drawDecor(d: Decor) {
    const dx = Math.round((d.x * TANK_W) / W - (TANK_W - W) / 2);
    if (d.t === "weed") WEEDS[d.tier].forEach((b) => drawBlade(dx + b[0], b[1], b[2], d.v * 2.3 + b[3]));
    else if (d.t === "rock") drawPebble(dx, PEBBLES[d.tier], PEBBLE_SHADES[d.v]);
    else drawMatcha(dx);
  }

  const shash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 1103515245) & 0xffffffff;
    h = (((h ^ (h >> 13)) * 1540483477) & 0xffffffff) >>> 0;
    return (h ^ (h >> 15)) & 0xff;
  };

  const drawSpr = (spr: string[], x: number, y: number, cell: number) => {
    for (let r = 0; r < spr.length; r++)
      for (let c = 0; c < spr[r].length; c++) if (spr[r][c] === "1") ctx.fillRect(x + c * cell, y + r * cell, cell, cell);
  };
  const drawText = (str: string, x: number, y: number, cell: number) => {
    for (let i = 0; i < str.length; i++) drawSpr(FONT[str[i]], x + i * 4 * cell, y, cell);
  };
  const drawHeart = (x: number, y: number, cell: number, color: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    for (let r = 0; r < HEART.length; r++)
      for (let c = 0; c < HEART[r].length; c++) if (HEART[r][c] === "1") ctx.fillRect(x + (c - 2.5) * cell, y + r * cell, cell, cell);
    ctx.restore();
  };

  // ---- PLAY
  const ease = (k: number) => {
    k = Math.min(1, k);
    return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  };
  const boulderX = () => Math.round(1.5 * W - BOULDER_W / 2);

  function drawPlay(cam: number) {
    const g = game!;
    const rx = boulderX() - cam;
    const cx = rx + BOULDER_W / 2;
    BOULDER.forEach((row, r) => {
      const first = row.indexOf(1);
      const last = row.lastIndexOf(1);
      for (let c = first; c <= last; c++) {
        const edge = c === first ? 1 : c === last ? -1 : 0;
        ctx.fillStyle = BOULDER_SHADES[Math.max(0, Math.min(7, Math.floor(r * 0.6) + 1 + edge))];
        ctx.fillRect(rx + c * PX, ST - (r + 1) * PX, PX, PX);
      }
    });
    // moss on the crown, a sheen on its shoulder
    const top = BOULDER.length - 1;
    const tf = BOULDER[top].indexOf(1);
    ctx.fillStyle = BOULDER_MOSS;
    for (let c = tf; c <= BOULDER[top].lastIndexOf(1); c += 2) ctx.fillRect(rx + c * PX, ST - (top + 1) * PX, PX, PX);
    ctx.fillStyle = BOULDER_SHADES[7];
    ctx.fillRect(rx + (tf + 1) * PX, ST - top * PX, PX, PX);
    ctx.fillRect(rx + tf * PX, ST - (top - 1) * PX, PX, PX);

    const crown = ST - BOULDER.length * PX;
    if (g.phase === "wait") {
      ctx.fillStyle = "#ffffff";
      drawText("GUESS", Math.round(cx - 19), Math.round(crown - 16 + Math.sin(t * 0.006) * 1.5), 2);
      if (Math.sin(t * 0.008) > -0.3) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        for (let ar = 0; ar < 5; ar++)
          for (let ac = 0; ac < 3; ac++)
            if (ARROW[ar][ac] === "1") {
              ctx.fillRect(rx - 10 + ac * 2, ST - 18 + ar * 2, 2, 2);
              ctx.fillRect(rx + BOULDER_W + 8 - ac * 2, ST - 18 + ar * 2, 2, 2);
            }
      }
    }
    if (g.phase === "lose" && g.tt > 150) {
      ctx.fillStyle = "#d9676f";
      drawSpr(CROSS, Math.round(cx - 5), crown - 15, 2);
    }
    // the round's score, top right
    const digits = String(g.score);
    const sx = W - 9 - digits.length * 8 + 2;
    drawHeart(sx - 7, 10, 2, "#e85d78", 1);
    ctx.fillStyle = "#ffffff";
    drawText(digits, sx, 10, 2);
    // personal best, top left
    for (let r = 0; r < MEDAL.length; r++)
      for (let c = 0; c < 5; c++) {
        const k = MEDAL[r][c];
        if (k === ".") continue;
        ctx.fillStyle = MEDAL_PAL[k];
        ctx.fillRect(10 + c * 2, 8 + r * 2, 2, 2);
      }
    ctx.fillStyle = "#ffffff";
    drawText(String(best), 23, 10, 2);
  }

  const lampLabel = () => (care.night ? "WAKE" : "SLEEP");
  const setPlayKeys = (on: boolean) => hooks.onKeys(on ? "LEFT" : "FEED", on ? "RIGHT" : lampLabel());

  function startPlay() {
    if (game || !hooks.isOpen()) return;
    if (care.night) {
      // asleep: PLAY only gets a snore
      sfx("guess");
      zzz.push({ x: fish.x + fish.face * 12, y: fish.y - 12, s: 1.6, a: 0.9 });
      return;
    }
    sfx("play");
    food = [];
    fish.poi = null;
    game = { phase: "out", tt: 0, guess: 0, side: 0, shown: false, score: 0 };
    hooks.rootClass("tank-playing", true);
    setPlayKeys(true);
  }
  function guess(side: number) {
    if (game && game.phase === "wait") {
      game.guess = side;
      game.side = Math.random() < 0.5 ? -1 : 1;
      game.phase = "rise";
      game.tt = 0;
    }
  }
  function endPlay() {
    camX = 0;
    fish.seek = null;
    fish.vx = -0.5;
    game = null;
    setPlayKeys(false);
    hooks.rootClass("tank-play-back", false);
    hooks.rootClass("tank-playing", false);
  }
  function updatePlay(dt: number) {
    if (!hooks.isOpen()) return endPlay();
    const g = game!;
    g.tt += dt;
    if (g.phase === "out") {
      // the sand slides left as he swims right, toward the rock
      camX = ease(g.tt / 1600) * W;
      fish.seek = { x: W * 0.35, y: WT + (ST - WT) * 0.45, v: 1.2, face: 1 };
      if (g.tt >= 1600) {
        camX = W;
        g.phase = "over";
        g.tt = 0;
      }
    } else if (g.phase === "over") {
      // over the rock first, then straight down behind it
      fish.seek = { x: W / 2, y: OVER_Y, v: 1.5 };
      if (Math.hypot(fish.x - W / 2, fish.y - OVER_Y) < 3 || g.tt > 2500) {
        g.phase = "hide";
        g.tt = 0;
      }
    } else if (g.phase === "hide") {
      fish.seek = { x: W / 2, y: HIDE_Y, v: 1.1 };
      if (Math.abs(fish.y - HIDE_Y) < 1.5 || g.tt > 2500) {
        fish.x = W / 2;
        fish.y = HIDE_Y;
        fish.vx = 0;
        fish.vy = 0;
        g.phase = "wait";
        g.tt = 0;
        g.shown = false;
      }
    } else if (g.phase === "wait") {
      if (g.tt > 4000) guess(0); // no guess is a miss
    } else if (g.phase === "rise") {
      fish.seek = { x: W / 2, y: RISE_Y, v: 1.8 };
      if (Math.abs(fish.y - RISE_Y) < 2 || g.tt > 900) {
        g.phase = "reveal";
        g.tt = 0;
      }
    } else if (g.phase === "reveal") {
      fish.seek = { x: W / 2 + g.side * 40, y: ST - 30, v: 2 };
      if (!g.shown && Math.abs(fish.x - W / 2) > 26) {
        g.shown = true;
        if (g.guess === g.side) {
          sfx("win");
          g.score++;
          if (g.score > best) {
            best = g.score;
            try {
              localStorage.setItem(BEST_KEY, String(best));
            } catch {
              /* not remembered */
            }
          }
          let n = 0;
          const iv = window.setInterval(() => {
            emitHeart(fish.x + (Math.random() * 12 - 6), fish.y - 9);
            if (++n >= 2) clearInterval(iv);
          }, 260);
        } else {
          // a raspberry of bubbles, then the X
          sfx("miss");
          for (let b = 0; b < 6; b++)
            bubbles.push({
              x: fish.x + g.side * 16 + (Math.random() * 4 - 2),
              y: fish.y - 3 - b * 2,
              r: 1 + Math.random() * 1.6,
              vy: -(0.3 + Math.random() * 0.3),
              a: 0.8,
            });
          g.phase = "lose";
          g.tt = 0;
        }
      }
      if (g.shown && g.phase === "reveal" && g.tt > 1300) {
        g.phase = "over"; // next round
        g.tt = 0;
      }
    } else if (g.phase === "lose") {
      if (g.tt > 1600) {
        g.phase = "back";
        g.tt = 0;
        hooks.rootClass("tank-play-back", true);
        hooks.hideChip();
        setPlayKeys(false);
      }
    } else {
      // and home: the sand slides back while he swims left
      camX = (1 - ease(g.tt / 1400)) * W;
      fish.seek = { x: W * 0.65, y: WT + (ST - WT) * 0.45, v: 1.2, face: -1 };
      if (g.tt >= 1400) endPlay();
    }
  }

  // ---- render
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const water = ctx.createLinearGradient(0, 0, 0, H);
    if (care.night) {
      water.addColorStop(0, "#47678a");
      water.addColorStop(0.6, "#30506f");
      water.addColorStop(1, "#1d3753");
    } else {
      water.addColorStop(0, "#bde0ea");
      water.addColorStop(0.6, "#7cbacd");
      water.addColorStop(1, "#4c8fab");
    }
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, W, H);

    const cam = Math.round(camX);
    ctx.save();
    ctx.translate(-cam, 0); // PLAY pans the sand and scenery; the water stays
    ctx.fillStyle = SAND[0];
    ctx.fillRect(cam, ST, W, H - ST);
    for (let sy = ST; sy < H; sy += PX)
      for (let sx = Math.floor(cam / PX) * PX; sx < cam + W; sx += PX) {
        const n = shash(sx / PX, sy / PX);
        const tone = n < 20 ? 1 : n < 36 ? 2 : n < 46 ? 3 : 0;
        if (!tone) continue;
        ctx.fillStyle = SAND[tone];
        ctx.fillRect(sx, sy, PX, PX);
      }
    DECOR.forEach(drawDecor);
    ctx.restore();

    ripples.forEach((rp) => {
      if (rp.r <= 0.5) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, rp.a) * (1 - rp.r / 34);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, TAU);
      ctx.stroke();
      ctx.restore();
    });

    // fingertip marker where a tap would land
    if (hoverPt && !game) {
      ctx.save();
      ctx.globalAlpha = 0.32 + Math.sin(t * 0.005) * 0.08;
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hoverPt.x, hoverPt.y, 3.5, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hoverPt.x, hoverPt.y, 1, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // matcha pellets
    food.forEach((p) => {
      ctx.fillStyle = "#7da445";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#b4d27a";
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 1.2, 1.2);
    });

    bubbles.forEach((b) => {
      ctx.save();
      ctx.globalAlpha = b.a;
      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.stroke();
      ctx.restore();
    });
    hearts.forEach((h) => drawHeart(h.x, h.y, 1.4, "#e85d78", h.a));

    if (game) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, ST);
      ctx.clip();
    }
    drawFish();
    if (game) {
      ctx.restore();
      drawPlay(cam);
    }

    zzz.forEach((z) => {
      ctx.save();
      ctx.globalAlpha = z.a;
      ctx.fillStyle = "#dce8ff";
      drawSpr(ZED, z.x, z.y, z.s);
      ctx.restore();
    });

    if (care.night) {
      ctx.fillStyle = "rgba(10, 18, 45, 0.32)";
      ctx.fillRect(0, 0, W, H);
    }

    // the waterline, then glass highlights in pixel strips
    for (let i = 0; i < 2; i++) {
      ctx.globalAlpha = 0.08 + i * 0.018;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, WT + i * 5, W, 2.5);
    }
    ctx.globalAlpha = 1;
    const strip = (x: number, y: number, w: number, h: number, a: number) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(x, y, w, h);
    };
    strip(0, 0, PX, H, 0.3);
    strip(PX, 0, PX, H, 0.12);
    strip(PX * 2, 0, PX, H, 0.04);
    strip(W - PX, 0, PX, H, 0.22);
    strip(W - PX * 2, 0, PX, H, 0.08);
    strip(0, 0, W, PX, 0.28);
    strip(0, PX, W, PX, 0.1);
  }

  // ---- loop
  let lastT = 0;
  let raf = 0;
  function tick(nowT: number) {
    if (destroyed) return;
    const dt = Math.min(nowT - (lastT || nowT), 50);
    lastT = nowT;
    const k = dt / 16;

    food = food.filter((p) => {
      p.y += p.vy * k;
      return p.y < ST;
    });

    bubTimer += dt;
    if (bubTimer > (2500 + Math.random() * 2000) * MOOD_BUBBLE[mood()]) {
      const mx = fish.x + (fish.vx >= 0 ? 16 : -16);
      const my = fish.y - 3;
      bubbles.push({ x: mx, y: my, r: 1 + Math.random() * 0.8, vy: -(0.35 + Math.random() * 0.2), a: 0.55 + Math.random() * 0.2 });
      bubbles.push({ x: mx + (Math.random() * 3 - 1.5), y: my, r: 2.2 + Math.random(), vy: -(0.28 + Math.random() * 0.18), a: 0.55 + Math.random() * 0.2 });
      bubTimer = 0;
    }
    bubbles = bubbles.filter((b) => {
      b.y += b.vy * k;
      b.x += Math.sin(b.y * 0.04) * 0.04;
      b.a -= 0.003 * k;
      return b.a > 0 && b.y > WT;
    });
    hearts = hearts.filter((h) => {
      h.y += h.vy * k;
      h.x += Math.sin(h.y * 0.15) * 0.08;
      h.a -= 0.0045 * k;
      return h.a > 0 && h.y > WT;
    });
    if (care.night && !fish.poi) {
      zzzTimer += dt;
      if (zzzTimer > 1700) {
        zzz.push({ x: fish.x + fish.face * 12, y: fish.y - 12, s: 1 + (zzz.length % 2) * 0.6, a: 0.9 });
        zzzTimer = 0;
      }
    }
    zzz = zzz.filter((z) => {
      z.y -= 0.2 * k;
      z.x += Math.sin(z.y * 0.25) * 0.12;
      z.a -= 0.004 * k;
      return z.a > 0 && z.y > WT;
    });
    ripples = ripples.filter((rp) => {
      rp.r += 0.55 * k;
      if (rp.r > 0) rp.a -= 0.012 * k;
      return rp.a > 0 && rp.r < 34;
    });

    t += dt;
    if (game) updatePlay(dt);
    updateFish(dt);
    draw();
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // ---- glass taps (expanded only)
  const point = (e: PointerEvent): Pt => {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  function tapGlass(x: number, y: number) {
    if (game) return;
    fish.poi = { x: Math.max(18, Math.min(W - 18, x)), y: Math.max(WT + 12, Math.min(ST - 12, y)), phase: "startle", tt: 320 };
    fish.vx = (fish.x < fish.poi.x ? -1 : 1) * 2.8; // dart away first
    fish.vy = fish.y > 52 ? -0.9 : 0.9;
    ripples.push({ x, y, r: 1.5, a: 0.55 });
  }
  const onMove = (e: PointerEvent) => {
    hoverPt = hooks.isOpen() ? point(e) : null;
  };
  const onUp = (e: PointerEvent) => {
    if (!hooks.isOpen()) return; // collapsed: a click opens the tank instead
    const p = point(e);
    tapGlass(p.x, p.y);
  };
  const onLeave = () => {
    hoverPt = null;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("mouseleave", onLeave);

  const onKey = (e: KeyboardEvent) => {
    if (!game || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault();
    guess(e.key === "ArrowLeft" ? -1 : 1);
  };
  document.addEventListener("keydown", onKey);

  hooks.onKeys("FEED", lampLabel());
  hooks.rootClass("tank-night", care.night);

  return {
    feed() {
      // in PLAY, FEED is LEFT
      if (game) {
        if (game.phase === "wait") sfx("guess");
        guess(-1);
        return;
      }
      sfx("feed");
      for (let i = 0; i < 3; i++) food.push({ x: 14 + Math.random() * (W - 28), y: WT + 2 + Math.random() * 7, vy: 0.2 + Math.random() * 0.16 });
      feedBite();
    },
    play: startPlay,
    lamp() {
      // in PLAY, the lamp key is RIGHT
      if (game) {
        if (game.phase === "wait") sfx("guess");
        guess(1);
        return;
      }
      sfx(care.night ? "wake" : "sleep");
      care.night = !care.night;
      save();
      hooks.rootClass("tank-night", care.night);
      hooks.onKeys("FEED", lampLabel());
      if (care.night) {
        setSleepSpot(); // settle down right where he is
      }
    },
    guess(side) {
      if (!game) return false;
      guess(side);
      return true;
    },
    inGame: () => !!game,
    night: () => care.night,
    greetIfMissed() {
      if (!missedPending || !hooks.isOpen()) return;
      missedPending = false;
      window.setTimeout(() => {
        fish.poi = { x: CX, y: WT + (ST - WT) * 0.45, phase: "approach", tt: 0 };
        let n = 0;
        const iv = window.setInterval(() => {
          emitHeart(fish.x + (Math.random() * 12 - 6), fish.y - 9);
          if (++n >= 3) clearInterval(iv);
        }, 380);
      }, 800);
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pagehide", onHide);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("keydown", onKey);
      onHide();
    },
  };
}
