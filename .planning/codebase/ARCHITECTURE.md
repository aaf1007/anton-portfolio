# Architecture

**Analysis Date:** 2026-03-08

## Pattern Overview

**Overall:** Single-Page Application (SPA) with Client-Side Routing

**Key Characteristics:**
- React 19 SPA rendered entirely on the client
- React Router v7 handles all navigation — no server-side routing
- Layout component wraps all pages via a shared `<Outlet>` pattern
- No backend or API layer; all data is static and co-located in page files
- Deployed as a static site (Vercel) with SPA rewrite rule

## Layers

**Entry Layer:**
- Purpose: Bootstrap React into the DOM
- Location: `frontend/src/main.tsx`
- Contains: ReactDOM root creation, global CSS import
- Depends on: `App.tsx`, `index.css`
- Used by: `frontend/index.html` via `<script type="module" src="/src/main.tsx">`

**Router Layer:**
- Purpose: Declare all routes and wrap them in a shared layout
- Location: `frontend/src/App.tsx`
- Contains: `BrowserRouter`, `Routes`, `Route` declarations
- Depends on: `Layout.tsx`, page components
- Used by: `main.tsx`

**Layout Layer:**
- Purpose: Persistent shell rendered around every page — sidebar, mobile header, navigation drawer, breadcrumb
- Location: `frontend/src/Layout.tsx`
- Contains: Responsive nav, `SideBar`, `PageTree`, mobile overlay with `AnimatePresence`, `<Outlet>` for page content
- Depends on: `SideBar.tsx`, `PageTree.tsx`, `react-router-dom`, `motion/react`
- Used by: `App.tsx` (wraps all routes)

**Page Layer:**
- Purpose: Full-page views mounted via the router outlet
- Location: `frontend/src/pages/`
- Contains: `HomePage.tsx`, `ProjectsPage.tsx`
- Depends on: shared components, static data defined inline
- Used by: `App.tsx` routes

**Component Layer:**
- Purpose: Reusable UI pieces consumed by pages and the layout
- Location: `frontend/src/components/`
- Contains: `Footer.tsx`, `PageTree.tsx`, `ProjectCard.tsx`, `SideBar.tsx`
- Depends on: `react-icons`, `react-router-dom`
- Used by: pages and `Layout.tsx`

## Data Flow

**Page Render:**

1. Browser loads `frontend/index.html` which bootstraps `/src/main.tsx`
2. `main.tsx` mounts `<App />` into `#root`
3. `App.tsx` matches the URL path and renders `<Layout>` with the matched page as `<Outlet>`
4. `Layout.tsx` reads `location.pathname` to derive `currentPageKey`, renders `<SideBar>`, `<PageTree page={currentPageKey}>`, then `<Outlet>`
5. The matched page component (e.g. `HomePage`) renders its static content and shared components (e.g. `<Footer>`)

**Navigation:**

1. User clicks a `<Link>` inside `SideBar`
2. React Router updates `location` in memory — no full page reload
3. `Layout.tsx` re-derives `currentPageKey` from `location.pathname`
4. `<Outlet>` swaps to the new page component

**Hash-based Scrolling (contact section):**

1. `<Link to="/#contact">` navigates to `/` with `hash = "#contact"`
2. `HomePage` reads `useLocation().hash` in a `useEffect`
3. Double `requestAnimationFrame` ensures DOM is painted before `scrollIntoView` is called

**State Management:**
- No global state library. All state is local React `useState`:
  - `mobileMenuOpen` (boolean) in `frontend/src/Layout.tsx`
  - `current` nav item key in `frontend/src/components/SideBar.tsx`
- No server state, caching layer, or context providers

## Key Abstractions

**Layout Shell:**
- Purpose: Provides the two-column grid (sidebar + main), responsive mobile drawer, and persistent navigation
- Examples: `frontend/src/Layout.tsx`
- Pattern: React Router `<Outlet>` composition — pages are injected into a fixed shell

**Page Component:**
- Purpose: Full-screen content area for a named route
- Examples: `frontend/src/pages/HomePage.tsx`, `frontend/src/pages/ProjectsPage.tsx`
- Pattern: Default export function component; static data defined as `const` arrays/objects at module scope above the component

**Shared UI Component:**
- Purpose: Presentational building blocks with no routing logic
- Examples: `frontend/src/components/ProjectCard.tsx`, `frontend/src/components/Footer.tsx`, `frontend/src/components/PageTree.tsx`
- Pattern: TypeScript `type` prop definition → destructured props → JSX return; default export

**PATH_TO_PAGE_KEY Map:**
- Purpose: Maps URL pathnames to page key strings consumed by `PageTree` for the breadcrumb display
- Location: `frontend/src/Layout.tsx` (module-level `const`)
- Pattern: `Record<string, string>` lookup — add new routes here when adding pages

## Entry Points

**HTML Entry:**
- Location: `frontend/index.html`
- Triggers: Browser request
- Responsibilities: Load fonts (Google Fonts: Inter, JetBrains Mono), define `#root` mount point, load `main.tsx`

**JS Entry:**
- Location: `frontend/src/main.tsx`
- Triggers: Vite module resolution from `index.html`
- Responsibilities: Call `createRoot`, wrap app in `<StrictMode>`, import global CSS

**App/Router Entry:**
- Location: `frontend/src/App.tsx`
- Triggers: Rendered by `main.tsx`
- Responsibilities: Declare `BrowserRouter`, define all routes, redirect unmatched paths to `/`

## Error Handling

**Strategy:** None explicit — no error boundaries, no try/catch in components.

**Patterns:**
- Missing optional props (e.g. `link?`, `github?` on `ProjectCard`) handled with conditional rendering (`link ? <a> : null`)
- Hash scroll uses optional chaining: `document.getElementById("contact")?.scrollIntoView(...)`
- Unmatched routes redirect to `/` via `<Navigate to="/" replace />`

## Cross-Cutting Concerns

**Logging:** None — no logging library or `console.*` calls in production code.
**Validation:** None — no form inputs or user-submitted data.
**Authentication:** None — fully public static site.
**Styling:** Tailwind CSS v4 with custom CSS variables defined in `frontend/src/index.css`. Theme tokens (`--color-primary`, `--color-accent-light`, etc.) are mapped via `@theme inline` and used as Tailwind utility classes throughout all components.
**Animation:** `motion/react` (Framer Motion) used exclusively in `frontend/src/Layout.tsx` for the mobile sidebar slide-in drawer (`AnimatePresence`, `motion.div`, `motion.aside`).

---

*Architecture analysis: 2026-03-08*
