import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { FaGithubAlt, FaLinkedinIn } from "react-icons/fa";
import { Home, Images, Mail, PanelsTopLeft } from "lucide-react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";
import type { IconType } from "react-icons";
import type { ComponentType, ReactNode } from "react";

const navItems: Array<{
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }> | IconType;
}> = [
  { to: "/#home", label: "Home", icon: Home },
  { to: "/#projects", label: "Projects", icon: PanelsTopLeft },
  { to: "/life", label: "Life", icon: Images },
  { to: "/#contact", label: "Contact", icon: Mail },
];

function DockButton({
  children,
  label,
  active,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.span
      className={`relative flex size-10 items-center justify-center rounded-3xl border border-border bg-background text-muted-foreground backdrop-blur-3xl transition-colors hover:bg-muted hover:text-foreground ${
        active ? "text-foreground" : ""
      }`}
      whileHover={{ y: -8, scale: 1.18 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      title={label}
    >
      {children}
    </motion.span>
  );
}

function isActive(pathname: string, to: string) {
  if (to.startsWith("/#")) return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 md:py-20">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[size:6px_6px] opacity-80 [mask-image:linear-gradient(to_bottom,black,transparent)] dark:opacity-35"
        aria-hidden
      />
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

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
        <nav
          aria-label="Primary"
          className="pointer-events-auto relative mx-auto flex h-14 w-fit items-center gap-2 rounded-full border bg-card/90 p-2 shadow-[0_0_10px_3px] shadow-primary/5 backdrop-blur-3xl"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} aria-label={label}>
              <DockButton label={label} active={isActive(location.pathname, to)}>
                <Icon className="size-5" />
              </DockButton>
            </Link>
          ))}

          <div className="mx-1 h-8 w-px bg-border" aria-hidden />

          <a
            href="https://github.com/aaf1007"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <DockButton label="GitHub">
              <FaGithubAlt className="size-5" />
            </DockButton>
          </a>
          <a
            href="https://www.linkedin.com/in/antonflorendo/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <DockButton label="LinkedIn">
              <FaLinkedinIn className="size-5" />
            </DockButton>
          </a>

          <div className="mx-1 h-8 w-px bg-border" aria-hidden />

          <DockButton label="Theme">
            <ThemeToggle className="size-full" />
          </DockButton>
        </nav>
      </div>
    </div>
  );
}
