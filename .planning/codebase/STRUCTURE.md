# Codebase Structure

**Analysis Date:** 2026-03-08

## Directory Layout

```
portfolio-2026/
├── frontend/                  # All application code lives here
│   ├── src/
│   │   ├── main.tsx           # JS entry point — mounts React into #root
│   │   ├── App.tsx            # Router setup and route declarations
│   │   ├── Layout.tsx         # Persistent shell (sidebar, header, outlet)
│   │   ├── index.css          # Global styles, Tailwind import, CSS variables
│   │   ├── assets/            # Vite-managed static assets (imported in code)
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Footer.tsx
│   │   │   ├── PageTree.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── SideBar.tsx
│   │   └── pages/             # Full-page route components
│   │       ├── HomePage.tsx
│   │       └── ProjectsPage.tsx
│   ├── public/                # Static assets served at root URL (no import needed)
│   │   ├── icon.png
│   │   ├── hero.jpg
│   │   ├── pfp.jpeg
│   │   ├── sfucareer.png
│   │   ├── statify.png
│   │   ├── careerConnect.gif
│   │   └── *.svg
│   ├── dist/                  # Build output (generated, not committed)
│   ├── index.html             # HTML entry point, font links, #root div
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts         # Vite config — defines @ path alias
│   ├── tsconfig.json
│   ├── tsconfig.app.json      # Strict TS config for src/
│   ├── tsconfig.node.json
│   ├── eslint.config.js
│   └── vercel.json            # Vercel deploy config with SPA rewrite rule
├── .planning/                 # GSD planning documents
│   └── codebase/
├── .vscode/
├── .gitignore
├── prd.md                     # Product requirements document
└── README.md
```

## Directory Purposes

**`frontend/src/`:**
- Purpose: All TypeScript/TSX application source
- Contains: Entry points, router, layout, pages, components, styles
- Key files: `main.tsx`, `App.tsx`, `Layout.tsx`, `index.css`

**`frontend/src/pages/`:**
- Purpose: One file per route — full-page views rendered inside `<Outlet>`
- Contains: Page components with inline static data (arrays/objects defined at module scope)
- Key files: `HomePage.tsx`, `ProjectsPage.tsx`

**`frontend/src/components/`:**
- Purpose: Shared, reusable UI components with no routing or page-level responsibility
- Contains: Presentational components used by pages and `Layout.tsx`
- Key files: `SideBar.tsx`, `Footer.tsx`, `ProjectCard.tsx`, `PageTree.tsx`

**`frontend/public/`:**
- Purpose: Static assets referenced by URL string (e.g. `src="/statify.png"` in `ProjectCard`)
- Contains: Images and SVGs served directly at the root path
- Note: Files here are NOT processed by Vite — use this for assets referenced as plain strings

**`frontend/src/assets/`:**
- Purpose: Assets imported directly in TypeScript/TSX files (Vite processes these)
- Contains: Vite-managed static files
- Note: Currently minimal — most images are in `public/`

**`frontend/dist/`:**
- Purpose: Vite build output
- Generated: Yes
- Committed: No

## Key File Locations

**Entry Points:**
- `frontend/index.html`: HTML shell, font imports, `#root` div
- `frontend/src/main.tsx`: React bootstrap
- `frontend/src/App.tsx`: Route declarations

**Configuration:**
- `frontend/vite.config.ts`: Vite plugins (React, Tailwind), `@` path alias
- `frontend/tsconfig.app.json`: TypeScript strict config for `src/`
- `frontend/src/index.css`: Tailwind import, CSS custom properties, global styles
- `frontend/vercel.json`: SPA rewrite rule (`"source": "/(.*)"` → `/index.html`)

**Core Logic:**
- `frontend/src/Layout.tsx`: Two-column grid, mobile drawer, `PATH_TO_PAGE_KEY` map, `<Outlet>`

**Pages:**
- `frontend/src/pages/HomePage.tsx`: Home route — about, coursework, hobbies, tech stack, contact
- `frontend/src/pages/ProjectsPage.tsx`: Projects route — project grid with inline data

**Shared Components:**
- `frontend/src/components/SideBar.tsx`: Navigation links, name/title header
- `frontend/src/components/Footer.tsx`: Contact section with social links (id="contact")
- `frontend/src/components/ProjectCard.tsx`: Card UI for a single project
- `frontend/src/components/PageTree.tsx`: Breadcrumb display (`/home/anton > page.md`)

## Naming Conventions

**Files:**
- Pages: PascalCase with `Page` suffix — `HomePage.tsx`, `ProjectsPage.tsx`
- Components: PascalCase, no suffix — `SideBar.tsx`, `ProjectCard.tsx`, `Footer.tsx`
- Config/entry: camelCase — `main.tsx`, `vite.config.ts`, `index.css`

**Directories:**
- Lowercase plural noun — `pages/`, `components/`, `assets/`

**Components:**
- Default export named to match the filename — `export default function SideBar`
- Props type named after the component — `type SideBarProps`, `type ProjectCards`

**CSS Classes:**
- Tailwind utility classes inline on JSX elements
- Custom theme tokens via CSS variables: `text-primary`, `bg-accent-light`, `bg-background-eggshell`

## Where to Add New Code

**New Page/Route:**
1. Create `frontend/src/pages/NewPage.tsx` — default export function component
2. Add route in `frontend/src/App.tsx`: `<Route path="new-page" element={<NewPage />} />`
3. Add entry in `PATH_TO_PAGE_KEY` in `frontend/src/Layout.tsx`: `"/new-page": "new-page"`
4. Add nav link in `frontend/src/components/SideBar.tsx`

**New Shared Component:**
- Implementation: `frontend/src/components/ComponentName.tsx`
- Import using alias: `import ComponentName from "@/components/ComponentName"`

**New Static Asset (URL string reference):**
- Place file in: `frontend/public/`
- Reference as: `src="/filename.ext"` (no import needed)

**New Static Asset (imported in code):**
- Place file in: `frontend/src/assets/`
- Reference as: `import assetUrl from "./assets/filename.ext"`

**Utilities / Helpers:**
- No `utils/` directory currently exists
- Create `frontend/src/utils/` for any shared logic helpers

## Special Directories

**`frontend/dist/`:**
- Purpose: Vite production build output
- Generated: Yes (via `npm run build`)
- Committed: No — excluded by `.gitignore`

**`frontend/node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by GSD tooling)
- Committed: Yes

**`.venv/`:**
- Purpose: Python virtual environment (present at repo root but unused by the frontend)
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-03-08*
