import { markInner } from "@/lib/mark";
import { useId, type SVGProps } from "react";

/**
 * Anton's tamagotchi, drawn on a 1099×1504 box: a cream egg with a matcha-green
 * lid, a screen window cut clean through (the tank shows from underneath), and
 * three salmon buttons. The buttons are separate layers so each can be pressed.
 */

export const FRAME_W = 1099;
export const FRAME_H = 1504;
// the window, in frame px (x 23.11%, y 39.10%, 53.14% × 38.90%)
const HOLE = { x: 254, y: 588, w: 584, h: 585, r: 34 };
const KEYS: [number, number][] = [
  [380, 1324],
  [550, 1362],
  [718, 1325],
];

const EGG = "M549.5 236C842 236 1077 596 1077 990C1077 1300 860 1492 549.5 1492C239 1492 22 1300 22 990C22 596 257 236 549.5 236Z";
const LID = "M100 478C124 270 330 140 549.5 140C769 140 975 270 999 478C912 518 756 532 549.5 532C343 532 187 518 100 478Z";

export function DeviceFrame({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const u = (n: string) => `${n}-${id}`;
  return (
    <svg className={className} viewBox={`0 0 ${FRAME_W} ${FRAME_H}`} aria-hidden focusable="false">
      <defs>
        <mask id={u("win")} maskUnits="userSpaceOnUse" x="0" y="0" width={FRAME_W} height={FRAME_H}>
          <rect width={FRAME_W} height={FRAME_H} fill="#fff" />
          <rect x={HOLE.x} y={HOLE.y} width={HOLE.w} height={HOLE.h} rx={HOLE.r} fill="#000" />
        </mask>
        <radialGradient id={u("shell")} cx="0.38" cy="0.42" r="0.72">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="0.55" stopColor="#f5efe1" />
          <stop offset="0.86" stopColor="#e6dcc6" />
          <stop offset="1" stopColor="#d3c7ad" />
        </radialGradient>
        <linearGradient id={u("lid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9cf7f" />
          <stop offset="0.55" stopColor="#7ead57" />
          <stop offset="1" stopColor="#5d8a3d" />
        </linearGradient>
        <radialGradient id={u("lidShade")} cx="0.5" cy="0.15" r="0.9">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1f3a12" stopOpacity="0.28" />
        </radialGradient>
        <radialGradient id={u("rim")} cx="0.5" cy="0.56" r="0.56">
          <stop offset="0.78" stopColor="#8c7a55" stopOpacity="0" />
          <stop offset="1" stopColor="#8c7a55" stopOpacity="0.22" />
        </radialGradient>
        <linearGradient id={u("bezel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcd2bb" />
          <stop offset="1" stopColor="#efe8d8" />
        </linearGradient>
        <linearGradient id={u("metal")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f4f6" />
          <stop offset="0.5" stopColor="#a9adb5" />
          <stop offset="1" stopColor="#e6e8eb" />
        </linearGradient>
        <radialGradient id={u("well")} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0.6" stopColor="#d9cfb8" />
          <stop offset="1" stopColor="#c7bb9f" />
        </radialGradient>
      </defs>

      <g mask={`url(#${u("win")})`}>
        {/* the loop the keychain hangs from */}
        <circle cx="518" cy="124" r="24" fill="none" stroke={`url(#${u("metal")})`} strokeWidth="13" />
        <rect x="494" y="134" width="48" height="24" rx="12" fill="#6f9c4b" />

        <path d={EGG} fill={`url(#${u("shell")})`} />
        {/* a soft rim, then a long gloss down the left */}
        <path d={EGG} fill={`url(#${u("rim")})`} />
        <path d={EGG} fill="none" stroke="#c9bc9f" strokeOpacity="0.55" strokeWidth="6" />
        <ellipse cx="150" cy="980" rx="34" ry="230" fill="#fff" opacity="0.6" transform="rotate(8 150 980)" />
        <ellipse cx="960" cy="1060" rx="18" ry="150" fill="#fff" opacity="0.35" transform="rotate(-10 960 1060)" />

        {/* the matcha lid */}
        <path d={LID} transform="translate(0 10)" fill="#3f5f2a" opacity="0.18" />
        <path d={LID} fill={`url(#${u("lid")})`} />
        <path d={LID} fill={`url(#${u("lidShade")})`} />
        <path d="M128 476C290 518 809 518 971 476" fill="none" stroke="#4e7733" strokeWidth="7" strokeLinecap="round" opacity="0.55" />
        <ellipse cx="370" cy="262" rx="160" ry="38" fill="#fff" opacity="0.42" transform="rotate(-22 370 262)" />
        <ellipse cx="660" cy="190" rx="46" ry="12" fill="#fff" opacity="0.32" transform="rotate(8 660 190)" />

        {/* the screen's bezel and recessed lip */}
        <rect x="222" y="556" width="648" height="649" rx="64" fill={`url(#${u("bezel")})`} />
        <rect x="222" y="556" width="648" height="649" rx="64" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" />
        <rect x="243" y="577" width="606" height="607" rx="45" fill="#c9bea6" />

        {/* wells the buttons sit in */}
        {KEYS.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="66" fill={`url(#${u("well")})`} />
        ))}
      </g>
    </svg>
  );
}

/** One of the three buttons, on its own full-size layer. */
export function DeviceButton({ index, className }: { index: 0 | 1 | 2; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [x, y] = KEYS[index];
  return (
    <svg className={className} viewBox={`0 0 ${FRAME_W} ${FRAME_H}`} aria-hidden focusable="false">
      <defs>
        <radialGradient id={`b-${id}`} cx="0.4" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffd9cb" />
          <stop offset="0.6" stopColor="#ffa98f" />
          <stop offset="1" stopColor="#ec8466" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y + 5} r="54" fill="#8a4a35" opacity="0.18" />
      <circle cx={x} cy={y} r="54" fill={`url(#b-${id})`} />
      <ellipse cx={x - 14} cy={y - 22} rx="20" ry="11" fill="#fff" opacity="0.55" transform={`rotate(-20 ${x - 14} ${y - 22})`} />
    </svg>
  );
}

/** The split ring and ball chain (217×438; it meets the lid's loop at 77% / 97%). */
export function Chain({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const balls: [number, number][] = [];
  // a gentle curve from under the ring down to the device's loop
  for (let i = 0; i <= 22; i++) {
    const k = i / 22;
    const x = 140 + (167 - 140) * k + Math.sin(k * Math.PI) * 10;
    const y = 146 + (424 - 146) * k;
    balls.push([x, y]);
  }
  return (
    <svg className={className} viewBox="0 0 217 438" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`m-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="0.45" stopColor="#9ea3ab" />
          <stop offset="1" stopColor="#eef0f2" />
        </linearGradient>
      </defs>
      <circle cx="122" cy="84" r="57" fill="none" stroke="#5b6068" strokeOpacity="0.25" strokeWidth="13" transform="translate(2 4)" />
      <circle cx="122" cy="84" r="57" fill="none" stroke={`url(#m-${id})`} strokeWidth="11" />
      <path d="M86 40a57 57 0 0 1 78 -8" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
      {balls.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x + 1} cy={y + 1.5} r="6" fill="#4b5058" opacity="0.25" />
          <circle cx={x} cy={y} r="6" fill={`url(#m-${id})`} />
          <circle cx={x - 1.8} cy={y - 1.8} r="1.8" fill="#fff" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

/**
 * The name charm: "anton" in polished silver letters, read top to bottom, on a
 * short chain of oval links (220×445, hung from 105,34 on the split ring).
 */
export function Charm({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const links: [number, number, number][] = [];
  for (let i = 0; i < 6; i++) links.push([105 + i * 1.5, 40 + i * 15, i % 2]);
  // the word, turned a quarter clockwise so it reads downward; its baseline runs down x = 84
  const word = (dx: number, dy: number, rest: SVGProps<SVGTextElement>) => (
    <text
      x={0}
      y={0}
      transform={`translate(${84 + dx} ${132 + dy}) rotate(90)`}
      fontFamily='"DM Sans", system-ui, sans-serif'
      fontWeight={700}
      fontSize={98}
      letterSpacing={-3}
      {...rest}
    >
      anton
    </text>
  );
  return (
    <svg className={className} viewBox="0 0 220 445" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`face-${id}`} x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#e9ebee" />
          <stop offset="0.55" stopColor="#b9bec5" />
          <stop offset="0.75" stopColor="#f3f4f6" />
          <stop offset="1" stopColor="#c9cdd3" />
        </linearGradient>
        <linearGradient id={`link-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="0.5" stopColor="#9fa4ac" />
          <stop offset="1" stopColor="#eef0f2" />
        </linearGradient>
      </defs>
      {/* the oval links, alternating face-on and edge-on */}
      {links.map(([x, y, edge], i) =>
        edge ? (
          <rect key={i} x={x - 2.5} y={y - 8} width="5" height="16" rx="2.5" fill={`url(#link-${id})`} stroke="#7d828a" strokeWidth="1" />
        ) : (
          <ellipse key={i} cx={x} cy={y} rx="5.5" ry="9" fill="none" stroke={`url(#link-${id})`} strokeWidth="3.4" />
        ),
      )}
      <circle cx="113" cy="128" r="7" fill="none" stroke={`url(#link-${id})`} strokeWidth="3.6" />
      {/* drop shadow, the cut edge (a few steps of darker metal), then the polished face */}
      {word(5, 7, { fill: "#4b5058", opacity: 0.22 })}
      {[3.5, 2.6, 1.7, 0.8].map((d) => (
        <g key={d}>{word(d * 0.8, d, { fill: "#868b93" })}</g>
      ))}
      {word(0, 0, { fill: `url(#face-${id})`, stroke: "#7b8088", strokeWidth: 2.2, paintOrder: "stroke" })}
      {word(-0.8, -1, { fill: "none", stroke: "#ffffff", strokeOpacity: 0.75, strokeWidth: 1 })}
    </svg>
  );
}

/** The second charm on the ring: a tiny laptop-and-matcha sticker on a jump ring (the site's mark). */
export function MarkCharm({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  // the sticker is 40×22 art px; it hangs from the top of the lid at x 15
  return (
    <svg className={className} viewBox="0 -12 40 34" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`jr-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="0.5" stopColor="#9ea3ab" />
          <stop offset="1" stopColor="#eef0f2" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="-8.2" r="2.8" fill="none" stroke={`url(#jr-${id})`} strokeWidth="1.1" />
      <circle cx="15" cy="-2.4" r="2.2" fill="none" stroke={`url(#jr-${id})`} strokeWidth="1" />
      {/* the sticker, with a punched hole the ring goes through */}
      <g shapeRendering="crispEdges" dangerouslySetInnerHTML={{ __html: markInner() }} />
      <circle cx="15" cy="1.4" r="0.9" fill="#d8dade" />
    </svg>
  );
}
