# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root (the root `package.json` forwards to `frontend/`) or from `frontend/` directly:

```bash
npm run dev       # dev server at http://localhost:4000
npm run build     # tsc type-check + vite build → dist/
npm run lint      # eslint
npm run preview   # preview production build
```

## Architecture

Single-page React app (React 19, TypeScript, Vite, Tailwind CSS v4) deployed to Vercel. No backend.

**Routing** — React Router v7 with a single `Layout` shell (`src/Layout.tsx`) wrapping all pages via `<Outlet>`. Routes are declared in `src/App.tsx`:
- `/` → `HomePage` — one-screen poster: "hey there, I build for [tamagotchi] curiosity." around Anton's tamagotchi; `/?tama` opens the tamagotchi expanded
- `/projects` → `ProjectsPage` ("works" in the dock) — project cards only, newest first; arriving from another page they stack into a deck mid-screen and deal out (wide screens)
- `/projects/<slug>` → per-project case-study pages in `src/pages/projects/` (verifai, bscode, careerconnect, myprofessor, tumor-classifier)
- `/quests` → `QuestsPage` — "Side quests...": a masonry of little windows (tiles from `quests` in the data file, incl. the interactive cube), a "Behind the logo" note, then the `StickerBoard`; a tile opens bigger in a preview window
- `/photos` → `PhotosPage` — "Camera roll...": every image/video in `src/assets/gallery/` as a masonry of windows at its natural shape; click to open big (←/→ or swipe to step, Esc to close). See **How to add photos**
- `/profile` → `ProfilePage` — two paper-clipped prints (hover swings one to the front), "About me", two .txt facts
- `/resume` → `ResumePage` — resume image (`public/resume.png`) with a PDF download (`public/resume.pdf`); regenerate the image from the PDF with `pdftoppm -png -r 200 -singlefile <source>.pdf frontend/public/resume`
- `/life`, `/about` and `/contact` redirect to `/quests` / `/profile`; unmatched paths redirect to `/`

**Look** — Modelled closely on cindyly.design. Light only. The ground (`Ground.tsx`): grey `--ombre-from` on `body`, two blurred near-white sheets on `body::before/::after`, a still film-grain canvas (overlay blend) and a 24px grid canvas from the viewport origin, faded out at the edges. Fonts load from Google Fonts in `index.html`: DM Sans (body), DM Mono (labels), Inter (dock labels), Newsreader italic (`--font-serif`, standing in for Editorial New). Big serif headings are pixelated: `useRaster` (`src/lib/raster.ts`) for headings, the `#pixelate-display` SVG filter (in `Filters.tsx`) for "curiosity." — desktop only (>1200px), not in Safari. Tokens are CSS custom properties on `:root` in `src/index.css` (`--color-*`, named as on the reference). Shared classes there: `.badge` (+ `.badge--award`, `.status-dot`), `.handle` (blue inline link), `.txt-card`.

