# Codebase Concerns

**Analysis Date:** 2026-03-08

## Tech Debt

**Commented-out project description content:**
- Issue: Large blocks of project detail bullet points are commented out in `ProjectsPage.tsx` (lines 13-26 and 43-56). These contain substantive architecture/implementation details (Redis caching, OAuth, streaming) that were deliberately hidden rather than deleted or displayed conditionally.
- Files: `frontend/src/pages/ProjectsPage.tsx`
- Impact: Content is not visible to visitors; if it was removed for content reasons it should be deleted to keep the file clean; if it's pending display it should be tracked as a feature.
- Fix approach: Either delete the dead comment blocks or extract them into a separate data field (e.g. `extendedDescription`) toggled via UI state.

**Commented-out experience nav link:**
- Issue: The "experience" nav item in `SideBar.tsx` (lines 25-27) is hardcoded-commented with a `Link to="/projects"` pointing to the wrong route. A "chat" nav item is also commented out.
- Files: `frontend/src/components/SideBar.tsx`
- Impact: These are planned features with no route or page implemented. Dead code creates confusion about which nav items are real.
- Fix approach: Remove commented nav items until the routes and pages exist, then add them properly.

**Commented-out profile image:**
- Issue: `HomePage.tsx` line 51 has a commented-out `<img>` tag referencing `profileImage` which is not imported anywhere in the file.
- Files: `frontend/src/pages/HomePage.tsx`
- Impact: The import would cause a TypeScript error if uncommented. The `pfp.jpeg` (2MB) and `hero.jpg` sit unused in `/public`.
- Fix approach: Either implement the profile image section or remove the comment and unused assets.

**Duplicate CSS variable declaration:**
- Issue: `--color-foreground` is declared twice in the `@theme inline` block in `index.css` (lines 19 and 22).
- Files: `frontend/src/index.css`
- Impact: Second declaration silently overrides the first; no functional bug currently since both point to the same `var(--foreground)`, but it is confusing and fragile if one is changed.
- Fix approach: Remove the duplicate declaration on line 22.

**Hard-coded cursor blink color:**
- Issue: The `.cursor-blink` class in `index.css` (line 52) uses the raw hex `#5d4037` instead of a CSS variable (`var(--primary)`).
- Files: `frontend/src/index.css`
- Impact: When dark mode is added (see prd.md), the blink cursor will stay brown regardless of theme and will not adapt to the dark palette.
- Fix approach: Change `background-color: #5d4037` to `background-color: var(--primary)`.

**`SideBar` active-link state managed by local `useState` instead of router:**
- Issue: `SideBar.tsx` tracks `current` active link with `useState("")` initialized to empty string. Navigation away and back does not restore the highlight; browser refresh clears the state; direct URL navigation produces no highlight.
- Files: `frontend/src/components/SideBar.tsx`
- Impact: Active nav item is visually incorrect on refresh or direct URL entry.
- Fix approach: Derive active link from `useLocation().pathname` (already available via react-router-dom) and remove the `useState` pattern.

**Inconsistent image path format:**
- Issue: Two project images in `ProjectsPage.tsx` use different path formats: `"sfucareer.png"` (relative, no leading slash, line 29) and `"/statify.png"` (absolute path with leading slash, line 54).
- Files: `frontend/src/pages/ProjectsPage.tsx`
- Impact: `sfucareer.png` may fail to load in nested routes since it is a relative URL. In a Vite SPA served from root this works, but is inconsistent and error-prone if routing changes.
- Fix approach: Standardize all public asset paths to use a leading slash: `"/sfucareer.png"`.

## Security Considerations

**Missing `rel="noopener noreferrer"` on external links:**
- Risk: All `target="_blank"` links in `Footer.tsx` and `ProjectCard.tsx` are missing `rel="noopener noreferrer"`. Without this, the opened tab can access `window.opener` and potentially redirect the originating page.
- Files: `frontend/src/components/Footer.tsx`, `frontend/src/components/ProjectCard.tsx`
- Current mitigation: None. Modern browsers partially mitigate this for cross-origin links but it is not universal.
- Recommendations: Add `rel="noopener noreferrer"` to every `target="_blank"` anchor element.

**Email address exposed in plain HTML:**
- Risk: `aaf13@sfu.ca` is hardcoded as a visible `mailto:` href in `Footer.tsx` (line 14). Email harvesters and scrapers can trivially collect it.
- Files: `frontend/src/components/Footer.tsx`
- Current mitigation: None.
- Recommendations: Use obfuscation (e.g. render via JS from split strings) or replace with a contact form if spam exposure is a concern.

## Performance Bottlenecks

**Unoptimized project screenshot images:**
- Problem: `sfucareer.png` in `/public` is 4.5 MB and `pfp.jpeg` is 2 MB. These are served as-is with no compression, resizing, or modern format conversion.
- Files: `frontend/public/sfucareer.png`, `frontend/public/pfp.jpeg`
- Cause: Assets were placed in `/public` without optimization; Vite does not process `/public` files.
- Improvement path: Convert to WebP/AVIF, resize to display dimensions, use `loading="lazy"` on off-screen images.

