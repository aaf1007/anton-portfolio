import DitherField from "@/components/DitherField";
import NavBar from "@/components/NavBar";
import PageWipe from "@/components/PageWipe";
import SiteFooter from "@/components/SiteFooter";
import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useOutlet } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="relative flex min-h-dvh flex-col">
      <DitherField />
      <PageWipe />
      <a
        href="#main"
        className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-signal px-3 py-2 text-signal-foreground focus:translate-y-0"
      >
        skip to content
      </a>

      <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-10 pb-28 sm:px-12 sm:pt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, ease: EASE_OUT, delay: 0.05 } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
      <NavBar />
    </div>
  );
}
