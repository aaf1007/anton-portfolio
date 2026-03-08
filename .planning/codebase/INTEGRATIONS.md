# External Integrations

**Analysis Date:** 2026-03-08

## APIs & External Services

**Icon / Asset CDN:**
- `tech-stack-icons` 3.5.8 - Renders technology logo icons client-side; no API calls, purely a React component library
- No external API calls detected in any source file

## Data Storage

**Databases:**
- None - this is a static portfolio site; no database connection present

**File Storage:**
- Local static assets in `frontend/public/` (images: `hero.jpg`, `pfp.jpeg`, project screenshots `statify.png`, `sfucareer.png`, `careerConnect.gif`, icons)
- Assets also in `frontend/src/assets/` (React SVG, profile image PNG)

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None - no authentication required for a portfolio site

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Browser console only (no structured logging library)

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Config: `frontend/vercel.json`
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA rewrite: all routes → `/index.html`

**CI Pipeline:**
- None detected (no GitHub Actions, CircleCI, or similar config files present)

## Environment Configuration

**Required env vars:**
- None - no environment variables are referenced in any source file

**Secrets location:**
- Not applicable

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## External Links / Social

**Referenced in `frontend/src/components/Footer.tsx`:**
- LinkedIn profile link (via `FaLinkedinIn` icon from `react-icons/fa`)
- GitHub profile link (via `FaGithubAlt` icon from `react-icons/fa`)
- Email mailto link (via `AiTwotoneMail` icon from `react-icons/ai`)

These are static anchor tags, not API integrations.

---

*Integration audit: 2026-03-08*
