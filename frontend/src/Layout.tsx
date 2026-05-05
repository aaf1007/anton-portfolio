import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { FaGithubAlt, FaLinkedinIn } from "react-icons/fa";
import { Link, useLocation, useOutlet } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

const navItems = [
  { to: "/", label: "home" },
  { to: "/projects", label: "projects" },
  { to: "/life", label: "life" },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="px-4 py-10 md:py-20 min-h-screen">
      <header className="max-w-[740px] mx-auto flex items-center justify-between mb-14">
        <nav className="flex items-center gap-5 text-md text-foreground/70">
          {navItems.map(({ to, label }) => {
            const active = isActive(location.pathname, to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={`relative hover:text-foreground transition-colors ${
                  active ? "text-foreground" : ""
                }`}
              >
                {label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-px bg-foreground"
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  />
                )}
              </Link>
            );
          })}
        </nav>



        {/* Social icons + theme toggle — right side */}
        <div className="flex items-center gap-3 text-foreground/60">
          <a
            href="https://github.com/aaf1007"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-foreground transition-colors"
          >
            <FaGithubAlt className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/antonflorendo/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors"
          >
            <FaLinkedinIn className="w-4 h-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
