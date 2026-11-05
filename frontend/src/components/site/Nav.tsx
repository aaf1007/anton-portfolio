import { profile } from "@/data/portfolio";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const pages = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/photos", label: "Photos" },
];

type Theme = "dark" | "light";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0f0e0e" : "#ffffff");
      setTheme(next);
    };
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice just doesn't stick */
    }
    // a soft crossfade where the browser supports it
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(apply);
    else apply();
  };
  return (
    <button
      type="button"
      className="s-theme"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
    </button>
  );
}

export default function Nav() {
  return (
    <header className="s-nav s-rule-b">
      <div className="s-nav-inner">
        <Link to="/" className="s-logo" aria-label={`${profile.name}, home`}>
          {profile.short}
        </Link>
        <nav aria-label="Main" className="s-links">
          {pages.map((p) => (
            <NavLink key={p.to} to={p.to} end={p.to === "/"} className="s-link">
              {p.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
