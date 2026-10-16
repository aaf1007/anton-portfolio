import Cube from "@/components/Cube";
import Logo from "@/components/Logo";
import PreviewWindow, { type PreviewItem } from "@/components/PreviewWindow";
import StickerBoard from "@/components/stickers/StickerBoard";
import { hobbies, quests, type QuestTile } from "@/data/portfolio";
import { useRaster } from "@/lib/raster";
import "@/styles/quests.css";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/** Grid-sized copy in /pics/thumbs, falling back to the original when there isn't one. */
const thumbOf = (src: string) => src.replace(/^\/pics\/(.+)\.[^.]+$/, "/pics/thumbs/$1.webp");
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function Thumb({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
  return (
    <img
      src={thumbOf(src)}
      onError={(e) => {
        if (e.currentTarget.src.includes("/thumbs/")) e.currentTarget.src = src;
      }}
      alt=""
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
    />
  );
}

function Dots() {
  return (
    <span className="sq-tile-dots">
      <i className="sq-tile-dot sq-tile-dot--red" />
      <i className="sq-tile-dot" />
      <i className="sq-tile-dot" />
    </span>
  );
}

function Media({ tile }: { tile: QuestTile }) {
  const style = { "--ar": tile.ar } as CSSProperties;
  if (tile.kind === "cube")
    return (
      <span className="sq-tile-media sq-tile-media--cube" style={style}>
        <span className="sq-cube-stage">
          <Cube className="sq-cube" />
        </span>
      </span>
    );
  const cls = [
    "sq-tile-media",
    tile.phone && "sq-tile-media--phone",
    tile.outline && "sq-tile-media--outline",
    tile.kind === "video" && !tile.bleed && !tile.flush && "sq-tile-media--matted",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} style={style}>
      {tile.kind === "video" ? (
        <video src={tile.src} muted loop autoPlay={!reduce()} playsInline preload="metadata" aria-hidden />
      ) : (
        <Thumb src={tile.src} />
      )}
    </span>
  );
}

const placeClass = { wide: "is-wide", "col-1": "is-col-1", "col-2": "is-col-2", "col-3": "is-col-3", "cols-12": "is-wide is-cols-12" };

/** Masonry on a 1px-row grid: each window spans as many rows as it is tall (plus the 16px gap). */
function useMasonry(grid: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const one = matchMedia("(max-width: 768px)");
    let frame = 0;
    const fit = () => {
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
      frame = requestAnimationFrame(fit);
    };
    el.querySelectorAll("img").forEach((img) => img.complete || img.addEventListener("load", schedule, { once: true }));
    el.querySelectorAll("video").forEach((v) => v.addEventListener("loadedmetadata", schedule, { once: true }));
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    one.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      one.removeEventListener("change", schedule);
    };
  }, [grid]);
}

/** A tile opened big, with its gallery (if any) as a strip of thumbnails. */
function TilePreview({ tile, from, onClose }: { tile: QuestTile; from: HTMLElement; onClose: () => void }) {
  const [shown, setShown] = useState(0);
  const items: PreviewItem[] = (tile.gallery ?? [tile.src]).map((src) => ({
    src,
    kind: tile.kind === "video" ? "video" : "image",
    title: tile.file,
    thumb: thumbOf(src),
  }));
  return (
    <PreviewWindow
      items={items}
      index={shown}
      onIndex={setShown}
      from={from}
      onClose={onClose}
      name={tile.name}
      rows={[["Tools", tile.tools]]}
      desc={tile.desc}
      strip
      phone={tile.phone}
      outline={tile.outline}
      square={tile.ar === "1 / 1"}
    />
  );
}

function LogoNote() {
  const title = useRef<HTMLHeadingElement>(null);
  useRaster(title);
  return (
    <div className="sq-note sq-tile-note is-col-3">
      <div className="sq-note-bar" />
      <div className="sq-note-body">
        <h3 ref={title} className="sq-note-title">
          Behind the logo
        </h3>
        <div className="sq-note-content">
          <div className="sq-note-text">
            <p>
              Most of what&rsquo;s on this site got built late at night: laptop open, code on the screen, and a <em>matcha latte</em> within
              reach.
            </p>
            <p>
              So that&rsquo;s the mark. A little pixel laptop mid-build, and the drink that keeps it going, cut out like a sticker you&rsquo;d
              slap on the lid.
            </p>
          </div>
          <Logo className="sq-note-drawing sq-note-mark" />
        </div>
      </div>
    </div>
  );
}

export default function QuestsPage() {
  const grid = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<{ tile: QuestTile; from: HTMLElement } | null>(null);
  useMasonry(grid);
  useRaster(title);
  const close = useCallback(() => setOpen(null), []);

  const last = quests[quests.length - 1];

  const tile = (t: QuestTile) => {
    const cls = [
      "sq-tile",
      ...placeClass[t.place].split(" "),
      t.bleed && "is-bleed",
      t.kind === "cube" && "sq-tile--cube",
    ]
      .filter(Boolean)
      .join(" ");
    const bar = (
      <span className="sq-tile-bar" aria-hidden>
        <Dots />
        <span className="sq-tile-name">{t.file}</span>
      </span>
    );
    // the cube is a toy, not a picture: it plays in place instead of opening
    if (t.kind === "cube")
      return (
        <div key={t.file} className={cls} aria-label={t.name}>
          {bar}
          <Media tile={t} />
        </div>
      );
    return (
      <button
        key={t.file}
        type="button"
        className={`${cls} has-preview`}
        aria-label={t.name}
        onClick={(e) => setOpen({ tile: t, from: e.currentTarget })}
      >
        {bar}
        <Media tile={t} />
      </button>
    );
  };

  return (
    <div className="quests">
      <div className="sq-gallery snap-col">
        <h1 ref={title} className="sq-gallery-title" aria-label="Side quests...">
          Side quests
          <span className="sq-gallery-dots" aria-hidden>
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </h1>
        <p className="sq-gallery-sub">
          Life away from the editor: {hobbies.slice(0, -1).join(", ")} and {hobbies.at(-1)}, plus whatever I&rsquo;m tinkering with
          ٩(ˊᗜˋ*)و
        </p>
        <div ref={grid} className="sq-gallery-grid">
          {quests.slice(0, -1).map(tile)}
          <LogoNote />
          {tile(last)}
        </div>
        <StickerBoard />
      </div>
      {open && <TilePreview tile={open.tile} from={open.from} onClose={close} />}
    </div>
  );
}
