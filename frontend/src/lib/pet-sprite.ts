/**
 * Nigiri, the tamagotchi's pet: a little salmon-pink koi (he likes matcha).
 * 21×18 pixel art, facing right — tail on the left, head on the right.
 * Each row is a string of palette keys; "." is transparent.
 */

const W = 21;
const H = 18;

// filled columns per row, by part: body, dorsal fin, pelvic fin, tail
const PARTS: { part: "b" | "d" | "p" | "t"; row: number; from: number; to: number }[] = [
  { part: "d", row: 1, from: 10, to: 11 },
  { part: "d", row: 2, from: 9, to: 12 },
  { part: "d", row: 3, from: 9, to: 13 },
  { part: "t", row: 3, from: 0, to: 1 },
  { part: "b", row: 4, from: 9, to: 15 },
  { part: "t", row: 4, from: 0, to: 2 },
  { part: "b", row: 5, from: 7, to: 17 },
  { part: "t", row: 5, from: 1, to: 3 },
  { part: "b", row: 6, from: 6, to: 18 },
  { part: "t", row: 6, from: 2, to: 4 },
  { part: "b", row: 7, from: 5, to: 19 },
  { part: "t", row: 7, from: 3, to: 4 },
  { part: "b", row: 8, from: 5, to: 19 },
  { part: "t", row: 8, from: 3, to: 4 },
  { part: "b", row: 9, from: 5, to: 19 },
  { part: "t", row: 9, from: 3, to: 4 },
  { part: "b", row: 10, from: 5, to: 19 },
  { part: "t", row: 10, from: 3, to: 4 },
  { part: "b", row: 11, from: 6, to: 18 },
  { part: "t", row: 11, from: 2, to: 4 },
  { part: "b", row: 12, from: 7, to: 17 },
  { part: "t", row: 12, from: 1, to: 3 },
  { part: "b", row: 13, from: 9, to: 15 },
  { part: "t", row: 13, from: 0, to: 2 },
  { part: "t", row: 14, from: 0, to: 1 },
  { part: "p", row: 14, from: 11, to: 13 },
  { part: "p", row: 15, from: 12, to: 13 },
];

/** Where the eye sits, in sprite pixels (the sleeping eyelid covers it). */
export const PET_EYE = { x: 16, y: 7 };

function build(): string[] {
  const part: (string | null)[][] = Array.from({ length: H }, () => new Array<string | null>(W).fill(null));
  for (const p of PARTS) for (let c = p.from; c <= p.to; c++) part[p.row][c] = p.part;
  const filled = (r: number, c: number) => r >= 0 && r < H && c >= 0 && c < W && part[r][c] !== null;

  return part.map((row, r) =>
    row
      .map((p, c) => {
        if (!p) return ".";
        const edge = !filled(r - 1, c) || !filled(r + 1, c) || !filled(r, c - 1) || !filled(r, c + 1);
        if (r === 9 && c === 19) return "m"; // mouth
        if (edge) return "o";
        if (p === "t") return r % 2 ? "f" : "F"; // striped tail
        if (p === "d" || p === "p") return "f";
        if (r === PET_EYE.y && c === PET_EYE.x) return "e";
        if (r === PET_EYE.y - 1 && c === PET_EYE.x) return "h"; // catchlight above the eye
        if (c === 14 && r >= 7 && r <= 10) return "g"; // gill line
        // two cream koi patches on the back
        if ((r === 5 && c >= 10 && c <= 12) || (r === 6 && c >= 9 && c <= 13) || (r === 7 && c >= 10 && c <= 11)) return "w";
        if (r === 8 && c >= 6 && c <= 7) return "w";
        if (r >= 10) return "l"; // pale belly
        return "s";
      })
      .join(""),
  );
}

export const PET = {
  w: W,
  h: H,
  rows: build(),
  palette: {
    o: "#8a3626", // outline
    s: "#ff9472", // salmon body
    l: "#ffd3bf", // belly
    w: "#fff3e6", // koi patches
    g: "#e9684a", // gill
    f: "#f26b4c", // fins
    F: "#ffae8f", // tail stripe
    e: "#1e1a15", // eye
    h: "#ffffff", // catchlight
    m: "#6b2416", // mouth
  } as Record<string, string>,
};

/** The pet drawn onto a canvas at 1 px per sprite pixel (scale it up with smoothing off). */
export function petCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = PET.w;
  c.height = PET.h;
  const g = c.getContext("2d")!;
  PET.rows.forEach((row, y) =>
    [...row].forEach((k, x) => {
      if (k === ".") return;
      g.fillStyle = PET.palette[k];
      g.fillRect(x, y, 1, 1);
    }),
  );
  return c;
}
