# Agency Site

Multi-tenant agency marketing site built with **Next.js 14 (App Router)**, **Supabase**, and **TanStack Query**.

Each agency is resolved by host (production subdomain or local `?host=` preview). Theme/content comes from `agency_site_theme`; listings, bookings, auth, and newsletter go through a **service layer** — pages and components must not call `supabase.from(...)` directly.

Use this README as the source of truth for architecture when adding or changing modules (including AI-assisted work).

---

## Quick start

```bash
npm install
npm run dev
```

Local preview (required — without a host the app falls back to defaults):

```text
http://localhost:3000/?host=tourvision.mountspeak.com
```

Also supported:

```text
http://localhost:3000/tourvision.mountspeak.com
http://localhost:3000/tourvision.mountspeak.com/about-us
```

Middleware stores the preview host in a cookie and keeps `?host=` on later navigations.

### Env

| Variable                               | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon / publishable key |

Validated in `src/env/client.ts` via Zod. Import as `@/env` / `@/env/client`.

---

## High-level architecture

```text
Request
  → middleware (preview host + Supabase session)
  → App Router page (server)
      → loadAgencyContext() / service fns (server supabase)
      → UI components
  → Client interactions
      → *.query.ts (TanStack Query) → *.service.ts (client supabase)
```

**Rules of thumb**

1. **Data access lives in `src/services/*` only.** Pages/components call services or query hooks.
2. **Server pages** use `createServerSupabase()` and pass `{ supabase }` into services.
3. **Client mutations/reads** use `supabase` from `@/lib/supabase/supabase.client` inside `*.query.ts` / `*.service.ts`.
4. **Agency context** (theme, `agencyId`, specializations, listings bundle) comes from `loadAgencyContext()`.
5. **UI width** uses the shared `.site-container` class — do not invent new `max-w-6xl px-4` stacks.
6. **Templates** are gated by `useTemplateVariant()` (`classic` today). New section UIs should early-return when the variant is unsupported.
7. **`marketing-example/`** is reference-only and excluded from TypeScript (`tsconfig.json`). Do not import from it in app code.

---

## Folder map

```text
src/
  app/                 # Next.js routes (thin pages)
  assets/              # fonts, globals.css, SVG icons
  components/          # UI by domain (home, layout, booking, …)
  constants/           # static datasets (e.g. world countries)
  content/             # JSON defaults (homepage-defaults.json)
  env/                 # Zod-validated env
  hooks/               # shared React hooks
  lib/                 # infra helpers (supabase, host, media, messages, …)
  services/            # domain services (the data layer)
  middleware.ts        # session + agency preview host
```

### `src/app` — routes

| Route                                   | Role                                        |
| --------------------------------------- | ------------------------------------------- |
| `/`                                     | Homepage (CMS sections + featured listings) |
| `/tours`, `/packages`                   | Listing grids by specialization             |
| `/tours/[slug]`                         | Domestic tour detail                        |
| `/search`                               | Filterable search (apply on Search click)   |
| `/booking`                              | Tour booking wizard (domestic)              |
| `/booking/request`                      | Package / international booking request     |
| `/login`                                | Magic-link auth                             |
| `/auth/callback`                        | Supabase auth callback                      |
| `/account/*`                            | Profile, bookings, saved (auth-guarded)     |
| `/about-us`, `/services`, `/contact-us` | Marketing pages                             |
| `/api/cities`, `/api/countries`         | Small lookup APIs                           |

Pages should stay thin: load context → call services → render components.

### `src/services` — data layer (required pattern)

Each domain folder typically has:

```text
domain/
  domain.types.ts      # DTOs / records
  domain.service.ts    # supabase + business logic
  domain.query.ts      # client TanStack Query hooks (when needed)
  domain.mappers.ts    # optional row → UI mapping
```

**Existing domains**

| Service            | Responsibility                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `agency`           | Resolve theme by host from `agency_site_theme`; merge defaults; expose `agencyId` + page |
| `specialization`   | Agency plan capabilities (which kinds/tabs to show)                                      |
| `listings`         | Tours / umrah packages / international listings + tour detail + package titles           |
| `auth`             | Magic link sign-in / session helpers                                                     |
| `tour-bookings`    | Domestic tour booking submit + uploads                                                   |
| `booking-requests` | Package / international / homepage inquiry inserts                                       |
| `agency-payment`   | Agency payment method for booking wizard                                                 |
| `user-bookings`    | Logged-in user’s bookings                                                                |
| `user-profile`     | Profile read/update                                                                      |
| `saved-listings`   | Client localStorage saved/bookmarked listings                                            |
| `subscribe`        | Newsletter → `subscribe` table                                                           |
| `cities`           | Pakistan cities + countries helpers                                                      |

