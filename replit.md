# PamliEcoConnect — Workspace

## Project Overview

PamliEcoConnect.com — a manufacturer of electric foiling boats (passenger, military, recreational). Full-stack marketing site with investor portal, NDA flow, admin dashboard, and REST API backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server artifact)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from `lib/api-spec/openapi.yaml`)
- **Frontend**: React + Vite + Wouter (website artifact, port 19161)
- **Session auth**: express-session + bcryptjs
- **Build**: esbuild (CJS bundle)

## Artifacts

- `artifacts/website` — React/Vite frontend (port 19161, previewPath `/`)
- `artifacts/api-server` — Express API server (port 8080, previewPath `/api-server`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## API Architecture

API base URL: `/api/` (proxied through Replit to `http://localhost:8080/api/`)

### Auth Routes (`/api/auth/`)
- `POST /register` — investor registration (`{ name, email, phone, password }`)
- `POST /login` — login (`{ email, password }`)
- `POST /logout` — clear session
- `GET /me` — current user info
- `POST /accept-nda` — accept NDA (requires auth)

### Protected Routes
- `/api/investors` — admin-only investor management (GET all, PATCH approve/deny)
- `/api/content/:slug` — business plan sections (investor-approved only for investor slugs)
- `/api/posts` — press releases, presentations, videos (public GET, admin write)
- `/api/team` — team member management (public GET, admin write)
- `/api/contact` — contact form submissions (public POST, admin GET)
- `/api/waitlist` — reservation waitlist (public POST, admin GET)
- `/api/admin` — admin stats/dashboard

## Investor Portal Flow
1. User registers at `/investors` → `ndaAccepted=false, approvalStatus=pending`
2. Redirected to `/investors/nda` to sign NDA → `ndaAccepted=true`
3. Shown `/investors/pending` while awaiting admin approval
4. Admin approves at `/admin` → `approvalStatus=approved`
5. User accesses `/investors/portal` with full business plan

## DB Schema (lib/db/src/schema/)
- `users` — id, name, email, phone, passwordHash, role (investor|admin), approvalStatus, ndaAccepted, ndaAcceptedAt
- `content_pages` — id, slug, title, body, displayOrder, updatedAt
- `posts` — id, title, excerpt, content, type (press_release|video|presentation), featuredImageUrl, mediaUrl, featured, publishedAt
- `team_members` — id, name, title, bio, photoUrl, displayOrder
- `contact_submissions` — id, name, email, phone, subject, message, readAt
- `waitlist` — id, name, email, phone, model, notes, createdAt

## Seeded Data
- **Admin**: `admin@pamliecoconnect.com` / `admin123!` (role: admin, approvalStatus: approved)
- **Content pages**: hero, about, exec-summary, products, services, marketing-plan, financial-plan, conclusion
- **Team**: Dr. Elena Vasquez (CEO), Marcus Chen (CTO), Amara Okonkwo (CFO), James Harrington (VP Defense Sales)
- **Posts**: 2 press releases, 1 presentation, 1 video

## Frontend Pages
- `/` — Home (hero gradient + intro + funnel cards)
- `/buyers` — Fleet showcase (P-Series, M-Series, R-Series with gradient placeholders)
- `/investors` — Investor registration form (→ redirects to /investors/nda if logged in)
- `/investors/nda` — NDA acceptance
- `/investors/pending` — Awaiting approval
- `/investors/denied` — Denied status
- `/investors/portal` — Investor portal with business plan sections
- `/login` — Login form
- `/press` — Press releases, videos, presentations
- `/team` — Team members
- `/contact` — Contact form
- `/reservations` — Waitlist signup
- `/admin` — Admin dashboard (investor applications, stats)

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (set by Replit)
- `SESSION_SECRET` — express-session secret (set in environment)
- `TELEGRAM_WEBHOOK_URL` — optional Telegram webhook for new registrations
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — optional email for contact form

---

## SailHatteras.org — Production Notes

**Server**: InMotion ded4680 · cPanel user `ca12a15`
**Site root**: `/home/ca12a15/sites/sailhatteras_site`
**GitHub repo**: `jaysails67/sailhatteras_site`
**nginx proxy cache**: `/var/nginx/cache/ca12a15`
**API process name (PM2)**: `sailhatteras-api`
**API port**: 8080 · **BASE_PATH**: `/`

### Canonical Deploy Command (verified by Hukilau)

```bash
su - ca12a15 -s /bin/bash -c '
  cd ~/sites/sailhatteras_site &&
  git fetch origin &&
  git reset --hard origin/main &&

  # Build API
  pnpm --filter @workspace/api-server build &&

  # Build frontend
  PORT=8080 BASE_PATH=/ pnpm --filter @workspace/sail-hatteras build &&

  # Restart API (with fallback if not running)
  pm2 restart sailhatteras-api || \
    pm2 start artifacts/api-server/dist/index.mjs --name sailhatteras-api
' && \
find /var/nginx/cache/ca12a15 -type f -delete && \
nginx -s reload
```

**Why `git fetch + reset --hard` instead of `git pull`**: handles diverged local branches cleanly.
**Why `-s /bin/bash`**: avoids shell environment issues on cPanel `su`.
**Why `PORT=8080 BASE_PATH=/` on build**: matches vite.config.ts `isBuild` guard; ensures correct asset paths.
**Why `pm2 restart || pm2 start`**: handles fresh server or missing PM2 registration.

### Connect to Production DB

```bash
psql $(grep DATABASE_URL /home/ca12a15/sites/sailhatteras_site/.env | cut -d= -f2-)
```

### Production SMTP / Admin
- Admin panel: `sailhatteras.org/admin` — key `hcs-admin-2026`
- Admin email: `info@sailhatteras.org` (SMTP wired, tailing PM2 logs to confirm delivery)
