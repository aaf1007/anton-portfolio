import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chain, Charm, DeviceButton, DeviceFrame, FRAME_H, FRAME_W, MarkCharm } from "./Device";
import { createTank, type Tank } from "./sim";
import "./tamagotchi.css";

/**
 * The home page's centrepiece: Anton's tamagotchi on a keychain, with Nigiri
 * the koi swimming in its screen. Hover shows FEED ME; a click lifts the toy
 * out to the middle of the screen (?tama) where its three keys work:
 * FEED, PLAY (a guess-the-side game) and SLEEP / WAKE.
 */

const FRAME_AR = FRAME_H / FRAME_W;
// the frame's window, as fractions of the frame
const HOLE = { x: 0.2311, y: 0.391, w: 0.5314, h: 0.389 };
const CARD = 128;
const GLIDE = "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)";

const EXPAND_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
const arrow = (flip: boolean) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"${flip ? ' style="transform:scaleX(-1)"' : ""}><polygon points="8.5 12 15.5 6 15.5 18" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
const CHIP_ICONS: Record<string, string> = { expand: EXPAND_ICON, LEFT: arrow(false), RIGHT: arrow(true) };

export default function Tamagotchi() {
  const tamaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const swayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tankRef = useRef<Tank | null>(null);
  const refreshChip = useRef<() => void>(() => {});
  const [keys, setKeys] = useState({ feed: "FEED", lamp: "SLEEP" });

  useEffect(() => refreshChip.current(), [keys]);

  useEffect(() => {
    const root = document.documentElement;
    const tama = tamaRef.current!;
    const card = cardRef.current!;
    const dev = devRef.current!;
    const cursor = cursorRef.current!;
    const chip = chipRef.current!;
    const isOpen = () => root.classList.contains("tank-open");
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // ---- the cursor chip (fine pointers only)
    let chipShows = "";
    let chipKey: HTMLElement | null = null;
    const hideChip = () => cursor.classList.remove("is-on");
    const setChip = (shows: string) => {
      chipShows = shows;
      const icon = CHIP_ICONS[shows];
      if (icon) chip.innerHTML = icon;
      else chip.textContent = shows;
      cursor.classList.toggle("key-cursor--icon", !!icon);
    };
    const chipLabel = (key: HTMLElement) =>
      key.classList.contains("tank-dev-key--2") && root.classList.contains("tank-playing") ? "" : (key.dataset.cursor ?? "");
    refreshChip.current = () => {
      if (!chipKey || !cursor.classList.contains("is-on")) return;
      const shows = chipLabel(chipKey);
      if (shows) setChip(shows);
      else hideChip();
    };
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerMove = (e: PointerEvent) => {
      cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      const t = e.target instanceof Element ? e.target : null;
      const key = t && isOpen() && !root.classList.contains("tank-play-back") ? (t.closest(".tank-dev-key") as HTMLElement | null) : null;
      const hero = t && !root.classList.contains("tank-mode") && t.closest(".tama") && !t.closest(".tama-chain") && !t.closest(".fish-btn");
      chipKey = key;
      const shows = key ? chipLabel(key) : hero ? "expand" : "";
      if (!shows) return hideChip();
      if (shows !== chipShows) setChip(shows);
      cursor.classList.add("is-on");
    };
    if (fine) {
      root.classList.add("key-cursor-live");
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", hideChip);
    }

    // ---- the tank itself
    const tank = createTank(canvasRef.current!, {
      isOpen,
      onKeys: (feed, lamp) => setKeys({ feed, lamp }),
      rootClass: (name, on) => root.classList.toggle(name, on),
      hideChip,
    });
    tankRef.current = tank;

    // ---- measure the card's slot and aim the tank (and device) at the middle of the screen
    function positionTank() {
      // the tilt and the idle rock are mid-swing: neutralise them for the measure
      const rot = rotRef.current;
      const sway = swayRef.current;
      if (rot) {
        rot.style.transition = "none";
        rot.style.transform = "none";
      }
      if (sway) {
        sway.style.animation = "none";
        sway.style.transform = "none";
      }
      void card.offsetWidth;
      requestAnimationFrame(() => {
        if (rot) {
          rot.style.transition = "";
          rot.style.transform = "";
        }
        if (sway) {
          sway.style.animation = "";
          sway.style.transform = "";
        }
      });
      const r = card.getBoundingClientRect();
      const vw = root.clientWidth;
      const vh = root.clientHeight;
      let devH = Math.min(vh * 0.64, vw >= 2400 ? 780 : 620);
      const devW = Math.min(devH / FRAME_AR, vw * 0.92);
      devH = devW * FRAME_AR;
      const devLeft = (vw - devW) / 2;
      const devTop = (vh - devH) / 2;
      // fill the window with a little bleed so the water tucks under the bezel
      const scale = (Math.min(devW * HOLE.w, devH * HOLE.h) / CARD) * 1.03;
      const holeCX = devLeft + devW * (HOLE.x + HOLE.w / 2);
      const holeCY = devTop + devH * (HOLE.y + HOLE.h / 2);
      root.style.setProperty("--tank-fish-x", `${holeCX - (r.left + r.width / 2)}px`);
      root.style.setProperty("--tank-fish-y", `${holeCY - (r.top + r.height / 2)}px`);
      root.style.setProperty("--tank-fish-scale", String((scale * CARD) / r.width));
      root.style.setProperty("--dev-left", `${devLeft}px`);
      root.style.setProperty("--dev-top", `${devTop}px`);
      root.style.setProperty("--dev-w", `${devW}px`);
    }

    // the device glides between the card's frame and its seat (FLIP)
    const devRects = () => {
      dev.style.transition = "none";
      dev.style.transform = "none";
      return { card: frameRef.current!.getBoundingClientRect(), dev: dev.getBoundingClientRect() };
    };
    const toCard = (r: { card: DOMRect; dev: DOMRect }) =>
      `translate(${r.card.left - r.dev.left}px,${r.card.top - r.dev.top}px) scale(${r.card.width / r.dev.width})`;
    function glideFromCard() {
      if (root.classList.contains("tank-instant")) return;
      const r = devRects();
      dev.style.transformOrigin = "0 0";
      dev.style.transform = toCard(r);
      void dev.offsetWidth;
      dev.style.transition = GLIDE;
      dev.style.transform = "none";
    }
    function glideToCard() {
      const r = devRects();
      dev.style.transformOrigin = "0 0";
      void dev.offsetWidth;
      dev.style.transition = GLIDE;
      dev.style.transform = toCard(r);
    }
    // a keychain leaning on hover hands its lean to the expanded one, which eases back
    function handOffLean(leaning: boolean) {
      const els = dev.querySelectorAll<HTMLElement>(".tank-dev-chain, .tank-dev-charm");
      if (!leaning || !els.length) return;
      els.forEach((el) => el.classList.add("chain-lean", "chain-snap"));
      void els[0].offsetWidth;
      els.forEach((el) => el.classList.remove("chain-snap"));
      requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => el.classList.remove("chain-lean"))));
    }

    let closeTimer = 0;
    function openTank(push: boolean) {
      if (isOpen()) return;
      const leaning = tama.matches(":hover") && matchMedia("(hover: hover)").matches;
      root.classList.add("tank-visited", "tank-mode", "tank-open");
      root.classList.remove("tank-closing");
      clearTimeout(closeTimer);
      positionTank();
      glideFromCard();
      handOffLean(leaning);
      if (push) history.pushState({ ...(history.state ?? {}), tank: 1 }, "", `${location.pathname}?tama`);
      tank.greetIfMissed();
      hideChip();
    }
    function collapseTank() {
      root.classList.remove("tank-mode", "tank-open");
      hideChip();
      root.classList.add("tank-closing");
      glideToCard();
      clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        root.classList.remove("tank-closing");
        dev.style.transition = "none";
        dev.style.transform = "none";
      }, 900);
    }
    function requestClose() {
      if (!isOpen()) return;
      if (history.state?.tank) history.back();
      else {
        collapseTank();
        const { tank: _drop, ...state } = (history.state ?? {}) as Record<string, unknown>;
        void _drop;
        history.replaceState(state, "", location.pathname + location.hash);
      }
    }
    const onPop = () => {
      const wants = new URLSearchParams(location.search).has("tama");
      if (wants && !isOpen()) openTank(false);
      else if (!wants && isOpen()) collapseTank();
    };
    window.addEventListener("popstate", onPop);

    // the whole toy opens it; the keychain and FEED ME don't
    const onTamaClick = (e: MouseEvent) => {
      // FEED ME feeds without opening (its React handler runs after this native one)
      if (e.target instanceof Element && e.target.closest(".fish-btn")) return;
      if (!isOpen()) openTank(true);
    };
    const onTamaKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !isOpen()) {
        e.preventDefault();
        openTank(true);
      }
    };
    const chain = tama.querySelector(".tama-chain");
    const stop = (e: Event) => e.stopPropagation();
    chain?.addEventListener("click", stop);
    tama.addEventListener("click", onTamaClick);
    tama.addEventListener("keydown", onTamaKey);
    closeRef.current!.addEventListener("click", requestClose);

    // a click on the empty page around the toy closes it (press and release both outside)
    const devBox = () => {
      let L = Infinity;
      let T = Infinity;
      let R = -Infinity;
      let B = -Infinity;
      [...dev.children, card.querySelector(".tank-box")].forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        L = Math.min(L, r.left);
        T = Math.min(T, r.top);
        R = Math.max(R, r.right);
        B = Math.max(B, r.bottom);
      });
      return { L, T, R, B };
    };
    const outside = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('button, a, input, select, textarea, label, [role="button"]:not(.tama)')) return false;
      const d = devBox();
      return !(e.clientX >= d.L && e.clientX <= d.R && e.clientY >= d.T && e.clientY <= d.B);
    };
    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = isOpen() && !root.classList.contains("tank-closing") && outside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && isOpen() && outside(e)) requestClose();
      pressedOutside = false;
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    const onResize = () => {
      if (isOpen()) positionTank();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    // the keys sink while held (never shorter than 120ms, so a trackpad tap reads)
    const unbind: (() => void)[] = [];
    dev.querySelectorAll<HTMLButtonElement>(".tank-dev-key").forEach((k, i) => {
      const img = dev.querySelector(`.tank-dev-btn--${i + 1}`);
      if (!img) return;
      let downAt = 0;
      const down = () => {
        downAt = performance.now();
        img.classList.remove("dome-pressed");
        img.classList.add("dome-down");
        const release = () => {
          window.removeEventListener("pointerup", release);
          window.removeEventListener("pointercancel", release);
          later(() => img.classList.remove("dome-down"), Math.max(0, 120 - (performance.now() - downAt)));
        };
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
      };
      // keyboard presses replay a fixed press
      const click = () => {
        if (performance.now() - downAt > 400) {
          img.classList.remove("dome-pressed");
          void (img as HTMLElement).getBoundingClientRect();
          img.classList.add("dome-pressed");
        }
      };
      k.addEventListener("pointerdown", down);
      k.addEventListener("click", click);
      unbind.push(() => {
        k.removeEventListener("pointerdown", down);
        k.removeEventListener("click", click);
      });
    });

    // the load drop needs the scroller unclipped while it falls
    const dropStart = (e: AnimationEvent) => {
      if (e.target === tama && e.animationName === "tamaDrop") {
        root.classList.add("tama-dropping");
        later(() => root.classList.remove("tama-dropping"), 1600);
      }
    };
    const dropEnd = (e: AnimationEvent) => {
      if (e.target === tama) root.classList.remove("tama-dropping");
    };
    tama.addEventListener("animationstart", dropStart);
    tama.addEventListener("animationend", dropEnd);
    tama.addEventListener("animationcancel", dropEnd);

    // a ?tama deep link arrives open: keep the tank glued to centre while the page settles
    let settle = 0;
    if (isOpen()) {
      let frames = 0;
      const loop = () => {
        positionTank();
        if (++frames < 100) settle = requestAnimationFrame(loop);
        else root.classList.remove("tank-instant");
      };
      loop();
      void document.fonts.ready.then(() => isOpen() && positionTank());
      tank.greetIfMissed();
    }

    return () => {
      tank.destroy();
      tankRef.current = null;
      cancelAnimationFrame(settle);
      timers.forEach(clearTimeout);
      clearTimeout(closeTimer);
      unbind.forEach((f) => f());
      document.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", hideChip);
      window.removeEventListener("popstate", onPop);
      chain?.removeEventListener("click", stop);
      tama.removeEventListener("click", onTamaClick);
      tama.removeEventListener("keydown", onTamaKey);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      tama.removeEventListener("animationstart", dropStart);
      tama.removeEventListener("animationend", dropEnd);
      tama.removeEventListener("animationcancel", dropEnd);
      // only once the toy is really gone (a dev remount keeps a ?tama deep link open)
      window.setTimeout(() => {
        if (document.querySelector(".tama")) return;
        root.classList.remove("key-cursor-live", "tank-mode", "tank-open", "tank-closing", "tank-instant", "tank-playing", "tank-play-back", "tank-night", "tama-dropping");
      }, 0);
    };
  }, []);

  const feed = (e: React.MouseEvent) => {
    e.stopPropagation();
    tankRef.current?.feed();
  };

  return (
    <>
      <div
        ref={tamaRef}
        className="tama"
        role="button"
        tabIndex={0}
        aria-label="Nigiri the koi lives in this tamagotchi. Open it to feed him, play, or put him to bed"
      >
        <Chain className="tama-chain" />
        <span className="tama-charm" aria-hidden>
          <span className="charm-mini">
            <MarkCharm />
          </span>
          <span className="charm-hang">
            <Charm />
          </span>
        </span>
        <div ref={rotRef} className="tama-rot">
          <div ref={swayRef} className="tama-sway">
            <div ref={cardRef} className="card-fish">
              <div className="tank-box">
                <canvas ref={canvasRef} className="tank-canvas" width={CARD} height={CARD} />
                <div className="fish-hud">
                  <button type="button" className="fish-btn" onClick={feed} title="Feed Nigiri">
                    FEED ME
                  </button>
                </div>
              </div>
            </div>
            <div ref={frameRef} className="tama-frame">
              <DeviceFrame />
            </div>
            {([1, 2, 3] as const).map((n) => (
              <button key={n} type="button" className={`tama-key tama-key--${n}`} disabled aria-hidden tabIndex={-1} />
            ))}
            {([0, 1, 2] as const).map((i) => (
              <DeviceButton key={i} index={i} className={`tama-btn tama-btn--${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      {createPortal(
        <>
          <div ref={devRef} className="tank-dev">
            <Chain className="tank-dev-chain" />
            <span className="tank-dev-charm" aria-hidden>
              <span className="charm-mini">
                <MarkCharm />
              </span>
              <span className="charm-hang">
                <Charm />
              </span>
            </span>
            <DeviceFrame className="tank-dev-frame" />
            <button type="button" className="tank-dev-key tank-dev-key--1" data-cursor={keys.feed} aria-label="Feed Nigiri" onClick={feed} />
            <button type="button" className="tank-dev-key tank-dev-key--2" data-cursor="PLAY" aria-label="Play with Nigiri" onClick={() => tankRef.current?.play()} />
            <button
              type="button"
              className="tank-dev-key tank-dev-key--3"
              data-cursor={keys.lamp}
              aria-label="Toggle nighttime"
              onClick={() => tankRef.current?.lamp()}
            />
            {([0, 1, 2] as const).map((i) => (
              <DeviceButton key={i} index={i} className={`tank-dev-btn tank-dev-btn--${i + 1}`} />
            ))}
          </div>
          <div ref={cursorRef} className="key-cursor" aria-hidden>
            <span ref={chipRef} className="key-cursor-chip" />
          </div>
          <div id="tank-overlay" aria-hidden={false}>
            <button ref={closeRef} type="button" className="fish-btn tank-close" title="Back to portfolio" aria-label="Close the tamagotchi">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
