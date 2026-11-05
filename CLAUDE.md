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

**Routing** — React Router v7, two layout shells declared in `src/App.tsx`:
- `Layout` (`src/Layout.tsx`): the site shell — sticky nav (Home / Projects / Experience / Photos + light/dark toggle), one 800px column between dashed rails, footer.
  - `/` → `HomePage` — banner + avatar + name (roles cycle under it, `RoleCycle`), then About, Contact, the 4 newest Projects, Tech Stack (filter tabs), GitHub Activity
  - `/projects` → `ProjectsPage` — every project card, newest first
  - `/experience` → `ExperiencePage` — Work (`experience`), Education (`education`), Hackathons (projects whose `context` mentions "hack"); rows expand to details
  - `/photos` → `PhotosPage` — masonry of everything in `src/assets/gallery/`; click opens `Lightbox` (←/→, swipe, Esc). See **How to add photos**
  - `/resume` → `ResumePage` — `public/resume.png` with a PDF download (`public/resume.pdf`); regenerate the image with `pdftoppm -png -r 200 -singlefile <source>.pdf frontend/public/resume`
  - `/profile`, `/about` → `/experience`; `/quests`, `/life` → `/photos`; unmatched → `/`
- `ReadingLayout` (`src/ReadingLayout.tsx`): case studies at `/projects/<slug>` (verifai, bscode, careerconnect, myprofessor, tumor-classifier) — plain paper, the laptop-and-matcha mark pinned top-left, no site nav

**Look** — Modelled closely on samworks.vercel.app. Dark by default, light via the nav toggle: the theme is `html[data-theme]`, saved in localStorage and set before first paint by a script in `index.html`. All tokens (`--s-*`, graph `--gh-*`) and styles live in `src/styles/site.css`; dark values on `:root`, light under `:root[data-theme="light"]`. Layout vocabulary: `.s-col` (the railed column), `.s-rule-t`/`.s-rule-b` (dashed rule across the whole viewport), `<Gap />` (the banded strip between sections), `<Section>` (serif heading row + body), `<PageHead>` (← HOME, big title, lede). Sections rise in on load via `.s-in` + `delay(n)` (`src/lib/stagger.ts`). Fonts (Google Fonts, `index.html`): Instrument Serif (headings), Inter (body), Geist Mono (labels). Case studies keep the old paper look: `src/index.css` tokens + `src/styles/shell.css` + `case-study.css`.

**Path alias** — `@/` resolves to `src/` (configured in `vite.config.ts`).

**Site components** (`src/components/site/`) — `Nav`, `Section` (`Section`, `PageHead`, `Gap`), `ProjectCard` (+ `ProjectGrid`: two columns with a banded gutter; image/title link to `caseStudy` → `live` → `github`; status Live/Building/Shipped; `award` shows as a corner ribbon; icon links for case study, live, GitHub), `TechStack`, `GitHubActivity` (ported from SpaceUI's GitHub Activity, MIT: fetches the last year from `github-contributions-api.jogruber.de` for the user in `links.github`), `RoleCycle`, `Lightbox`.

**Content** — All site content lives in `src/data/portfolio.tsx`: `links`, `profile` (name, cycling `roles`, location, `banner`/`avatar` — unset shows a placeholder), `about` (home bullets), `education`, `experience` (newest first), `skills` (each with a `category` for the Tech Stack filter), `projects` and `photoCaptions`. Pages import from it rather than defining content inline.

**Banner and avatar** — put the files in `frontend/public/` and set `profile.banner` (wide, about 1600 × 420) and `profile.avatar` (square) to their root-relative paths.

**Adding a project** — Add an entry to the `projects` array in `src/data/portfolio.tsx`. `ProjectsPage` reverses the array before mapping, so **append to the end** to have it render first. Card images go in `frontend/public/` (web-sized copies live in `public/thumbs/`) and are referenced by root-relative path in `image`; an optional `video` (screen recording) plays over it while the card is hovered (without an `image`, the video's first frame stands in). Required card fields: `context` (shown under the title — "Personal", a course, a hackathon), `shortDescription` (the card's paragraph), `stack` (first four show as tags) and `tint` (ground behind the image); optional `contextIcon`, `award` (corner ribbon). Status is derived: `inProgress` → Building, `live` → Live, else Shipped. Links are optional: `caseStudy`, `live`, `github`; the card links to the first of `caseStudy` → `live` → `github`.

**How to add photos** — Drop the file into `frontend/src/assets/gallery/` (jpg, png, webp, gif, avif, mp4, webm or mov). That's it: `src/lib/gallery.ts` picks up everything in the folder with `import.meta.glob`, in dev (refresh) and in the build. Order: names that start with a date (`2026-10-15-sunset.jpg`) come first, newest first; others follow A→Z; the date is dropped from the title shown. Optional caption: add `"2026-10-15-sunset.jpg": "Sunset at Kits"` to `photoCaptions` in `src/data/portfolio.tsx`. Keep files web-sized (about 1600px on the long side, e.g. `sips -Z 1600 photo.jpg`), since Vite copies them as they are. To remove a photo, delete the file.

**The mark** — Anton's logo is a pixel laptop with code on its screen and a matcha latte, cut out as a die-cut sticker; its pixels and palette live in `src/lib/mark.ts` (one source for everything). `Logo.tsx` draws it (the case studies' top bar), and `public/favicon.svg` is generated from it: after changing the mark run `node scripts/make-favicon.ts` in `frontend/`.

**Case studies** — pages in `src/pages/projects/` are composed from `src/components/case-study/CaseStudy.tsx` (styles in `case-study.css`): a `CaseStudy` wrapper; `Hero` (fixed hero image, left rail with Back and the section links, context line, title, status + tags — looked up from the project by its `caseStudy` path); `Intro` (TL;DR + facts grid); `Section` (label + heading, registers in the rail); `Feature` (numbered step with image), `Beat`/`Card` (bordered cards), `Reflection`, `ImpactList`, `Bridge`; `BackLink` ("thanks for reading" + up next).
