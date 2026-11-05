import { photos } from "@/lib/gallery";
import { useState } from "react";
import Lightbox from "./Lightbox";

const SHOWN = 6;

/** The newest few photos as square tiles; one opens the lightbox over the whole roll. */
export default function HomePhotos() {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return <p className="s-empty">No photos yet.</p>;
  return (
    <>
      <div className="s-strip">
        {photos.slice(0, SHOWN).map((p, i) => (
          <button key={p.file} type="button" className="s-strip-tile" aria-label={`Open ${p.name}`} onClick={() => setOpen(i)}>
            {p.kind === "video" ? (
              <video src={`${p.src}#t=0.1`} muted playsInline preload="metadata" aria-hidden />
            ) : (
              <img src={p.src} alt="" loading="lazy" decoding="async" />
            )}
          </button>
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
