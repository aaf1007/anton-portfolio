import { photoCaptions } from "@/data/portfolio";

/**
 * Everything in src/assets/gallery/ becomes a photo on /photos: drop a file in
 * and it shows up (Vite picks it up at build time and in dev).
 *
 * Order: files whose names start with a date (2026-10-15-sunset.jpg) come
 * first, newest first; the rest follow alphabetically.
 */
const found = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,gif,avif,mp4,webm,mov,JPG,JPEG,PNG,WEBP,GIF,MP4,MOV}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export type Photo = {
  /** the file's name in the folder, e.g. 2026-06-04-udon.jpg (the key for captions) */
  file: string;
  src: string;
  kind: "image" | "video";
  /** the name without its date, for the window's title bar, e.g. udon.jpg */
  title: string;
  /** a readable name: the caption, or the file name tidied up ("udon") */
  name: string;
  caption?: string;
};

const DATED = /^(\d{4}-\d{2}-\d{2})[-_ ]?/;

export const photos: Photo[] = Object.entries(found)
  .map(([path, src]) => {
    const file = path.split("/").pop()!;
    const title = file.replace(DATED, "");
    const caption = photoCaptions[file];
    const bare = title.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    return {
      file,
      src,
      kind: /\.(mp4|webm|mov)$/i.test(file) ? ("video" as const) : ("image" as const),
      title,
      name: caption ?? bare,
      caption,
    };
  })
  .sort((a, b) => {
    const da = DATED.test(a.file);
    const db = DATED.test(b.file);
    if (da !== db) return da ? -1 : 1;
    return da ? b.file.localeCompare(a.file) : a.file.localeCompare(b.file);
  });
