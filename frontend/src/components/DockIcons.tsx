import { useId } from "react";

/** The dock's app icons, drawn here: a pale blue folder (closed, or open while works is showing), a cube doodle on a pink tile, and Anton's photo. */

export function FolderIcon({ open = false, className }: { open?: boolean; className?: string }) {
  // ids per instance: the desktop dock's copy is display:none on phones, and a gradient there would not paint
  const id = `fi${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const back = `${id}-back`;
  const front = `${id}-front`;
  return (
    <svg viewBox="0 -1.4 50 40.8" className={className} aria-hidden>
      <defs>
        <linearGradient id={back} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fbdf5" />
          <stop offset="1" stopColor="#62a6ec" />
        </linearGradient>
        <linearGradient id={front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b3dafd" />
          <stop offset="1" stopColor="#93c7f8" />
        </linearGradient>
      </defs>
      <path d="M2 5.2C2 3.4 3.4 2 5.2 2h11.3c1 0 1.9.4 2.5 1.2l2.2 2.6h23.6c1.8 0 3.2 1.4 3.2 3.2v24.8c0 1.8-1.4 3.2-3.2 3.2H5.2C3.4 37 2 35.6 2 33.8V5.2Z" fill={`url(#${back})`} />
      {open ? (
        <>
          <rect x="7" y="7.5" width="34" height="22" rx="1.5" fill="#fff" opacity="0.95" />
          <path d="M6.6 14.5c.3-1.3 1.4-2.2 2.7-2.2h38.1c1.8 0 3.1 1.6 2.7 3.4l-4 18.3c-.3 1.5-1.6 2.5-3.1 2.5H5.3c-2 0-3.4-1.8-2.9-3.7l4.2-18.3Z" fill={`url(#${front})`} />
          <path d="M7.1 14.6c.2-.9 1-1.5 1.9-1.5H47" stroke="#fff" strokeOpacity="0.7" fill="none" />
        </>
      ) : (
        <>
          <path d="M2 12.2C2 10.4 3.4 9 5.2 9h39.6c1.8 0 3.2 1.4 3.2 3.2v21.6c0 1.8-1.4 3.2-3.2 3.2H5.2C3.4 37 2 35.6 2 33.8V12.2Z" fill={`url(#${front})`} />
          <path d="M2.6 12.2c0-1.4 1.2-2.6 2.6-2.6h39.6c1.4 0 2.6 1.2 2.6 2.6" stroke="#fff" strokeOpacity="0.7" fill="none" />
        </>
      )}
    </svg>
  );
}

/** A Rubik's cube drawn like a pen doodle, for the quests tile. */
export function CubeDoodle({ className }: { className?: string }) {
  type P = [number, number];
  const T: P = [24, 6], UR: P = [39, 14.5], LR: P = [39, 31.5], B: P = [24, 40], LL: P = [9, 31.5], UL: P = [9, 14.5], C: P = [24, 23];
  const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const grid = [
    [T, UR, C, UL],
    [UL, C, B, LL],
    [C, UR, LR, B],
  ]
    .flatMap(([a, b, c, d]) =>
      [1 / 3, 2 / 3].flatMap((t) => [
        [lerp(a, b, t), lerp(d, c, t)],
        [lerp(a, d, t), lerp(b, c, t)],
      ]),
    )
    .map(([p, q]) => `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`)
    .join("");
  return (
    <svg viewBox="4 3 40 40" className={className} fill="none" stroke="#e8749a" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M24 6 39 14.5v17L24 40 9 31.5v-17Z" fill="#fff" fillOpacity="0.55" strokeWidth="1.6" />
      <path d="M9 14.5 24 23l15-8.5M24 23v17" strokeWidth="1.6" />
      <path d={grid} strokeWidth="1.1" />
    </svg>
  );
}

/** A little stack of snapshots drawn like a pen doodle (hills and a sun), for the photos tile. */
export function PhotosDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="#e08f3c" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* the print underneath, turned a little */}
      <rect x="9.5" y="7" width="22" height="20" rx="2.2" transform="rotate(-9 20.5 17)" fill="#fff" fillOpacity="0.45" strokeWidth="1.3" />
      {/* the print on top */}
      <rect x="7" y="11" width="26" height="22" rx="2.4" fill="#fff" fillOpacity="0.7" strokeWidth="1.6" />
      <circle cx="26.5" cy="16.8" r="2.3" strokeWidth="1.3" />
      <path d="M9.5 29.5l7-8.2 4.6 5.2 3.4-3.6 6.5 6.6" strokeWidth="1.4" />
    </svg>
  );
}

export function ProfilePhoto({ className }: { className?: string }) {
  return <img src="/about-me.jpg" alt="" className={className} />;
}
