import { AnimatePresence, motion } from "motion/react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 text-primary hover:text-accent-light overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <IconMoon className="w-5 h-5" /> : <IconSun className="w-5 h-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
