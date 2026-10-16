import PreviewWindow, { type PreviewItem } from "@/components/PreviewWindow";
import { photos, type Photo } from "@/lib/gallery";
import { useRaster } from "@/lib/raster";
import "@/styles/photos.css";
import "@/styles/quests.css";
import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Once the media knows its size, the window takes its natural shape (until then a 4:5 placeholder). */
function fit(e: SyntheticEvent<HTMLImageElement | HTMLVideoElement>) {
  const el = e.currentTarget;
  const w = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth;
  const h = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight;
  if (w && h) el.style.setProperty("--ar", `${w} / ${h}`);
  el.closest(".ph-tile")?.classList.add("is-loaded");
}

/** Masonry on a 1px-row grid: each window spans as many rows as it is tall (plus the 16px gap). */
function useMasonry(grid: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const one = matchMedia("(max-width: 560px)");
    let frame = 0;
    const lay = () => {
      const items = [...el.children] as HTMLElement[];
      items.forEach((it) => (it.style.gridRowEnd = ""));
      if (one.matches) return;
      items.forEach((it) => {
        const h = it.getBoundingClientRect().height;
        if (h > 0) it.style.gridRowEnd = `span ${Math.ceil(h) + 16}`;
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(lay);
    };
    // every picture that arrives (lazily, as you scroll) may change its window's height
    el.addEventListener("load", schedule, true);
    el.addEventListener("loadedmetadata", schedule, true);
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    one.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("load", schedule, true);
      el.removeEventListener("loadedmetadata", schedule, true);
      ro.disconnect();
      one.removeEventListener("change", schedule);
    };
  }, [grid]);
}

function Tile({ photo, onOpen }: { photo: Photo; onOpen: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button type="button" className="sq-tile ph-tile has-preview" aria-label={`Open ${photo.name}`} onClick={onOpen}>
      <span className="sq-tile-bar" aria-hidden>
        <span className="sq-tile-dots">
          <i className="sq-tile-dot sq-tile-dot--red" />
          <i className="sq-tile-dot" />
          <i className="sq-tile-dot" />
        </span>
        <span className="sq-tile-name">{photo.title}</span>
      </span>
      <span className="sq-tile-media ph-media">
        {photo.kind === "video" ? (
          <video src={photo.src} muted loop autoPlay={!reduce()} playsInline preload="metadata" aria-hidden onLoadedMetadata={fit} />
        ) : (
          <img src={photo.src} alt="" loading="lazy" decoding="async" onLoad={fit} />
        )}
      </span>
      {photo.caption && <span className="ph-caption">{photo.caption}</span>}
    </button>
  );
}

export default function PhotosPage() {
  const grid = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<{ index: number; from: HTMLElement } | null>(null);
  useMasonry(grid);
  useRaster(title);
  const close = useCallback(() => setOpen(null), []);
  const items: PreviewItem[] = photos.map((p) => ({ src: p.src, kind: p.kind, title: p.title }));
  const shown = open ? photos[open.index] : null;

  return (
    <div className="quests photos">
      <div className="sq-gallery snap-col">
        <h1 ref={title} className="sq-gallery-title" aria-label="Camera roll...">
          Camera roll
          <span className="sq-gallery-dots" aria-hidden>
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </h1>
        <p className="sq-gallery-sub">Snapshots from life between builds, newest first (◕‿◕)📷</p>
        <div ref={grid} className="ph-grid">
          {photos.map((p, i) => (
            <Tile key={p.file} photo={p} onOpen={(e) => setOpen({ index: i, from: e.currentTarget })} />
          ))}
        </div>
        {photos.length === 0 && <p className="ph-empty">No photos yet: drop some into src/assets/gallery/.</p>}
      </div>
      {open && shown && (
        <PreviewWindow
          items={items}
          index={open.index}
          onIndex={(index) => setOpen((o) => (o ? { ...o, index } : o))}
          from={open.from}
          onClose={close}
          name={shown.name}
          rows={[["Photo", `${open.index + 1} of ${photos.length}`]]}
        />
      )}
    </div>
  );
}
