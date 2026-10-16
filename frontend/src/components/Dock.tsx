import { links } from "@/data/portfolio";
import { go } from "@/lib/go";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CubeDoodle, FolderIcon, PhotosDoodle, ProfilePhoto } from "./DockIcons";

type App = { to: string; label: string; icon: (works: boolean) => ReactNode; mobileIcon: (works: boolean) => ReactNode };

const APPS: App[] = [
  {
    to: "/projects",
    label: "works",
    icon: (open) => <FolderIcon open={open} className="folder-icon folder-icon--img folder-icon--works" />,
    mobileIcon: (open) => <FolderIcon open={open} className="dock-icon dock-icon--img" />,
  },
  {
    to: "/quests",
    label: "quests",
    icon: () => (
      <span className="folder-icon folder-icon--quests">
        <CubeDoodle className="folder-quests-img" />
      </span>
    ),
    mobileIcon: () => (
      <span className="dock-icon dock-icon--sq">
        <CubeDoodle className="dock-sq-img" />
      </span>
    ),
  },
  {
    to: "/photos",
    label: "photos",
    icon: () => (
      <span className="folder-icon folder-icon--photos">
        <PhotosDoodle className="folder-quests-img" />
      </span>
    ),
    mobileIcon: () => (
      <span className="dock-icon dock-icon--photos">
        <PhotosDoodle className="dock-sq-img" />
      </span>
    ),
  },
  {
    to: "/profile",
    label: "profile",
    icon: () => (
      <span className="folder-icon folder-icon--profile">
        <ProfilePhoto className="folder-profile-img" />
      </span>
    ),
    mobileIcon: () => (
      <span className="dock-icon dock-icon--profile">
        <ProfilePhoto className="dock-profile-img" />
      </span>
    ),
  },
];

const active = (pathname: string, to: string) => pathname === to;

/** The works folder hops every few seconds on a first visit, until works has been opened. */
function useWorksBounce(pathname: string) {
  const [bouncing, setBouncing] = useState(false);
  const [opened, setOpened] = useState(false);
  if (pathname === "/projects" && !opened) setOpened(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("works-bounce") === "1";
      sessionStorage.setItem("works-bounce", "1");
    } catch {
      /* no session storage: bounce anyway */
    }
    if (seen) return;
    let every = 0;
    const hop = () => setBouncing(true);
    const first = window.setTimeout(() => {
      hop();
      every = window.setInterval(hop, 3000);
    }, 3000);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, []);

  return { bouncing: bouncing && !opened, done: () => setBouncing(false) };
}

export default function Dock({ home }: { home: boolean }) {
  const { pathname } = useLocation();
  const tray = useRef<HTMLDivElement>(null);
  const { bouncing, done } = useWorksBounce(pathname);
  const [linksOpen, setLinksOpen] = useState(false);
  const linksWrap = useRef<HTMLDivElement>(null);
  const worksOpen = pathname === "/projects";

  // the glass highlight follows the pointer
  useEffect(() => {
    const el = tray.current;
    if (!el || !matchMedia("(hover: hover)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };
    const leave = () => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (!linksOpen) return;
    const close = (e: MouseEvent) => {
      if (!linksWrap.current?.contains(e.target as Node)) setLinksOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [linksOpen]);

  const open = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    go(to);
  };

  return (
    <>
      <nav aria-label="Main navigation" className={home ? "folder-nav" : "folder-nav folder-nav--fixed"}>
        <div ref={tray} className="folder-nav-inner">
          {APPS.map((app) => (
            <a
              key={app.to}
              href={app.to}
              onClick={open(app.to)}
              aria-label={app.label}
              aria-current={active(pathname, app.to) ? "page" : undefined}
              className={[
                "folder-item",
                active(pathname, app.to) && "active",
                app.to === "/projects" && bouncing && "bouncing",
              ]
                .filter(Boolean)
                .join(" ")}
              onAnimationEnd={app.to === "/projects" ? done : undefined}
            >
              {app.icon(app.to === "/projects" && worksOpen)}
              <span className="folder-label">{app.label}</span>
            </a>
          ))}
        </div>
      </nav>

      <nav aria-label="Mobile navigation" className="mobile-dock">
        <div className="dock-bar">
          {APPS.map((app) => (
            <a
              key={app.to}
              href={app.to}
              onClick={open(app.to)}
              aria-label={app.label}
              aria-current={active(pathname, app.to) ? "page" : undefined}
              className={active(pathname, app.to) ? "dock-item active" : "dock-item"}
            >
              {app.mobileIcon(app.to === "/projects" && worksOpen)}
              <span className="dock-label">{app.label}</span>
            </a>
          ))}
          <div ref={linksWrap} className="dock-links-wrap">
            <div className={linksOpen ? "dock-links-popup is-open" : "dock-links-popup"}>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="dock-links-item" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z" />
                </svg>
              </a>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="dock-links-item" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
              <a href="/resume" onClick={open("/resume")} className="dock-links-item" aria-label="Resume">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                  <path d="M14 3v5h5M9 13h6M9 17h6" />
                </svg>
              </a>
            </div>
            <button type="button" className="dock-item dock-item--links" aria-label="Links" aria-expanded={linksOpen} onClick={() => setLinksOpen((o) => !o)}>
              <span className="dock-icon dock-icon--links">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <span className="dock-label">links</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
