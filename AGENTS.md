# Flashforge AD5X product site

Persian-first (RTL) product landing page with an optional English (LTR) switch, a
database-backed content layer and a protected admin dashboard.

## Stack

- `src/` — React 18 + TypeScript + Vite landing page and admin dashboard.
- `server/` — Express API (`/api/content`, `/api/leads`, `/api/admin/*`) on Node 22.
- PostgreSQL — stores editable site content, customer requests and admin sessions.
- `src/content/default-content.json` — the seed/default content; the whole page copy,
  specs, gallery labels, FAQ and CTA text live in this one file (fa/en).

## Run it in the sandbox

```bash
docker compose -f docker-compose.base44.yml up -d --build
docker compose -f docker-compose.base44.yml ps
```

- Web (Vite dev server, live reload): http://localhost:3000
- API: http://localhost:8000/api/health
- Admin dashboard: http://localhost:3000/admin

Dependencies are installed inside the containers on startup (named volumes for
`node_modules`); source is bind-mounted, so edits hot-reload. The API runs under
`node --watch` and restarts on server file changes.

## Admin dashboard

`/admin` is a protected editor for every section, the FAQ, filament colors, contact
details, CTA text, SEO metadata and the list of submitted requests. Saves go to
PostgreSQL through `PUT /api/admin/content`; the public API is read-only apart from
`POST /api/leads`.

Credentials come from `ADMIN_USERNAME` / `ADMIN_PASSWORD` (platform secrets, delivered
via `/run/base44/app.env`).

**Preview-only fallback:** when `BASE44_PREVIEW_MODE` is exactly `1` and
`ADMIN_PASSWORD` is unset, the API accepts `admin` / `ad5x-preview` so the dashboard is
reachable in the sandbox. Outside preview mode there is no fallback and login returns
`admin_not_configured` until the secrets are set. Set both secrets before sharing the
app with anyone else.

## Content behaviour

- The page renders instantly from the bundled JSON and then loads the database copy.
  If the API is unreachable the page keeps working from the fallback content
  (`<html data-content-source="fallback">` marks that state).
- Rows whose value is empty are shown as `در انتظار تکمیل` (pending) instead of inventing
  specs. `specs.catalogUrl` stays `null` until a real catalog file exists — the download
  button only renders when a URL is set.
- Simulated product renders (`PrinterArt` SVG) stand in for manufacturer photography and
  are labelled as such in the footer disclaimer.

## Checks

```bash
docker compose -f docker-compose.base44.yml exec -T web npm run typecheck
docker compose -f docker-compose.base44.yml exec -T web npm run build
```

## Notes

- `/api` is proxied by the Vite dev server to the `api` service (`API_PROXY_TARGET`), so
  the browser only ever talks to one origin and the session cookie stays same-site.
- Admin sessions are stored hashed in `admin_sessions` with a 7-day expiry; login is
  throttled (8 attempts / 15 min per IP).
- The database volume (`ad5x_db`) holds admin edits and leads. Do not delete it to
  refresh dependencies.
