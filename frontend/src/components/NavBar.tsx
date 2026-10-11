import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavKey = "home" | "work" | "life" | "resume" | "contact";

const items: Array<{ key: NavKey; to: string }> = [
  { key: "home", to: "/" },
  { key: "work", to: "/projects" },
  { key: "life", to: "/life" },
  { key: "resume", to: "/resume" },
  { key: "contact", to: "/#contact" },
];

/** True while the home page's #contact section is on screen. */
function useContactInView(onHome: boolean) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!onHome) return;
    let io: IntersectionObserver | undefined;
    let timer = 0, tries = 0;
    // the section mounts after the page transition, so poll briefly for it
    const attach = () => {
      const el = document.getElementById("contact");
      if (!el) {
        if (tries++ < 20) timer = window.setTimeout(attach, 100);
        return;
      }
      io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        rootMargin: "0px 0px -35% 0px",
      });
      io.observe(el);
    };
    attach();
    return () => {
      window.clearTimeout(timer);
      io?.disconnect();
      setInView(false);
    };
  }, [onHome]);
  return onHome && inView;
}

function SunMoon({ dark }: { dark: boolean }) {
  // a half-filled circle; the filled half flips with the theme
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <motion.path
        d="M8 1.75 A6.25 6.25 0 0 1 8 14.25 Z"
        fill="currentColor"
        animate={{ rotate: dark ? 0 : 180 }}
        style={{ originX: "50%", originY: "50%" }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      />
    </svg>
  );
}

/** Floating segmented control pinned to the bottom of the viewport. */
export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const onHome = pathname === "/";
  const contactInView = useContactInView(onHome);

  const active: NavKey | null = onHome
    ? contactInView
      ? "contact"
      : "home"
    : pathname.startsWith("/projects")
      ? "work"
      : pathname.startsWith("/life")
        ? "life"
        : pathname.startsWith("/resume")
          ? "resume"
          : null;

  // on the home page, home and contact scroll instead of navigating
  const go = (key: NavKey) => {
    const item = items.find((i) => i.key === key)!;
    if (onHome && key === "contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "/#contact");
    } else if (onHome && key === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "/");
    } else {
      navigate(item.to);
    }
  };

  // number keys jump between sections, "t" flips the theme
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true]")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= items.length) {
        go(items[n - 1].key);
      } else if (e.key === "t") {
        toggleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onClick = (key: NavKey) => (e: MouseEvent) => {
    if (onHome && (key === "contact" || key === "home")) {
      e.preventDefault();
      go(key);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-1 rounded-[10px] border border-rule bg-background/80 p-1 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl"
      >
        <ul className="flex items-center">
          {items.map(({ key, to }, i) => {
            const isActive = active === key;
            return (
              <li key={key}>
                <Link
                  to={to}
                  onClick={onClick(key)}
                  aria-current={isActive ? "page" : undefined}
                  aria-keyshortcuts={String(i + 1)}
                  title={`${key} — press ${i + 1}`}
                  className={cn(
                    "relative flex h-9 items-center justify-center px-2.5 text-[11.5px] tracking-wide transition-colors sm:h-10 sm:w-[84px] sm:px-0",
                    isActive ? "text-signal-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-[7px] bg-signal shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{key}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <span className="h-5 w-px bg-rule" aria-hidden />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-keyshortcuts="t"
          title="theme — press t"
          className="flex size-9 items-center justify-center rounded-[7px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:size-10"
        >
          <SunMoon dark={theme === "dark"} />
        </button>
      </nav>
    </div>
  );
}
