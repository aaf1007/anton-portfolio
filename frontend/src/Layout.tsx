import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";
import SideBar from "./components/SideBar";
import ThemeToggle from "./components/ThemeToggle";
import PageTree from "./components/PageTree";

/**
 * URL path → page key. Tells Layout which "page" we're on so you can use currentPageKey
 * (e.g. for PageTree, sidebar highlight). The actual component for each path is defined in App.tsx.
 */
const PATH_TO_PAGE_KEY: Record<string, string> = {
  "/": "home",           // HomePage.tsx
  "/projects": "projects", // ProjectsPage.tsx
};

export default function Layout() {
  const location = useLocation();
  const currentPageKey = PATH_TO_PAGE_KEY[location.pathname] ?? "home";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <div id="home" className="grid grid-cols-1 md:grid-cols-[260px_1fr] w-full min-h-screen antialiased scroll-smooth pt-[3vh] md:pt-0">
      {/* Mobile header: visible only on small screens */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-background-eggshell/95 backdrop-blur border-b border-primary/10">
        <Link to="/#home" className="font-extrabold text-[1.2rem] text-primary hover:text-accent-light">anton florendo</Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button type="button" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)} className="p-2 text-primary hover:text-accent-light">
            <HiMenu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="backdrop"
            className="md:hidden fixed inset-0 z-30 bg-black/30"
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {mobileMenuOpen && (
          <motion.aside
            key="drawer"
            className="md:hidden fixed top-0 right-0 bottom-0 z-40 w-[min(280px,85vw)] bg-background-eggshell border-l border-primary/20 shadow-xl overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex justify-end p-4">
              <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="p-2 text-primary hover:text-accent-light">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="px-6 pb-8">
              <SideBar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar: hidden on mobile */}
      <div className="hidden md:block col-start-1 col-span-1 h-full pt-[10vh] fixed w-[260px]">
        <SideBar />
      </div>

      <main className="col-start-1 md:col-start-2 col-span-1 pt-[56px] md:pt-[10vh] px-4 md:px-6 md:pr-[5vw] md:pl-[5vw] md:border-l border-primary/20">
        <PageTree page={currentPageKey} />
        <Outlet />
      </main>
    </div>
  );
}