**CSS** — Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`), but most styling is plain CSS mirroring the reference's values: `src/styles/shell.css` (nav, dock, colophon, transitions, grid snapping), `works.css`, `quests.css`, `photos.css`, `preview.css` (the opened-picture window), `profile.css`, `resume.css`, plus component CSS next to `Cube`, the tamagotchi, the sticker board and the case-study components.

**Path alias** — `@/` resolves to `src/` (configured in `vite.config.ts`).

**Shell behaviour** (`Layout.tsx`, `src/lib/go.ts`) — Move between pages with `go(to)` (the dock, the logo and internal links use it): home → works flings the hero up before works deals in; works → home drops the cards while home scrolls back down. Wheel down on home opens works; wheel up at the top of works goes home. Works, quests and photos snap their column to the background grid above 1200px (`--snap-w`, `--snap-left`; the dock shifts by `--works-grid-shift`). `html` gets `reading` on case studies (plain paper, no ground, no dock), `welcome-played` once any other page is seen (home's load-in doesn't replay), `fonts-ready` when fonts load. The colophon ("last updated") is fixed bottom-right, except at the end of works, quests and photos (plus the credit on quests); hidden below 768px.

**Content** — All site content lives in `src/data/portfolio.tsx`: `links`, `projects`, `experience` (newest first), `skills`, `coursework`, `hobbies`, `learning`, `digesting`, `lifePhotos`, `quests` and `photoCaptions`. Pages import from it rather than defining content inline.

**Adding a project** — Add an entry to the `projects` array in `src/data/portfolio.tsx`. `ProjectsPage` reverses the array before mapping, so **append to the end** to have it render first. Card images go in `frontend/public/` (web-sized copies live in `public/thumbs/`) and are referenced by root-relative path in `image`; an optional `video` (screen recording) plays over it while the card is hovered (without an `image`, the video's first frame stands in). Required card fields: `context` (where it was made — "Personal", a course, a hackathon) and `tint` (ground behind the image); optional `contextIcon`, `award` (🏆 badge). Status badge is derived: `inProgress` → Building, `award`, `live` → Live, else Shipped. Links are optional: `caseStudy`, `live`, `github`; the card links to the first of `caseStudy` → `live` → `github`.

**Quests tiles** — each entry in `quests` is a window: `file` (title bar), `name`/`tools`/`desc` (shown when opened), `kind` (image, video or the cube), `src`, `ar` (media width / height), `place` (`col-1|2|3` pins a column, `wide`/`cols-12` span two), and display flags `bleed`, `phone`, `outline`, `flush`; `gallery` adds photos to flick through in the opened window. Every life photo should appear in a tile or a gallery.

**Life photos** — add `{ src, name }` to the top of `lifePhotos`, then put it in a `quests` tile or gallery. Tiles load `/pics/thumbs/<file>.webp` and fall back to the original if no thumbnail exists.

**How to add photos** — Drop the file into `frontend/src/assets/gallery/` (jpg, png, webp, gif, avif, mp4, webm or mov). That's it: `src/lib/gallery.ts` picks up everything in the folder with `import.meta.glob`, in dev (refresh) and in the build. Order: names that start with a date (`2026-10-15-sunset.jpg`) come first, newest first; others follow A→Z; the date is dropped from the title shown. Optional caption: add `"2026-10-15-sunset.jpg": "Sunset at Kits"` to `photoCaptions` in `src/data/portfolio.tsx`. Keep files web-sized (about 1600px on the long side, e.g. `sips -Z 1600 photo.jpg`), since Vite copies them as they are. To remove a photo, delete the file.

**The mark** — Anton's logo is a pixel laptop with code on its screen and a matcha latte, cut out as a die-cut sticker; its pixels and palette live in `src/lib/mark.ts` (one source for everything). `Logo.tsx` draws it (nav, the quests note), the tamagotchi's keychain carries a mini one, and `public/favicon.svg` is generated from it: after changing the mark run `node scripts/make-favicon.ts` in `frontend/`.

**Case studies** — pages in `src/pages/projects/` are composed from `src/components/case-study/CaseStudy.tsx` (styles in `case-study.css`): a `CaseStudy` wrapper; `Hero` (fixed hero image, left rail with Back and the section links, context line, title, status + tags — looked up from the project by its `caseStudy` path); `Intro` (TL;DR + facts grid); `Section` (label + heading, registers in the rail); `Feature` (numbered step with image), `Beat`/`Card` (bordered cards), `Reflection`, `ImpactList`, `Bridge`; `BackLink` ("thanks for reading" + up next).

**UI components** — `TopBar` (the laptop-and-matcha mark + name, LinkedIn/GitHub/Resume; just the mark, pinned, on case studies), `Dock` (liquid-glass dock: works/quests/photos/profile, icons in `DockIcons.tsx`; the works folder opens while works is showing and hops on a first visit until works is opened; a mobile dock with a links popup below 768px), `Ground`, `Filters` (page-wide SVG filters: pixelate, the dock's glass lens, the sticker die-cut), `Cube` (CSS-3D Rubik's cube on quests, Anton's solver side quest: drag to spin, tap to twist, scramble/solve), `PreviewWindow` (a quests tile or photo opened big, grown out of its tile), `Logo`, `ProjectCard` (+ `Status` badge), `tamagotchi/` (the home hero — `Tamagotchi.tsx` + `Device.tsx` (SVG shell) + `sim.ts` (canvas tank) + `home.css`/`tamagotchi.css`: Anton's own tamagotchi with Nigiri, a pixel koi (sprite in `src/lib/pet-sprite.ts`, shared with the stickers), in a 128px canvas tank — FEED / PLAY (a left-or-right guessing game) / SLEEP keys, mood and fullness over time, night mode, tap the glass; state kept in localStorage; expands to the centre of the screen at `/?tama`; on its keychain, as on the reference, his name as a polished-silver word charm ("anton") plus a mini laptop-and-matcha charm; a matcha glass in the sand), `stickers/StickerBoard` (the quests sign-off: a sticker sheet to peel from, a lined to-do note, a photo; placements and ticks kept in localStorage). Sounds are synthesized in `src/lib/sfx.ts` (tamagotchi keys, the profile prints, a sticker peeling off).