**57 MB GIF asset committed to repository:**
- Problem: `careerConnect.gif` in `/public` is 57 MB. It is not referenced anywhere in the current source code.
- Files: `frontend/public/careerConnect.gif`
- Cause: Asset was added but never wired up; it remains in the repo and is deployed with every Vercel build, significantly increasing deploy artifact size.
- Improvement path: Remove the file from the repository. If a demo animation is needed, convert to a video (MP4/WebM) and embed via `<video>`.

**Google Fonts loaded synchronously:**
- Problem: `index.html` loads two Google Fonts stylesheets via `<link rel="stylesheet">` (Inter and JetBrains Mono). These block rendering until the fonts are fetched.
- Files: `frontend/index.html`
- Cause: Default Google Fonts embed snippet. The `preconnect` hints are present but the stylesheets themselves are render-blocking.
- Improvement path: Add `media="print" onload="this.media='all'"` swap pattern, or use `font-display: swap` via the Google Fonts URL parameter `&display=swap` (already present for Inter but not explicitly verified for JetBrains Mono URL).

**Two overlapping icon libraries imported:**
- Problem: Both `react-icons` and `@tabler/icons-react` are listed as production dependencies in `package.json`. Currently only `react-icons` is used in source (`Footer.tsx`, `Layout.tsx`). `@tabler/icons-react` is installed but not referenced in any source file.
- Files: `frontend/package.json`
- Cause: Dependency was likely added speculatively and never used or cleaned up.
- Improvement path: Remove `@tabler/icons-react` from `dependencies` to reduce bundle weight.

## Fragile Areas

**Hash-based scroll navigation uses double `requestAnimationFrame`:**
- Files: `frontend/src/pages/HomePage.tsx` (lines 11-23)
- Why fragile: The double-nested `requestAnimationFrame` is a timing workaround to ensure the DOM has rendered before calling `scrollIntoView`. This is an implicit timing assumption that can break with slower devices, React Strict Mode double-renders, or future React concurrent features.
- Safe modification: Prefer a ref-based approach or `useLayoutEffect` for scroll timing; document the reason for the double-rAF if it must stay.
- Test coverage: No tests exist for this behavior.

**`PATH_TO_PAGE_KEY` map in Layout must be kept in sync with App.tsx routes:**
- Files: `frontend/src/Layout.tsx` (lines 12-15), `frontend/src/App.tsx`
- Why fragile: The route-to-page-key mapping in `Layout.tsx` is a manually maintained parallel structure. Adding a new route in `App.tsx` without updating this map silently produces the wrong `currentPageKey` (falls back to `"home"`).
- Safe modification: When adding routes, update both files. Long-term, derive `currentPageKey` directly from `useLocation().pathname` without a separate map.
- Test coverage: None.

**`ProjectCard` image fallback is broken when `link` and `github` are both absent:**
- Files: `frontend/src/components/ProjectCard.tsx` (line 18)
- Why fragile: The image is wrapped in `<a href={link || github}>`. If both are `undefined`, the anchor renders with `href={undefined}`, which is valid HTML but navigates to the current page on click, behaving unexpectedly.
- Safe modification: Conditionally wrap the image in an anchor only when at least one URL is present.
- Test coverage: None.

## Missing Critical Features

**No dark mode support:**
- Problem: The app has a light-only palette. No `html.dark` CSS variable overrides, no theme toggle, no `prefers-color-scheme` handling, and no flash-prevention inline script exist.
- Blocks: A planned dark mode feature is fully documented in `prd.md` but not yet implemented.

**No `<meta>` SEO or Open Graph tags:**
- Problem: `index.html` has only `<title>Anton Florendo</title>` and no description, OG image, canonical, or Twitter card tags.
- Files: `frontend/index.html`
- Blocks: Social sharing previews will be blank; search engine indexing is degraded.

**No favicon in correct format:**
- Problem: `index.html` declares `<link rel="icon" type="image/svg+xml" href="/icon.png">` — the MIME type is `image/svg+xml` but the file is a PNG. The type mismatch may cause browsers to ignore the favicon.
- Files: `frontend/index.html`, `frontend/public/icon.png`
- Fix: Change the type attribute to `type="image/png"` or supply an actual SVG.

## Test Coverage Gaps

**Zero test coverage across the entire frontend:**
- What's not tested: All components, pages, routing, scroll behavior, nav active state, and project data rendering.
- Files: All files under `frontend/src/`
- Risk: Regressions in navigation, layout, or rendering go undetected. No test runner, no test config file, and no test files are present.
- Priority: Low for a personal portfolio, but any future interactive feature (dark mode toggle, contact form) should have at minimum smoke tests.

---

*Concerns audit: 2026-03-08*