**Do not** put `supabase.from(...)` in `app/` or presentational components. Add a service method and call it.

Example (server page):

```ts
const title = await getPackageListingTitle({
  supabase: createServerSupabase(),
  agencyId: homepage.agencyId,
  kind: "umrah",
  id,
});
```

Example (client hook):

```ts
// subscribe.query.ts
export function useCreateSubscription() {
  return useMutation({
    mutationFn: (payload) =>
      subscribeService({ supabase }).createSubscription(payload),
  });
}
```

### `src/components` — UI

| Area               | Notes                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| `layout/`          | `SiteHeader`, `SiteFooter` — branding, nav, CMS contact, newsletter, social icons |
| `home/sections/`   | Classic homepage sections; respect `useTemplateVariant()`                         |
| `pages/`           | Shared shells (`MarketingPageShell`, search/listing/contact content)              |
| `booking/`         | Tour wizard + booking request form                                                |
| `account/`         | Account shell, panels, profile menu                                               |
| `listings/`        | Cards + save button                                                               |
| `tours/`           | Tour detail content                                                               |
| `auth/`            | Login / split shell                                                               |
| `ui/`              | Shared primitives (`Select`, `DateField`, `PhoneNumberInput`, …)                  |
| `links/AgencyLink` | Internal links that preserve preview `?host=`                                     |

### `src/lib` — infra

| Path                               | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| `lib/site/load-agency-context.ts`  | Preferred server entry: host + homepage + capabilities + listings |
| `lib/host/*`                       | Request host, preview cookie/header, site URL candidates          |
| `lib/supabase/*`                   | Browser client, server client, middleware session                 |
| `lib/media/resolve-theme-asset.ts` | Turn CMS storage paths into public URLs                           |
| `lib/templates/resolve-variant.ts` | Map `templateId` → `classic` (etc.)                               |
| `lib/messages/*`                   | Stable `MessageCode` + user-facing strings                        |
| `lib/api/errors.ts`                | Normalize Supabase/API errors                                     |
| `lib/validation/phone.ts`          | E.164 phone helpers                                               |
| `lib/booking/*`                    | Booking href builders / pricing helpers                           |

### Layout / CSS

- Global styles: `src/assets/globals.css`
- Shared container:

```css
.site-container {
  @apply mx-auto w-full max-w-6xl px-4 md:px-6;
}
```

Use `className="site-container"` (plus grid/flex utilities) for header, footer, and section content. Put rounded cards **inside** the container, not on the same node as `site-container`, so padding does not misalign edges.

---

## Agency resolution & theme

1. Middleware sets agency host from `?host=`, path segment, or cookie.
2. `getRequestHost()` reads that host on the server.
3. `getAgencyContent({ supabase, host })` loads `agency_site_theme` by matching `site_url` candidates.
4. Theme JSON is normalized: missing `templateId` → `classic`; sections/branding/footer merged with `src/content/homepage-defaults.json`.
5. **Always keep `row.agency_id`** when a theme row exists (never fall back to `'default'` agency id if a row matched).

CMS footer shape (contact + socials) is consumed by `SiteFooter`:

```json
"footer": {
  "logo": { "src": "...", "alt": "..." },
  "columns": [{ "title": "Contact", "items": [{ "label": "...", "href": "tel:..." }] }],
  "socialLinks": { "instagram": "...", "facebook": "...", "twitter": "", "linkedin": "" },
  "backgroundColor": "#043263"
}
```

Newsletter payload:

```ts
{ agency_id, email, status: 'SUBSCRIBED' } // → table `subscribe`
```

---

## Specializations & listings

Capabilities (`specialization` service) decide:

- which kinds exist: `tours` | `packages` | `international`
- whether tabs show
- default kind for hero/search

Listings are mapped into a shared `ListingItem` shape. Domestic tours book via `/booking?tour=…`; umrah/international use `/booking/request?kind=…&id=…`.

