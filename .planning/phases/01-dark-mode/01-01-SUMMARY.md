---
phase: 01-dark-mode
plan: 01
subsystem: ui
tags: [css, tailwind, dark-mode, fouc, css-variables]

# Dependency graph
requires: []
provides:
  - Tailwind v4 @custom-variant dark enabling dark: utilities via .dark class on <html>
  - Warm dark palette (10 CSS variables) in html.dark {} block
  - FOUC prevention inline script in index.html reading localStorage before React hydrates
  - Global color transition on all elements (200-250ms ease)
  - Dark scrollbar styles (Firefox + webkit)
  - Dark focus ring override using --accent-light
  - Fixed cursor blink color to use var(--primary) instead of hardcoded #5d4037
affects: [ThemeContext, ThemeToggle, all components using dark: Tailwind utilities]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@custom-variant dark (&:where(.dark, .dark *)) — Tailwind v4 class-based dark mode"
    - "FOUC prevention via synchronous IIFE in <head> before React module script"
    - "CSS variable swap pattern: :root {} defines light values, html.dark {} overrides to dark values"

key-files:
  created: []
  modified:
    - frontend/index.html
    - frontend/src/index.css

key-decisions:
  - "Position FOUC script after font <link> tags and before </head> — ensures it runs before any stylesheet injection"
  - "Use html.dark {} selector (not .dark {}) for CSS variable overrides to ensure specificity over :root"
  - "Global transition on *, *::before, *::after — smooth 200-250ms color change on theme toggle"

patterns-established:
  - "FOUC guard: synchronous IIFE checks localStorage then prefers-color-scheme, sets .dark on documentElement"
  - "Dark palette variables: all locked warm dark values live in html.dark {}, light values in :root {}"

requirements-completed: [THEME-04, THEME-05, VIS-01, VIS-02, VIS-03, VIS-04, FIX-01]

# Metrics
duration: 5min
completed: 2026-03-08
---

# Phase 1 Plan 01: CSS and HTML Dark Mode Foundation Summary

**Tailwind v4 @custom-variant dark with warm dark palette, FOUC prevention script, global color transitions, dark scrollbar/focus-ring, and cursor blink color fix**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-08T05:52:45Z
- **Completed:** 2026-03-08T05:57:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added synchronous FOUC prevention IIFE to `index.html` that reads `localStorage` and `prefers-color-scheme` before React hydrates
- Added `@custom-variant dark` so all `dark:` Tailwind utilities activate when `.dark` is on `<html>`
- Defined `html.dark {}` block with all 10 warm dark palette variables from CONTEXT.md
- Added global `*, *::before, *::after` color transition for smooth 200-250ms theme changes
- Added dark scrollbar styles for both Firefox (`scrollbar-color`) and WebKit
- Added `html.dark *:focus-visible` override using `--accent-light`
- Fixed `.cursor-blink` hardcoded `#5d4037` to `var(--primary)` so it follows theme
- Removed duplicate `--color-foreground` declaration from `@theme inline {}`

## Task Commits

Each task was committed atomically:

1. **Task 1: Add FOUC prevention script to index.html** - `01f323b` (feat)
2. **Task 2: Update index.css — dark variant, palette, transitions, scrollbar, focus ring, and bug fix** - `1314f53` (feat)

## Files Created/Modified
- `frontend/index.html` - Added synchronous FOUC prevention IIFE in `<head>`
- `frontend/src/index.css` - @custom-variant, html.dark palette, global transition, scrollbar, focus ring, cursor fix

## Decisions Made
- Positioned FOUC script after font `<link>` tags and before `</head>` to ensure it runs synchronously before Vite injects stylesheets
- Used `html.dark {}` selector (not `.dark {}`) for CSS variable overrides for correct specificity over `:root`
- Global transition applied to `*, *::before, *::after` — covers background, color, and border-color properties

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Both `npm run lint` and `npm run build` passed on first attempt. The pre-existing chunk size warning (>500kB) is unrelated to this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- CSS foundation is complete. ThemeContext (Plan 02) and ThemeToggle (Plan 03) can now be implemented.
- All `dark:` Tailwind utilities will work as soon as `.dark` is added to `<html>`.
- No blockers.

---
*Phase: 01-dark-mode*
*Completed: 2026-03-08*
