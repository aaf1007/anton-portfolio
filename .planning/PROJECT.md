# Portfolio 2026

## What This Is

A personal developer portfolio built as a React 19 SPA deployed on Vercel. It showcases projects and skills through a warm earthy design with a fixed sidebar navigation, responsive mobile drawer, and static page content. No backend — fully client-side.

## Core Value

Visitors can quickly understand who I am, see my work, and get in touch — across any device and in their preferred color scheme.

## Requirements

### Validated

- ✓ Multi-page SPA routing (Home, Projects) — existing
- ✓ Responsive layout with fixed sidebar (desktop) and animated mobile drawer — existing
- ✓ Projects showcase with ProjectCard components — existing
- ✓ Tech stack section on Home page — existing
- ✓ Contact section with hash-scroll navigation — existing
- ✓ Deployed to Vercel with SPA rewrite rule — existing

### Active

- [ ] Dark mode with user toggle (sun/moon icon, sidebar + mobile header)
- [ ] Theme persisted via localStorage with OS preference fallback
- [ ] No flash of wrong theme on page load (FOUC prevention)
- [ ] Warm dark color palette complementing the existing earthy light theme
- [ ] Smooth 200-300ms color transition on toggle
- [ ] Scrollbar styled to match active theme
- [ ] Focus ring updated for dark mode visibility

### Out of Scope

- Multiple theme options (just light/dark) — not needed for portfolio
- Theme customizer or color picker — over-engineered for this use case
- Backend/API changes — static site, no server

## Context

- **Stack:** React 19 + Vite 7, Tailwind CSS v4 (CSS-first config via `@theme inline`), TypeScript, Framer Motion
- **Styling approach:** All colors defined as CSS custom properties in `frontend/src/index.css` under `:root`. Components use Tailwind classes like `bg-background`, `text-foreground`, `text-accent-light` — they reference vars, not hardcoded values.
- **One hardcoded color bug:** `.cursor-blink` in `index.css` uses `background-color: #5d4037` instead of `var(--primary)` — to be fixed as part of dark mode work.
- **No existing theme system:** No context, no `dark:` variants, no `prefers-color-scheme` handling currently.
- **Toggle UI decisions (from design interview):**
  - Placement: bottom of desktop sidebar + mobile header bar
  - Icon: Tabler `TbSun` / `TbMoon`, icon-only, rotate+fade animation via Framer Motion
  - State: React Context + `useTheme()` hook
  - Inline `<script>` in `index.html` to prevent FOUC

## Constraints

- **Tech stack:** Must use existing Tailwind v4 CSS-variable approach — no switching to CSS-in-JS or new styling libraries
- **No new dependencies:** Framer Motion and Tabler Icons already installed — use them
- **Deployment:** Vercel static deploy — solution must work purely client-side

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `.dark` class on `<html>` + CSS var overrides | Works natively with Tailwind v4's `dark:` variant; no extra deps | — Pending |
| React Context for theme state | Avoids prop drilling; `useTheme()` hook keeps toggle and consumers decoupled | — Pending |
| Inline script in `index.html` for FOUC | Runs before React hydrates, eliminating flash for returning dark-mode users | — Pending |

---
*Last updated: 2026-03-08 after initialization*
