# Technology Stack

**Analysis Date:** 2026-03-08

## Languages

**Primary:**
- TypeScript 5.9.x - All source files in `frontend/src/`

**Secondary:**
- CSS - `frontend/src/index.css` (Tailwind v4 with custom CSS variables)
- HTML - `frontend/index.html` (entry point)

## Runtime

**Environment:**
- Node.js v24.x

**Package Manager:**
- npm
- Lockfile: present (`frontend/package-lock.json`, lockfileVersion 3)

## Frameworks

**Core:**
- React 19.2.0 - UI rendering, `frontend/src/main.tsx` entry
- React DOM 19.2.0 - DOM bindings

**Routing:**
- react-router-dom 7.13.0 - Client-side routing via `BrowserRouter` in `frontend/src/App.tsx`

**Animation:**
- motion 12.34.3 (Motion/Framer Motion) - Used in `frontend/src/Layout.tsx` for animated mobile menu transitions via `motion` and `AnimatePresence`

**Styling:**
- Tailwind CSS 4.2.0 - Utility-first CSS; configured via `@tailwindcss/vite` plugin
  - Custom CSS variables defined in `frontend/src/index.css` under `:root` and `@theme inline`
  - Custom color tokens: `--color-primary`, `--color-background-eggshell`, `--color-tan-pastel`, etc.
  - Custom fonts: "General Sans" (sans), "IBM Plex Mono" / "JetBrains Mono" (mono) — loaded externally (not bundled)

**Build/Dev:**
- Vite 7.3.1 - Dev server and bundler, config at `frontend/vite.config.ts`
  - Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`
  - Path alias: `@` maps to `frontend/src/`
- TypeScript compiler (`tsc -b`) — runs before Vite build in `npm run build`

## Key Dependencies

**Critical:**
- `react` ^19.2.0 - Core rendering framework
- `react-router-dom` ^7.13.0 - SPA routing with BrowserRouter; Vercel rewrite rule in `frontend/vercel.json` ensures all paths serve `index.html`
- `motion` ^12.34.3 - Animations (mobile nav open/close)

**UI / Icon Libraries:**
- `@tabler/icons-react` ^3.37.1 - Tabler icon set
- `react-icons` ^5.5.0 - Multi-family icons (used: `react-icons/hi`, `react-icons/fa`, `react-icons/ai`)
- `tech-stack-icons` ^3.5.8 - Technology logo icons used in `frontend/src/pages/HomePage.tsx` via `<StackIcon>`

**Utilities:**
- `clsx` ^2.1.1 - Conditional className construction
- `tailwind-merge` ^3.5.0 - Merge Tailwind classes without conflicts

## Configuration

**TypeScript:**
- Root config: `frontend/tsconfig.json` (references `tsconfig.app.json` and `tsconfig.node.json`)
- App config: `frontend/tsconfig.app.json`
  - Target: ES2022
  - Strict mode enabled
  - `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`
  - Path alias: `@/*` → `./src/*`

**ESLint:**
- Config: `frontend/eslint.config.js`
- Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint`
- Targets: `**/*.{ts,tsx}`

**Vite:**
- Config: `frontend/vite.config.ts`
- Path alias `@` → `frontend/src/`

**Deployment:**
- Config: `frontend/vercel.json`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Rewrite: all paths → `/index.html` (required for client-side routing)

**Environment:**
- No `.env` files present; no environment variable usage detected in source

## Platform Requirements

**Development:**
- Node.js 24.x
- npm (lockfile present)
- Run dev server: `cd frontend && npm run dev`
- Lint: `cd frontend && npm run lint`

**Production:**
- Deployed to Vercel
- Build output: `frontend/dist/`
- Build command: `npm run build` (runs `tsc -b && vite build`)

---

*Stack analysis: 2026-03-08*
