import { PageTitle, Reveal } from "@/components/Typography";
import { hobbies, lifePhotos } from "@/data/portfolio";
import { EASE_OUT } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  const btn =
    "rounded-md px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${lifePhotos.length}`}
      className="fixed inset-0 z-50 flex flex-col bg-background/92 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-12" onClick={(e) => e.stopPropagation()}>
        <span className="text-[12px] text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(lifePhotos.length).padStart(2, "0")}
        </span>
        <div className="flex gap-1">
          <button type="button" className={btn} onClick={() => onStep(-1)} aria-label="Previous photo">
            ← prev
          </button>
          <button type="button" className={btn} onClick={() => onStep(1)} aria-label="Next photo">
            next →
          </button>
          <button ref={closeRef} type="button" className={btn} onClick={onClose}>
            close ✕
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 pb-10 sm:px-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={lifePhotos[index]}
            src={lifePhotos[index]}
            alt=""
            className="max-h-full max-w-full rounded-[6px] object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LifePage() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + lifePhotos.length) % lifePhotos.length)),
    [],
  );

  return (
    <div className="flex flex-col gap-14">
      <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
        <PageTitle className="lg:col-span-2" aside={<span className="tabular-nums">({lifePhotos.length})</span>}>
          life
        </PageTitle>
        <Reveal delay={0.3}>
          <p className="max-w-[44ch] text-muted-foreground">
            Away from the editor: {hobbies.slice(0, -1).join(", ")} and {hobbies.at(-1)}. Hover a
            photo to develop it, click to open.
          </p>
        </Reveal>
      </div>

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
        {lifePhotos.map((src, i) => (
          <Reveal as="li" key={src} delay={(i % 4) * 0.06} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="halftone block w-full overflow-hidden rounded-[6px] border border-rule bg-muted"
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="h-auto w-full hover:scale-[1.02]" />
            </button>
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
      </AnimatePresence>
    </div>
  );
}
