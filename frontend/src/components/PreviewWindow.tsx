import "@/styles/preview.css";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type PreviewItem = { src: string; kind: "image" | "video"; title: string; thumb?: string };

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A picture opened big in a window (quests tiles, photos): the media on the
 * left, its name, a small table and a story on the right. It grows out of the
 * element it was opened from; Esc, the backdrop or the red dot close it.
 * With several items, ← → keys and a swipe step through them, and `strip`
 * adds a row of thumbnails under the picture.
 */
export default function PreviewWindow({
  items,
  index,
  onIndex,
  from,
  onClose,
  name,
  rows = [],
  desc,
  strip = false,
  phone,
  outline,
  square,
}: {
  items: PreviewItem[];
  index: number;
  onIndex: (i: number) => void;
  from: HTMLElement;
  onClose: () => void;
  name: string;
  rows?: [string, ReactNode][];
  desc?: ReactNode;
  strip?: boolean;
  phone?: boolean;
  outline?: boolean;
  square?: boolean;
}) {
  const win = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const item = items[index];
  const isLoaded = loaded === item.src;

  // open: the window grows out of what it came from
  useLayoutEffect(() => {
    const w = win.current!;
    const show = requestAnimationFrame(() => setOpen(true));
    w.focus({ preventScroll: true });
    if (reduce()) return () => cancelAnimationFrame(show);
    const n = from.getBoundingClientRect();
    const s = w.getBoundingClientRect();
    const ow = w.offsetWidth;
    const oh = w.offsetHeight;
    if (!ow || !oh) return () => cancelAnimationFrame(show);
    const k = Math.min(n.width / ow, n.height / oh);
    const left = s.left + s.width / 2 - ow / 2;
    const top = s.top + s.height / 2 - oh / 2;
    w.style.transition = "none";
    w.style.transformOrigin = "0 0";
    w.style.transform = `translate(${n.left + (n.width - ow * k) / 2 - left}px, ${n.top - top}px) scale(${k})`;
    void w.offsetWidth;
    w.style.transition = "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)";
    w.style.transform = "";
    const t = window.setTimeout(() => {
      w.style.transition = "";
      w.style.transformOrigin = "";
    }, 400);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(t);
    };
  }, [from]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(onClose, 250);
  }, [onClose]);

  const step = useCallback(
    (d: number) => {
      const i = index + d;
      if (i >= 0 && i < items.length) onIndex(i);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        const els = [...(win.current?.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])") ?? [])];
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [close, step]);

  // hand focus back to the opener when the window goes
  useEffect(() => () => from.focus({ preventScroll: true }), [from]);

  const touchX = useRef(0);

  const imgCls = ["sq-info-img", isLoaded && "is-loaded", phone && "sq-info-img--phone", outline && "sq-info-img--outline", square && "sq-info-img--square"]
    .filter(Boolean)
    .join(" ");

  // page-level, like the dock: above everything, and never inside a transformed ancestor
  return createPortal(
    <div className={open ? "sq-overlay is-open" : "sq-overlay"} onClick={(e) => e.target === e.currentTarget && close()}>
      <div ref={win} className="sq-window sq-window--info" role="dialog" aria-modal="true" aria-label={name} tabIndex={-1}>
        <div className="sq-chrome">
          <span
            className="sq-dot sq-dot--red sq-dot--close"
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={close}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                close();
              }
            }}
          />
          <span className="sq-dot sq-dot--inactive" />
          <span className="sq-dot sq-dot--inactive" />
          <span className="sq-window-title">{item.title}</span>
        </div>
        <div className="sq-window-body sq-window-body--info">
          <div
            className="sq-info-img-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) >= 50) step(dx < 0 ? 1 : -1);
            }}
          >
            <div className={imgCls}>
              {item.kind === "video" ? (
                <video
                  key={item.src}
                  src={item.src}
                  className="sq-preview-img"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ opacity: isLoaded ? 1 : 0 }}
                  onLoadedData={() => setLoaded(item.src)}
                />
              ) : (
                <img
                  key={item.src}
                  src={item.src}
                  alt={item.title}
                  className="sq-preview-img"
                  style={{ opacity: isLoaded ? 1 : 0 }}
                  onLoad={() => setLoaded(item.src)}
                />
              )}
            </div>
            {strip && items.length > 1 && (
              <div className="sq-gallery-strip">
                {items.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    aria-label={`Photo ${i + 1} of ${items.length}`}
                    className={i === index ? "sq-gallery-thumb shimmer-frame active" : "sq-gallery-thumb shimmer-frame"}
                    onClick={() => onIndex(i)}
                  >
                    <img
                      src={p.thumb ?? p.src}
                      onError={(e) => {
                        if (p.thumb && !e.currentTarget.src.endsWith(p.src)) e.currentTarget.src = p.src;
                      }}
                      onLoad={(e) => e.currentTarget.parentElement?.classList.add("is-loaded")}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="sq-info-panel">
            <h3 className="sq-info-name">{name}</h3>
            {rows.length > 0 && (
              <div className="sq-info-table">
                {rows.map(([label, value]) => (
                  <div key={label} className="sq-info-row">
                    <span className="sq-info-label">{label}</span>
                    <span className="sq-info-value">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {desc && <div className="sq-info-desc">{desc}</div>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
