import { cn } from "@/lib/utils";
import "./cube.css";
import { useEffect, useRef, useState } from "react";

/**
 * A 3×3 Rubik's cube in CSS 3D. Each cubie keeps an integer position and a
 * rotation matrix; a layer turn animates as an extra rotate() in front of the
 * cubie's matrix3d, then commits by multiplying the quarter turn in. Faces are
 * shaded per frame from a fixed light so the plastic reads as solid.
 *
 * Coordinates are CSS's: x right, y down, z toward the viewer.
 */

type Vec = [number, number, number];
type Mat = number[]; // 3×3, row-major
type Axis = 0 | 1 | 2;
type Move = { axis: Axis; layer: number; dir: 1 | -1 };
type Queued = Move & { ms: number; record: boolean };

const I: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1];

function rot(axis: Axis, rad: number): Mat {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  if (axis === 0) return [1, 0, 0, 0, c, -s, 0, s, c];
  if (axis === 1) return [c, 0, s, 0, 1, 0, -s, 0, c];
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}
const quarter = (axis: Axis, dir: number) => rot(axis, (dir * Math.PI) / 2).map(Math.round);

function mul(a: Mat, b: Mat): Mat {
  const o = new Array(9).fill(0);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return o;
}
const apply = (m: Mat, v: Vec): Vec => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];

const FACES: { n: Vec; t: string; color: string }[] = [
  { n: [0, 0, 1], t: "translateZ(calc(var(--s) / 2))", color: "#2fa56a" }, // front · green
  { n: [0, 0, -1], t: "rotateY(180deg) translateZ(calc(var(--s) / 2))", color: "#2f6fe4" }, // back · blue
  { n: [1, 0, 0], t: "rotateY(90deg) translateZ(calc(var(--s) / 2))", color: "#e2443a" }, // right · red
  { n: [-1, 0, 0], t: "rotateY(-90deg) translateZ(calc(var(--s) / 2))", color: "#f28a2e" }, // left · orange
  { n: [0, -1, 0], t: "rotateX(90deg) translateZ(calc(var(--s) / 2))", color: "#f7f5ee" }, // up · white
  { n: [0, 1, 0], t: "rotateX(-90deg) translateZ(calc(var(--s) / 2))", color: "#f5c63f" }, // down · yellow
];

const START: Vec[] = [];
for (let x = -1; x <= 1; x++)
  for (let y = -1; y <= 1; y++)
    for (let z = -1; z <= 1; z++) if (x || y || z) START.push([x, y, z]);

// toward the light: up, a little left, mostly in front
const LIGHT: Vec = (() => {
  const v: Vec = [-0.3, -0.72, 0.62];
  const l = Math.hypot(...v);
  return v.map((n) => n / l) as Vec;
})();

const REST_X = -27;
const REST_Y = -38;

