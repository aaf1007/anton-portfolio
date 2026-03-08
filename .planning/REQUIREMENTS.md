# Requirements: Portfolio 2026 — Dark Mode

**Defined:** 2026-03-08
**Core Value:** Visitors can quickly understand who I am, see my work, and get in touch — in their preferred color scheme.

## v1 Requirements

### Theme Infrastructure

- [x] **THEME-01**: User can toggle between light and dark mode via a button in the sidebar (desktop) and mobile header bar
- [x] **THEME-02**: Active theme persists across page refreshes via localStorage
- [x] **THEME-03**: On first visit, theme defaults to the user's OS color scheme preference (`prefers-color-scheme`)
- [x] **THEME-04**: Theme is applied before first paint — no flash of wrong theme on load
- [x] **THEME-05**: Color changes animate smoothly with a 200-300ms transition when toggling

### Visual — Dark Palette

- [x] **VIS-01**: Dark mode uses a warm dark palette (dark browns, muted tans) that complements the existing earthy light theme
- [ ] **VIS-02**: All pages, components, sidebar, header, footer, cards, and borders respect the active theme
- [x] **VIS-03**: Scrollbar is styled to match the active theme
- [x] **VIS-04**: Focus ring on interactive elements is visible in dark mode

### Toggle Component

- [x] **TOGGLE-01**: Toggle displays a sun icon in light mode and a moon icon in dark mode (Tabler Icons: TbSun / TbMoon)
- [x] **TOGGLE-02**: Icon animates on toggle — rotates and fades out, new icon fades in (Framer Motion, ~200ms)

### Bug Fix

- [x] **FIX-01**: Cursor blink animation in `index.css` uses `var(--primary)` instead of the hardcoded `#5d4037`

## v2 Requirements

*(None identified — this is a complete, self-contained feature)*

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple themes / color picker | Over-engineered for a portfolio |
| Backend/API changes | Static site, no server |
| System theme auto-sync (live media query listener) | localStorage choice should override; not needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 1 | Complete |
| THEME-02 | Phase 1 | Complete |
| THEME-03 | Phase 1 | Complete |
| THEME-04 | Phase 1 | Complete (01-01) |
| THEME-05 | Phase 1 | Complete (01-01) |
| VIS-01 | Phase 1 | Complete (01-01) |
| VIS-02 | Phase 1 | Pending |
| VIS-03 | Phase 1 | Complete (01-01) |
| VIS-04 | Phase 1 | Complete (01-01) |
| TOGGLE-01 | Phase 1 | Complete |
| TOGGLE-02 | Phase 1 | Complete |
| FIX-01 | Phase 1 | Complete (01-01) |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-08 after initial definition*
