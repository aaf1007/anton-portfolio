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

**Routing** — React Router v7, routes declared in `src/App.tsx`, every page inside `Layout` (`src/Layout.tsx`): the site shell — sticky nav (Home / Projects / Experience / Photos + light/dark toggle), one 800px column between dashed rails, footer.
  - `/` → `HomePage` — banner + avatar + name (roles cycle under it, `RoleCycle`), then About, Contact, Experience in brief (`HomeExperience`: work + education, one line each), the 4 newest Projects, the 6 newest Photos (`HomePhotos`, opens the lightbox), Tech Stack (filter tabs), GitHub Activity
  - `/projects` → `ProjectsPage` — every project card, newest first
  - `/projects/<slug>` → case studies in `src/pages/projects/` (verifai, bscode, careerconnect, myprofessor, tumor-classifier). See **Case studies** — pages in `src/pages/projects/` are composed from `src/components/case-study/CaseStudy.tsx` (styles in `case-study.css`, on the site's `--s-*` tokens), inside the normal site shell: a `CaseStudy` wrapper (images with `.cs-expandable` open in a lightbox); `Hero` (← Projects, the hero image, then context + dates, the serif title, status/award + tags and live/GitHub links — looked up from the project by its `caseStudy` path; also mounts the "On this page" rail in the left margin, ≥1240px); `Intro` (TL;DR + a dashed facts grid); `Section` (serif heading row, registers in the rail; optional question-style `heading`); `Feature` (numbered step with image), `Beat`/`Card` (bordered cards), `Bridge`, `Reflection`, `ImpactList`; `BackLink` ("Thanks for reading." + the next two case studies as project cards).