---

## Auth

- Magic link from `/login` (`auth.service` + Supabase).
- Callback: `/auth/callback`.
- Account routes under `/account/*` expect a session; redirect to login with `next` when unauthenticated.
- Header shows `ProfileMenu` when `useOptionalUser()` has a user.

---

## Booking flows

| Flow                    | Entry                                  | Persist                                            |
| ----------------------- | -------------------------------------- | -------------------------------------------------- |
| Domestic tour           | Tour detail / booking CTA → `/booking` | `tour-bookings` service / RPC + ID/payment uploads |
| Package / international | Listing CTA → `/booking/request`       | `booking_requests`                                 |
| Homepage “Book a Tour”  | `ContactLead`                          | Same booking request form                          |

Phone fields use `PhoneNumberInput` + `isValidE164Phone`. Prefer service functions for uploads and inserts.

---

## Templates

Dashboard `SITE_TEMPLATES` → site UI:

| Dashboard | `templateId` | Code variant | UI |
|---|---|---|---|
| **Classic** (`mount-temp-1`) | `jedw-cwe-cw` | `temp1` | Full-bleed hero slider + teal marketing (mockup) |
| **Studio** (`mount-temp-2`) | `ab12-cd34-ef` | `temp2` | Cream asymmetric / pill chrome |
| **Modern** (`mount-temp-3`) | `gh56-ij78-kl` | `temp3` | Full-width hero, destination thumbs, floating search, Modern trust |

- Resolved in `src/lib/templates/resolve-variant.ts` from `page.templateId`.
- Bare `http://localhost:3000` (no `?host=`) always uses **Classic / temp1** defaults.
- Agency preview: `http://localhost:3000/?host=youragency.mountspeak.com` (keep `?host=` in the URL; cookie no longer auto-restores preview).
- Section branches: `if (variant === 'temp1')` … `if (variant === 'temp2')` … `if (variant === 'temp3')` … `return null`.
- Modern currently ships dedicated Hero (no search bar; fade/zoom slides), Trust, and About (Intro); other homepage sections reuse Classic UI until dedicated layouts ship.
- Hero filters (Classic + Studio): category, from, to, start date, end date.

---

## Adding a new module (checklist)

1. **Types** — `src/services/<domain>/<domain>.types.ts`
2. **Service** — `src/services/<domain>/<domain>.service.ts`
   - Accept `{ supabase }` (and `agencyId` when scoped).
   - Throw via `toApiError(..., MessageCode.*)`.
   - Add message codes in `src/lib/messages/codes.ts` if needed.
3. **Client hooks** (if client-driven) — `<domain>.query.ts` with TanStack Query.
4. **UI** — components under `src/components/<area>/`; reuse `site-container`, `AgencyLink`, existing UI primitives.
5. **Route** — thin `src/app/.../page.tsx` that calls `loadAgencyContext()` and/or the new service.
6. **Never** query Supabase tables from the page/component body.

### Modifying an existing feature

1. Find the owning service under `src/services/`.
2. Change mapping/validation there first.
3. Update the component only for presentation.
4. Keep preview host working (`AgencyLink`, middleware cookie).
5. Pass `agencyId` into footers/forms that write agency-scoped rows.

---

## Important conventions

- Path alias: `@/*` → `src/*`
- Prefer server components for data loading; mark interactive UI with `'use client'`.
- Toasts: `sonner`; errors: `getApiErrorMessage(error, MessageCode.…)`
- Icons: project SVGs in `src/assets/svg/**` for brand/social/menu; Lucide for generic UI icons only when available.
- Saved listings are **client localStorage** (`saved-listings`), not a Supabase table.
- Do not commit `.next/` or secrets.

---

## Scripts

```bash
npm run dev      # local Next.js (use http, not https)
npm run build    # production build
npm run start    # serve build
npm run lint     # ESLint
```

---

## AI / contributor context (short)

When extending this codebase:

- Treat **services** as the only persistence boundary.
- Resolve agency via **host + `loadAgencyContext` / `agency.service`**.
- Respect **specialization capabilities** before showing tours vs packages.
- Use **`.site-container`** for page width.
- Gate new homepage/layout variants with **`useTemplateVariant`**.
- Preserve **`?host=` preview** behavior for local multi-tenant testing.
