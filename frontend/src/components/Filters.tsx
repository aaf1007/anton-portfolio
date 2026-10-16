/** Page-wide SVG filters: the pixel grid for big serif type, the dock's glass lens, the die-cut sticker edge. */

// a displacement map: red ramps across x and green across y only near the edges, so the
// backdrop bends at the rim like thick glass and stays true in the middle
const LENS_MAP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'><defs>` +
      `<linearGradient id='r' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='rgb(0,128,0)'/><stop offset='0.18' stop-color='rgb(128,128,0)'/><stop offset='0.82' stop-color='rgb(128,128,0)'/><stop offset='1' stop-color='rgb(255,128,0)'/></linearGradient>` +
      `<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='rgb(128,0,0)'/><stop offset='0.3' stop-color='rgb(128,128,0)'/><stop offset='0.7' stop-color='rgb(128,128,0)'/><stop offset='1' stop-color='rgb(128,255,0)'/></linearGradient>` +
      `</defs><rect width='200' height='80' fill='url(%23r)'/><rect width='200' height='80' fill='url(%23g)' style='mix-blend-mode:multiply'/></svg>`,
  );

/** Sample the source on a tile-sized dot grid, then grow each dot back into a square. */
function Pixelate({ id, tile, dilate, erode }: { id: string; tile: number; dilate: number; erode?: number }) {
  return (
    <filter id={id}>
      {erode ? <feMorphology in="SourceGraphic" operator="erode" radius={erode} result="slim" /> : null}
      <feFlood x="1" y="1" width="1" height="1" />
      <feComposite width={tile} height={tile} />
      <feTile result="dots" />
      <feComposite in={erode ? "slim" : "SourceGraphic"} in2="dots" operator="in" />
      <feMorphology operator="dilate" radius={dilate} />
    </filter>
  );
}

export default function Filters() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <Pixelate id="pixelate-label" tile={2} dilate={0.425} />
        <Pixelate id="pixelate-label-2k" tile={2} dilate={0.6} />
        <Pixelate id="pixelate-display" tile={2.5} dilate={0.9} erode={0.45} />
        <filter id="liquid-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage preserveAspectRatio="none" result="map" href={LENS_MAP} />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="28" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* the sticker cut: a white ring and a thin grey edge grown from the art's alpha */}
        <filter id="sticker-outline" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology operator="dilate" radius="5" in="SourceAlpha" result="dw" />
          <feMorphology operator="dilate" radius="6" in="SourceAlpha" result="dg" />
          <feComposite in="dw" in2="SourceAlpha" operator="out" result="wr" />
          <feComposite in="dg" in2="dw" operator="out" result="gr" />
          <feFlood floodColor="#ffffff" result="wc" />
          <feComposite in="wc" in2="wr" operator="in" result="wf" />
          <feFlood floodColor="#e4e1de" floodOpacity="0.9" result="gc" />
          <feComposite in="gc" in2="gr" operator="in" result="gf" />
          <feMerge>
            <feMergeNode in="gf" />
            <feMergeNode in="wf" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* half a px of grey just inside the edge, for a sticker's white back */}
        <filter id="sticker-hairline" colorInterpolationFilters="sRGB" x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology operator="erode" radius="0.5" in="SourceAlpha" result="inner" />
          <feComposite in="SourceAlpha" in2="inner" operator="out" result="rim" />
          <feFlood floodColor="#b9b4ae" floodOpacity="0.85" result="rc" />
          <feComposite in="rc" in2="rim" operator="in" result="rf" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="rf" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
