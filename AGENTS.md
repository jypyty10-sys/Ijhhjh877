# EVORA STYLE — working notes for agents

Premium British heritage menswear store: a Vite + React storefront with an Express API
and PostgreSQL. Everything runs from one Compose service so source edits are live.

## Run it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web entry point: http://localhost:3000 (Vite dev server, host `0.0.0.0`, port 3000).
- API: port 4000 inside the container; Vite proxies `/api` → `http://127.0.0.1:4000`.
- `scripts/dev.mjs` starts `node --watch server/index.js` and Vite together.
- `node_modules` lives in the `evora_node_modules` volume and is installed on each
  container start (`npm install`, lockfile-free project).

## Database

- Postgres 16 (`db` service), credentials are local development values in the compose file.
- `server/db.js` holds the schema (`CREATE TABLE IF NOT EXISTS`, applied on every API boot).
- `server/seed.js` seeds 10 categories, 20 products, 3 collections, discount codes,
  4 sample orders and two accounts. It is idempotent: it only inserts catalogue data when
  `products` is empty.
- To start from a clean catalogue: `docker compose -f docker-compose.base44.yml down -v`
  (this also deletes the database volume).

## Accounts (development seed)

| Role     | Email                        | Password     |
| -------- | ---------------------------- | ------------ |
| Admin    | admin@evorastyle.com         | `Evora2026!` |
| Customer | james.whitfield@example.com  | `Evora2026!` |

The same details are shown on the sign-in page. Change them before any real deployment.

## Auth and identity

- Sessions: random token in the httpOnly `evora_sid` cookie, stored in `sessions`.
- Guests get an `evora_guest` cookie so the bag and wishlist work before signing in;
  `mergeGuestData()` moves both onto the account at login/registration.
- `requireAdmin` guards every `/api/admin/*` route (customer → 403, anonymous → 401) and
  `ProtectedRoute` guards `/admin` in the client.

## Payments — deliberately not connected

There is no payment provider. `POST /api/orders` always records the order as
`awaiting_confirmation` with `payment_status = 'not_charged'`, and the UI says so at
cart, checkout and confirmation. Do not add fake "payment successful" states; wiring
Stripe means adding a real provider checkout step and a webhook that flips
`payment_status`.

## Images

Product and editorial photography is served from Unsplash URLs stored in the database
(`product_images`) and `src/data/images.js`. No object storage is connected, so the admin
product editor accepts image URLs rather than file uploads.

## Sandbox / preview specifics

- `vite.config.js` appends the sandbox host and public host to `allowedHosts` only when
  `BASE44_PREVIEW_MODE === '1'`; with the flag unset behaviour is the plain Vite default.
- Compose passes `BASE44_*` variables through and maps host port 3000 to the dev server.
- Health check probes both processes: `GET /` (Vite) and `GET /api/health` (API + database).

## Verifying a change

1. `curl -s http://localhost:3000/` returns the app shell, `curl -s http://localhost:3000/api/health`
   returns `{"ok":true}`.
2. Storefront flows: home → category → product → add to bag → cart → checkout → confirmation.
   Checkout creates a real order row; delete it afterwards (`orders` + `order_items` cascade,
   and restore `products.stock` if you changed it).
3. Admin: sign in as the seeded admin, then `/admin` (dashboard, products, orders, customers, store).
4. API smoke tests: `/api/products`, `/api/products/:slug`, `/api/auth/login`,
   `/api/admin/stats` (403 as a customer).

## Gotchas

- Cart and wishlist are server-side; the client never stores them in localStorage
  (only the recently-viewed list and the remembered discount code).
- `on conflict` targets for `cart_items` / `wishlist_items` must repeat the partial index
  predicate (`WHERE user_id IS NOT NULL`).
- Order totals are computed server-side from the persisted cart; the client only displays them.
- The home hero is a single scroll timeline: the pinned hero panel (`Hero.jsx`), the fixed
  cut-out figure and the shop wrapper (`relative z-10 bg-ivory` in `Home.jsx`, which scrolls
  over the hero) all read `window.scrollY`. The figure flies to whatever carries
  `data-hero-merge-target` — currently the collection portrait in `EditorialBanner` — so
  moving that attribute moves the landing spot, and removing it leaves the shop in place with
  no flight.
- The timeline is measured, not sampled: `measure()` caches the mark, the panel height, the
  portrait box and the landing scroll, and `paint()` reads only `window.scrollY`. Two rules
  keep it steady on Chrome Android, where the toolbar grows and shrinks the viewport mid-scroll:
  nothing in the flight may read `window.innerHeight` (it changes with the toolbar, which used
  to re-time the animation under the user's finger), and document offsets come from
  `docTop()`'s `offsetTop` chain, never from `getBoundingClientRect().top + scrollY` (a fling
  leaves `scrollY` a frame behind the rects, which threw the figure thousands of pixels off).
  Geometry is re-measured only through the coalesced `relayout()`, so a scroll frame does one
  read and one transform write.
- The phones' hero panel pins under the header (`top: var(--header-h)`,
  `h-[calc(100svh-var(--header-h))]`) because its column composition is designed for the
  pinned state; `Header.jsx` publishes `--header-h` from a `ResizeObserver` (written in its own
  frame — styling inside the callback queues another notification). Consumers fall back to
  `0px`, and `lg` keeps the original full-viewport `sticky top-0 h-[100svh]` pin.
- The hero has two compositions of the same scene: phones (below `lg`) put the copy, the
  figure and the footer row in one flex column so a short screen shrinks the figure instead
  of letting it reach the copy; `lg` and up keep the absolute composition. Both expose a
  mark element and the scroll code uses whichever one is rendered, so keep both refs.
- The pinned panel is sized in `svh`, not `vh`/`dvh`: the small viewport is the one height
  that does not change when Android Chrome hides its toolbar, so the pinned scene never
  jumps mid-scroll (a `dvh` panel changes the document height and shifts everything below it
  every time the toolbar moves). Layout shifts are handled by re-measuring in a
  `ResizeObserver` instead. The hero's mark and the phone composition therefore also use
  `svh`/percentages of the panel, never `dvh`.
