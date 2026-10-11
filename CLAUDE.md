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
- `/` → `HomePage` — wordmark, ASCII portrait, tldr/today/yesterday blocks, selected work, toolbox, `#contact`
- `/projects` → `ProjectsPage` ("work" in the nav) — full project index, newest first
- `/projects/<slug>` → per-project case-study pages in `src/pages/projects/` (verifai, bscode, careerconnect, myprofessor, tumor-classifier)
- `/life` → `LifePage` — halftone photo grid with a lightbox
- `/resume` → `ResumePage` — resume image (`public/resume.png`) with a PDF download (`public/resume.pdf`); regenerate the image from the PDF with `pdftoppm -png -r 200 -singlefile <source>.pdf frontend/public/resume`
- `/contact` redirects to `/#contact`; unmatched paths redirect to `/`

**Theme** — Custom `ThemeContext` (`src/context/ThemeContext.tsx`) persists `light`/`dark` to `localStorage` and toggles a `.dark` class on `<html>`. Dark is the default (also set pre-paint by the inline script in `index.html`). Dark-mode styles are written in `src/index.css` using `@custom-variant dark (&:where(.dark, .dark *))`.

**CSS** — Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Design tokens are CSS custom properties in `src/index.css` under `:root` and `html.dark`. The `@theme inline` block maps them to Tailwind color/font utilities (`signal` is the blue accent, `rule` the hairline colour, `faint` the dimmest text). Body text is Commit Mono; `.display` (page titles) and `.heading` use Archivo at an expanded width. `--dot` / `--dot-max` set the colour and peak opacity of the dither canvases.

**Path alias** — `@/` resolves to `src/` (configured in `vite.config.ts`).

**Content** — All site content lives in `src/data/portfolio.tsx`: `projects`, `skills`, `coursework`, `hobbies`, `learning`, `digesting`, and `lifePhotos`. Pages import from it rather than defining content inline.

**Adding a project** — Add an entry to the `projects` array in `src/data/portfolio.tsx`. `ProjectsPage` reverses the array before mapping, so **append to the end** to have it render first. Images go in `frontend/public/` and are referenced by root-relative path (e.g. `/statify.png`); `image` also accepts a ReactNode for video. Set `inProgress: true` for an "in progress" marker under the title (it also lists the project as "building" on the home page). Links are optional and each renders as a small link only when set: `caseStudy` (a case-study route, see Routing; shown as "case study"), `live` (deployed site or store listing), `github` ("code"). The row title links to the first of `caseStudy` → `live` → `github`; `image` is the hover preview (desktop) and inline thumbnail (mobile). `ProjectList` is shared by `HomePage` (latest five) and `ProjectsPage`.

**Case studies** — pages in `src/pages/projects/` are composed from `src/components/case-study/CaseStudy.tsx`; `Hero` takes the project's `title` and renders it as the page wordmark.

**UI components** — The shell is `DitherField` (animated dot background that reacts to the cursor and clicks), `PageWipe` (dithered sweep on route change), `NavBar` (bottom segmented nav; keys 1–5 navigate, `t` toggles theme) and `SiteFooter`. `Typography.tsx` has `PageTitle`, `Label` (scrambling section label over a rule) and `Reveal`. `ascii/AsciiImage` draws an image as ASCII glyphs with a hover lens onto the real photo. shadcn/ui components live in `src/components/ui/`.
