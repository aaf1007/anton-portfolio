import type { Photo } from "@/lib/gallery";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** A photo opened big: ←/→ or swipe to step, Esc or a click outside to close. */
export default function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const n = photos.length;
  const step = (d: number) => onIndex((index + d + n) % n);
  const photo = photos[index];

  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    box.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      back?.focus();
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  };

  return createPortal(
    <div
      ref={box}
      className="site s-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.name}
      tabIndex={-1}
      onKeyDown={onKey}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("s-lightbox-stage")) onClose();
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="s-lightbox-bar">
        <span>
          {index + 1} / {n}
        </span>
        <button type="button" className="s-icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <div className="s-lightbox-stage">
        {photo.kind === "video" ? (
          <video key={photo.src} src={photo.src} controls autoPlay playsInline />
        ) : (
          <img key={photo.src} src={photo.src} alt={photo.caption ?? photo.name} />
        )}
        {n > 1 && (
          <>
            <button type="button" className="s-lightbox-nav s-lightbox-nav--prev" onClick={() => step(-1)} aria-label="Previous photo">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="s-lightbox-nav s-lightbox-nav--next" onClick={() => step(1)} aria-label="Next photo">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <p className="s-lightbox-cap">{photo.caption ?? ""}</p>
    </div>,
    document.body,
  );
}
