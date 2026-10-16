import { STICKER_H, STICKER_W, markInner } from "@/lib/mark";

const INNER = markInner();
const BARE = markInner(false);

/** Anton's mark, the pixel laptop and matcha (src/lib/mark.ts), as a die-cut sticker or just the art. */
export default function Logo({ className, sticker = true }: { className?: string; sticker?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${STICKER_W} ${STICKER_H}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      dangerouslySetInnerHTML={{ __html: sticker ? INNER : BARE }}
    />
  );
}
