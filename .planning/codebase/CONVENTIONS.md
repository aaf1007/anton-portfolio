# Coding Conventions

**Analysis Date:** 2026-03-08

## Naming Patterns

**Files:**
- React components use PascalCase: `ProjectCard.tsx`, `SideBar.tsx`, `PageTree.tsx`, `Footer.tsx`
- Page components use PascalCase with "Page" suffix: `HomePage.tsx`, `ProjectsPage.tsx`
- Layout-level files use PascalCase without suffix: `Layout.tsx`, `App.tsx`
- Entry point uses lowercase: `main.tsx`
- CSS files use lowercase: `index.css`

**Components:**
- Function components use PascalCase matching their filename: `export default function ProjectCard(...)`
- All components use `export default` (default exports only, no named exports)

**Variables and Functions:**
- camelCase for local variables: `mobileMenuOpen`, `currentPageKey`, `mediaClassName`
- camelCase for event handlers with `handle` prefix: `handleNav`
- SCREAMING_SNAKE_CASE for module-level constants: `PATH_TO_PAGE_KEY`
- camelCase for prop callback names: `onNavigate`

**Types:**
- PascalCase for type aliases: `ProjectCards`, `SideBarProps`, `PageTree`
- Types defined at the top of the file that uses them — no separate types file
- Props types named after component or descriptive noun: `SideBarProps`, `ProjectCards`

**CSS Class Variables:**
- camelCase for local className strings: `const mediaClassName = "w-full h-auto rounded-sm"`

## Code Style

**Formatting:**
- No Prettier config present — formatting is not tool-enforced
- Inconsistent indentation: `Layout.tsx` uses 2-space indent; `HomePage.tsx`, `ProjectsPage.tsx`, `ProjectCard.tsx`, `SideBar.tsx`, `Footer.tsx` use 4-space indent
- Double quotes used for string literals in `.tsx` files

**Linting:**
- ESLint 9 flat config: `frontend/eslint.config.js`
- Extends: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks` recommended, `eslint-plugin-react-refresh` vite preset
- Targets only `**/*.{ts,tsx}` — JS files not linted
- `dist/` globally ignored

**TypeScript:**
- Strict mode enabled (`"strict": true`)
- `noUnusedLocals` and `noUnusedParameters` enforced
- `erasableSyntaxOnly` enabled — no enums or namespaces
- Target: `ES2022`, `moduleResolution: "bundler"`
- `verbatimModuleSyntax` enforced — use `import type` for type-only imports:
  ```typescript
  import type { ReactNode } from "react"
  ```

## Import Organization

**Order (observed pattern):**
1. React core: `import { useState, useEffect } from "react"`
2. Router: `import { Link, Outlet, useLocation } from "react-router-dom"`
3. Third-party icon/UI libraries: `import { HiMenu, HiX } from "react-icons/hi"`
4. Internal components via `@` alias: `import Footer from "@/components/Footer"`
5. Local relative components: `import SideBar from "./components/SideBar"`

**Path Aliases:**
- `@` maps to `./src/` — configured in both `frontend/vite.config.ts` and `frontend/tsconfig.app.json`
- Use `@/` alias when importing from pages or components into `src/` subdirectories
- Relative imports (`./`) used in `Layout.tsx` for sibling-level components

## Component Structure Pattern

**Typical file layout:**
1. Imports
2. Module-level data constants (arrays/objects)
3. Props type definition
4. `export default function ComponentName({ ...props }: PropsType) { ... }`

**Props:**
- Always destructured in function signature:
  ```typescript
  export default function ProjectCard({ title, description, image, stack, link, github }: ProjectCards)
  ```
- Optional props typed with `?`: `image?: string`, `link?: string`, `onNavigate?: () => void`

## JSX Patterns

**Conditional rendering:**
- Ternary with `null` for inline conditionals: `{link ? <a href={link}>...</a> : null}`
- Optional chaining for callbacks: `onNavigate?.()`, `fn?.()`

**Lists:**
- Always include `key` prop with a stable unique string value: `key={cur}`, `key={project.title}`

**className:**
- Tailwind CSS utility classes inline throughout
- Template literals for conditional classes:
  ```tsx
  className={`hover:text-accent-light ${current === "projects" ? "font-bold text-accent-light" : ""}`}
  ```
- `clsx` and `tailwind-merge` are installed as dependencies but not yet used in source

**Animations:**
- `motion` package (Framer Motion) used in `frontend/src/Layout.tsx` via `motion.div`, `motion.aside`, `AnimatePresence`
- Transition props specified inline on each motion element

## Static Data Pattern

- Page-level static data defined as module-level `const` arrays above the component, not in separate data files
- Examples: `const projects = [...]` in `frontend/src/pages/ProjectsPage.tsx`, `const coursework = [...]` in `frontend/src/pages/HomePage.tsx`

## State Management

- Local `useState` only — no Context, Redux, Zustand, or other state library
- No global state — all state is component-local

## Error Handling

- No error boundaries detected
- No try/catch blocks in source files
- Optional chaining used defensively for DOM access and optional callbacks:
  ```typescript
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  onNavigate?.()
  ```
- Non-null assertion used at app entry for guaranteed DOM node:
  ```typescript
  createRoot(document.getElementById('root')!)
  ```

## Comments

- Block comments (`/** ... */`) used above module-level constants for architectural notes: seen in `frontend/src/Layout.tsx`
- Inline JSX comments label layout sections: `{/* Mobile header: visible only on small screens */}`
- Commented-out code retained in JSX with `{/* ... */}` blocks representing incomplete or future features
- No JSDoc on component functions — types expressed via TypeScript annotations only

## Logging

- No logging framework present
- No `console.*` calls in any source file

---

*Convention analysis: 2026-03-08*
