# Roadmap: Portfolio 2026 — Dark Mode

## Overview

A single-phase delivery that adds full dark mode support to the existing portfolio. The phase covers everything: the theme infrastructure (context, localStorage, FOUC prevention), the dark color palette, the toggle component in both sidebar and mobile header, and a pre-existing hardcoded color bug fix. When the phase is complete, visitors can use the site comfortably in their preferred color scheme with no flash, no jarring transitions, and no visual regressions.

## Phases

- [ ] **Phase 1: Dark Mode** - Full dark mode feature — toggle, persistence, FOUC prevention, dark palette, and bug fix

## Phase Details

### Phase 1: Dark Mode
**Goal**: Visitors can view the portfolio in their preferred color scheme, with the choice persisted and applied without visual disruption
**Depends on**: Nothing (first phase)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, VIS-01, VIS-02, VIS-03, VIS-04, TOGGLE-01, TOGGLE-02, FIX-01
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — CSS/HTML foundation: FOUC script, dark palette vars, @custom-variant, transitions, scrollbar, focus ring, cursor blink fix
- [ ] 01-02-PLAN.md — Theme infrastructure: ThemeContext.tsx (ThemeProvider + useTheme hook) and App.tsx wrapping
- [ ] 01-03-PLAN.md — Toggle component: ThemeToggle.tsx with AnimatePresence animation, wired into SideBar and mobile header
- [ ] 01-04-PLAN.md — Human verification checkpoint: end-to-end browser testing of all 12 requirements

**Success Criteria** (what must be TRUE):
  1. User can click a sun/moon icon in the sidebar (desktop) and mobile header to switch between light and dark mode
  2. After toggling to dark mode and refreshing the page, the site opens in dark mode with no flash of the light theme
  3. On a first visit with OS dark mode enabled, the site opens in dark mode automatically
  4. All pages, components, sidebar, header, footer, project cards, and scrollbar render correctly in both themes with no hardcoded colors bleeding through
  5. Toggling theme triggers a smooth animated icon swap and a color transition — no jarring visual jumps

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dark Mode | 3/4 | In Progress|  |
