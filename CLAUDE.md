# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `frontend/`:

```bash
npm run dev       # dev server at http://localhost:4000
npm run build     # tsc type-check + vite build → dist/
npm run lint      # eslint
npm run preview   # preview production build
```

## Architecture

Single-page React app (React 19, TypeScript, Vite, Tailwind CSS v4) deployed to Vercel. No backend.

**Routing** — React Router v7 with a single `Layout` shell (`src/Layout.tsx`) wrapping all pages via `<Outlet>`. Routes are declared in `src/App.tsx`:
- `/` → `HomePage` — bio, currently-section, tech stack carousel
- `/projects` → `ProjectsPage` — project list rendered in reverse order
- `/projects/<slug>` → per-project case-study pages in `src/pages/projects/` (verifai, bscode, careerconnect, myprofessor, tumor-classifier)
- `/life` → `LifePage` — photo cards
- `/contact` redirects to `/#contact`; unmatched paths redirect to `/`

**Theme** — Custom `ThemeContext` (`src/context/ThemeContext.tsx`) persists `light`/`dark` to `localStorage` and toggles a `.dark` class on `<html>`. Dark-mode styles are written in `src/index.css` using `@custom-variant dark (&:where(.dark, .dark *))`.

**CSS** — Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js`). Design tokens are CSS custom properties in `src/index.css` under `:root` and `html.dark`. The `@theme inline` block maps them to Tailwind color/font utilities. Font is Geist Variable.

**Path alias** — `@/` resolves to `src/` (configured in `vite.config.ts`).

**Content** — All site content lives in `src/data/portfolio.tsx`: `projects`, `skills`, `coursework`, `hobbies`, `learning`, `digesting`, and `lifePhotos`. Pages import from it rather than defining content inline.

**Adding a project** — Add an entry to the `projects` array in `src/data/portfolio.tsx`. `ProjectsPage` reverses the array before mapping, so **append to the end** to have it render first. Images go in `frontend/public/` and are referenced by root-relative path (e.g. `/statify.png`); `image` also accepts a ReactNode for video. Set `inProgress: true` for an "In Progress" badge — note it only renders on top of a card image (`ProjectCard.tsx`). The optional `caseStudy` field points at a case-study route (see Routing).

**UI components** — shadcn/ui components live in `src/components/ui/`. Shared layout pieces (`Footer`, `ThemeToggle`, `TechStack`, `ProjectCard`, etc.) live in `src/components/`.
