# Testing Patterns

**Analysis Date:** 2026-03-08

## Test Framework

**Runner:** None — no test framework is installed or configured.

- No `jest`, `vitest`, `@testing-library/react`, or equivalent package in `frontend/package.json`
- No `jest.config.*` or `vitest.config.*` file present
- No test script in `frontend/package.json` scripts (`dev`, `build`, `lint`, `preview` only)

**Run Commands:**
```bash
# No test commands available
npm run lint    # Only code quality check available
```

## Test File Organization

**Location:** No test files exist in the codebase.

- Search for `*.test.*` and `*.spec.*` returned no results across the entire project
- No `__tests__` directories present under `frontend/src/`

## Coverage

**Requirements:** None enforced — no coverage tooling configured.

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present.

## Current Quality Checks

The only automated code quality check available is ESLint:

```bash
npm run lint    # Runs ESLint over **/*.{ts,tsx} in frontend/
```

ESLint config: `frontend/eslint.config.js`
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` — enforces Rules of Hooks
- `eslint-plugin-react-refresh` — guards against HMR breakage

TypeScript compiler (`tsc -b`) runs as part of the build and acts as a secondary static check:

```bash
npm run build   # tsc -b && vite build — type errors fail the build
```

## Recommended Setup (if tests are added)

Given the stack (React 19, Vite 7, TypeScript), the natural testing additions would be:

- **Unit/component tests:** Vitest + `@testing-library/react`
- **E2E tests:** Playwright

Vitest integrates directly with the existing `vite.config.ts` and requires minimal config.

Test files should be co-located with components following the pattern:
```
frontend/src/components/ProjectCard.tsx
frontend/src/components/ProjectCard.test.tsx
```

---

*Testing analysis: 2026-03-08*
