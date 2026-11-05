import Lightbox from "@/components/site/Lightbox";
import { Gap, PageHead } from "@/components/site/Section";
import { delay } from "@/lib/stagger";
import { photos } from "@/lib/gallery";
import { useState } from "react";

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PhotosPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PageHead title="Photos" lede="Snapshots from life between builds: food, friends, and the places I code from. Newest first." />
      <Gap />
      <div className="s-in" style={delay(2)}>
        {photos.length > 0 ? (
          <div className="s-photos">
            {photos.map((p, i) => (
              <button key={p.file} type="button" className="s-photo" aria-label={`Open ${p.name}`} onClick={() => setOpen(i)}>
                {p.kind === "video" ? (
                  <video src={p.src} muted loop autoPlay={!reduce()} playsInline preload="metadata" aria-hidden />
                ) : (
                  <img src={p.src} alt="" loading="lazy" decoding="async" />
                )}
                {p.caption && <span className="s-photo-cap">{p.caption}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className="s-empty">No photos yet: drop some into src/assets/gallery/.</p>
        )}
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
