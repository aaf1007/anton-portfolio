import Dock from "@/components/Dock";
import Filters from "@/components/Filters";
import Ground from "@/components/Ground";
import TopBar from "@/components/TopBar";
import { bindNavigate, go, markPainted } from "@/lib/go";
import "@/styles/shell.css";
import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";

const updated = new Date(__BUILD_DATE__);
const stamp = `${String(updated.getMonth() + 1).padStart(2, "0")}/${String(updated.getFullYear()).slice(2)}`;

const PITCH = 24;

/**
 * Works and quests line up with the background grid: their column is the
 * widest odd number of grid squares that fits (1120 / 1280 / 1560 wide by
 * breakpoint), centred on a grid line. The dock shifts by the same offset.
 */
function snapToGrid() {
  const root = document.documentElement;
  const vw = innerWidth;
  if (vw <= 1200) {
    root.style.removeProperty("--snap-w");
    root.style.removeProperty("--snap-left");
    root.style.setProperty("--works-grid-shift", "0px");
    return;
  }
  const max = Math.min(vw >= 1920 ? 1560 : vw >= 1440 ? 1280 : 1120, root.clientWidth - 2 * PITCH);
  let squares = Math.floor(max / PITCH);
  if (squares % 2 === 0) squares -= 1;
  const w = squares * PITCH;
  const left = Math.round((root.clientWidth - w) / 2 / PITCH) * PITCH;
  root.style.setProperty("--snap-w", `${w}px`);
  root.style.setProperty("--snap-left", `${left}px`);
  root.style.setProperty("--works-grid-shift", `${left + w / 2 - vw / 2}px`);
}

/** Wheel down on home opens works; wheel up at the top of works goes home (trackpads and mice, not touch). */
function useWheelNav() {
  useEffect(() => {
    if (matchMedia("(hover: none)").matches) return;
    let locked = false;
    let down = 0;
    let up = 0;
    let quietUntil = 0;
    const trip = (to: string) => {
      locked = true;
      down = up = 0;
      go(to);
      window.setTimeout(() => {
        locked = false;
        down = up = 0;
      }, 2000);
    };
    const onWheel = (e: WheelEvent) => {
      if (locked || document.documentElement.classList.contains("tank-mode")) return;
      const path = location.pathname;
      if (path === "/") {
        if (e.deltaY > 0) {
          down += e.deltaY;
          up = 0;
          if (down >= 40) trip("/projects");
        } else down = 0;
      } else if (path === "/projects") {
        if (window.scrollY <= 1) {
          if (e.deltaY < 0) {
            down = 0;
            if (Date.now() >= quietUntil) {
              up += Math.abs(e.deltaY);
              if (up >= 60) trip("/");
            }
          } else up = 0;
        } else {
          up = 0;
          quietUntil = Date.now() + 600;
        }
      }
    };
    addEventListener("wheel", onWheel, { passive: true });
    return () => removeEventListener("wheel", onWheel);
  }, []);
}

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const reading = /^\/projects\/./.test(pathname);
  const home = pathname === "/";
  const scrolls = pathname === "/projects" || pathname === "/quests" || pathname === "/photos";

  useLayoutEffect(() => bindNavigate((to) => navigate(to)), [navigate]);
  useWheelNav();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reading", reading);
    root.dataset.route = pathname === "/" ? "home" : pathname.slice(1).split("/")[0];
    if (!home) root.classList.add("welcome-played");
    snapToGrid();
  }, [pathname, reading, home]);

  useEffect(() => {
    markPainted();
    const root = document.documentElement;
    const ready = () => root.classList.add("fonts-ready");
    void document.fonts.ready.then(ready);
    const t = window.setTimeout(ready, 2000);
    addEventListener("resize", snapToGrid);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", snapToGrid);
    };
  }, []);

  return (
    <div className={home ? "shell shell--home" : reading ? "shell shell--reading" : "shell"}>
      {!reading && <Ground />}
      <Filters />
      <a href="#main" className="skip-link">
        skip to content
      </a>
      <TopBar />

      <main id="main" className="main">
        <div key={pathname} className={home ? "page page--home" : "page"}>
          {outlet}
        </div>
        {scrolls && (
          <p className="colophon colophon--static" aria-hidden>
            Last updated {stamp} <span className="colophon-kao">✎</span>
          </p>
        )}
      </main>

      {!reading && <Dock home={home} />}
      {!reading && !scrolls && (
        <p className="colophon" aria-hidden>
          Last updated {stamp} <span className="colophon-kao">✎</span>
        </p>
      )}
    </div>
  );
}