function randomMoves(n: number, ms: number): Queued[] {
  const out: Queued[] = [];
  let last = -1;
  while (out.length < n) {
    const axis = Math.floor(Math.random() * 3) as Axis;
    if (axis === last) continue;
    last = axis;
    out.push({ axis, layer: [-1, 1][Math.floor(Math.random() * 2)], dir: Math.random() < 0.5 ? 1 : -1, ms, record: true });
  }
  return out;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Cube({ className }: { className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const cubieRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[][]>(START.map(() => []));
  const [status, setStatus] = useState<{ solved: boolean; moves: number; busy: boolean; justSolved: boolean }>({
    solved: true,
    moves: 0,
    busy: false,
    justSolved: false,
  });

  // mutable simulation state, read by the frame loop
  const sim = useRef({
    pos: START.map((p) => [...p] as Vec),
    R: START.map(() => [...I]),
    queue: [] as Queued[],
    active: null as (Queued & { start: number }) | null,
    history: [] as Move[],
    view: { x: REST_X, y: REST_Y },
    vel: { x: 0, y: 0 },
    drag: null as null | { id: number; x: number; y: number; moved: boolean; lastX: number; lastY: number; lastT: number },
    lastInput: -1e9,
    size: 60,
    solvingFrom: 0,
  });

  const enqueue = (moves: Queued[]) => {
    sim.current.queue.push(...moves);
    setStatus((s) => ({ ...s, busy: true, justSolved: false }));
  };

  const scramble = () => {
    if (sim.current.active || sim.current.queue.length) return;
    enqueue(randomMoves(18, 120));
  };

  const solve = () => {
    const s = sim.current;
    if (s.active || s.queue.length || !s.history.length) return;
    s.solvingFrom = s.history.length;
    const back = [...s.history].reverse().map((m) => ({ ...m, dir: (m.dir * -1) as 1 | -1, ms: 150, record: false }));
    s.history = [];
    enqueue(back);
  };

  useEffect(() => {
    const scene = sceneRef.current!;
    const cube = cubeRef.current!;
    const s = sim.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ro = new ResizeObserver(([entry]) => {
      s.size = entry.contentRect.width / 4.5;
      scene.style.setProperty("--s", `${s.size}px`);
    });
    ro.observe(scene);

    const isSolved = () => {
      const seen = new Map<string, string>();
      for (let i = 0; i < START.length; i++) {
        for (const f of FACES) {
          if (START[i][f.n.findIndex((v) => v !== 0)] !== f.n.find((v) => v !== 0)) continue;
          const w = apply(s.R[i], f.n).map(Math.round).join();
          if (seen.has(w) && seen.get(w) !== f.color) return false;
          seen.set(w, f.color);
        }
      }
      return true;
    };

    let raf = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;

      // -- view: drag, inertia, idle drift
      if (!s.drag) {
        s.view.y += s.vel.y * dt;
        s.view.x += s.vel.x * dt;
        const damp = Math.pow(0.992, dt);
        s.vel.x *= damp;
        s.vel.y *= damp;
        if (!reduce && now - s.lastInput > 1600) {
          // sway around the nearest three-quarter view so two side faces always show
          const restY = REST_Y + 90 * Math.round((s.view.y - REST_Y) / 90);
          const ease = Math.min(1, dt * 0.0016);
          s.view.y += (restY + Math.sin(now / 2600) * 16 - s.view.y) * ease;
          s.view.x += (REST_X + Math.sin(now / 2400) * 5 - s.view.x) * ease;
        }
      }
      s.view.x = Math.max(-80, Math.min(80, s.view.x));
      cube.style.transform = `rotateX(${s.view.x}deg) rotateY(${s.view.y}deg)`;
      const V = mul(rot(0, (s.view.x * Math.PI) / 180), rot(1, (s.view.y * Math.PI) / 180));

      // -- layer turns
      if (!s.active && s.queue.length) s.active = { ...s.queue.shift()!, start: now };
      let turn: Mat | null = null;
      let turnCss = "";
      let finished = false;
      if (s.active) {
        const t = Math.min(1, (now - s.active.start) / (reduce ? 1 : s.active.ms));
        const a = s.active.dir * 90 * easeInOut(t);
        turn = rot(s.active.axis, (a * Math.PI) / 180);
        turnCss = `rotate${"XYZ"[s.active.axis]}(${a}deg) `;
        finished = t >= 1;
      }

      const S = s.size;
      for (let i = 0; i < START.length; i++) {
        const el = cubieRefs.current[i];
        if (!el) continue;
        const moving = s.active && s.pos[i][s.active.axis] === s.active.layer;
        const R = s.R[i];
        const [x, y, z] = s.pos[i];
        el.style.transform =
          (moving ? turnCss : "") +
          `matrix3d(${R[0]},${R[3]},${R[6]},0,${R[1]},${R[4]},${R[7]},0,${R[2]},${R[5]},${R[8]},0,${x * S},${y * S},${z * S},1)`;

        const M = moving && turn ? mul(V, mul(turn, R)) : mul(V, R);
        const shades = shadeRefs.current[i];
        for (let f = 0; f < FACES.length; f++) {
          const n = apply(M, FACES[f].n);
          const d = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
          if (shades[f]) shades[f]!.style.opacity = String(0.5 * Math.pow(1 - d, 1.4));
        }
      }

      if (finished && s.active) {
        const q = quarter(s.active.axis, s.active.dir);
        for (let i = 0; i < START.length; i++) {
          if (s.pos[i][s.active.axis] !== s.active.layer) continue;
          s.pos[i] = apply(q, s.pos[i]).map(Math.round) as Vec;
          s.R[i] = mul(q, s.R[i]);
        }
        if (s.active.record) s.history.push({ axis: s.active.axis, layer: s.active.layer, dir: s.active.dir });
        s.active = null;
        if (!s.queue.length) {
          const solved = isSolved();
          if (solved) s.history = [];
          setStatus({
            solved,
            moves: s.history.length,
            busy: false,
            justSolved: solved && s.solvingFrom > 0,
          });
          s.solvingFrom = 0;
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const s = sim.current;
    s.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, lastX: e.clientX, lastY: e.clientY, lastT: e.timeStamp };
    s.vel = { x: 0, y: 0 };
    s.lastInput = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = sim.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
    d.moved = true;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    s.view.y += dx * 0.45;
    s.view.x -= dy * 0.45;
    s.vel = { x: (-dy * 0.45) / dt, y: (dx * 0.45) / dt };
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    s.lastInput = performance.now();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = sim.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    s.drag = null;
    s.lastInput = performance.now();
    if (!d.moved && !s.queue.length && !s.active) enqueue(randomMoves(1, 260));
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative aspect-square w-full">
        {/* contact shadow on the paper */}
        <div
          aria-hidden
          className="absolute bottom-[4%] left-1/2 h-[12%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(30_26_21/0.32),rgb(30_26_21/0.08)_60%,transparent)] blur-[6px]"
        />
        <div
          ref={sceneRef}
          role="img"
          aria-label="A Rubik's cube. Drag to spin it, tap it to twist a layer."
          className="cube-scene absolute inset-0 select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={cubeRef} className="cube">
            {START.map((p, i) => (
              <div key={p.join()} ref={(el) => void (cubieRefs.current[i] = el)} className="cubie">
                {FACES.map((f, fi) => {
                  const axis = f.n.findIndex((v) => v !== 0);
                  const outer = p[axis] === f.n[axis];
                  return (
                    <div key={fi} className="cubie-face" style={{ transform: f.t }}>
                      {outer && <div className="sticker" style={{ "--c": f.color } as React.CSSProperties} />}
                      <div ref={(el) => void (shadeRefs.current[i][fi] = el)} className="cubie-shade" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1 flex h-8 items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-ink-faint uppercase">
        {status.solved ? (
          <>
            <span className="hidden sm:inline">{status.justSolved ? "solved ✓" : "drag · tap to twist"}</span>
            <button
              type="button"
              onClick={scramble}
              disabled={status.busy}
              className="cube-btn"
            >
              scramble
            </button>
          </>
        ) : (
          <>
            <span className="tabular-nums">{status.busy ? "turning…" : `${status.moves} moves deep`}</span>
            <button
              type="button"
              onClick={solve}
              disabled={status.busy || status.moves === 0}
              className="cube-btn"
            >
              solve
            </button>
          </>
        )}
      </div>
    </div>
  );
}
