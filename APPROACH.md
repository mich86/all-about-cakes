# All About Cakes — Technical Approach

## Overview

A full-stack CRUD web application for browsing and submitting favourite cakes, built iteratively from scaffolding through to a production deployment with PWA support.

---

## Tech Stack

| Concern         | Choice                  | Rationale                                                                             |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router) | Server Components, built-in routing, API Route Handlers, and Vercel-native deployment |
| Language        | TypeScript              | Type safety across the full stack — shared types between API and UI                   |
| Database        | Supabase (PostgreSQL)   | Managed Postgres with a REST/realtime client, no server infrastructure to maintain    |
| Styling         | Tailwind CSS v4         | Utility-first, co-located with markup, no context switching                           |
| Validation      | Zod                     | Schema-based validation shared between server (API routes) and client (form feedback) |
| Deployment      | Vercel                  | Zero-config Next.js hosting, automatic HTTPS, global CDN                              |
| Package manager | npm                     | Default, no additional tooling overhead                                               |

---

## Architecture

### Component structure — Atomic Design

Components are organised following Atomic Design principles:

- **Atoms** — smallest primitives: `Button`, `Heading`, `PageContainer`, `PageHeader`, `ServiceWorkerRegistration`, and all form primitives (`Input`, `Textarea`, `Select`, `Label`, `Legend`, `FieldError`)
- **Molecules** — composed of atoms: `CakeCard`
- **Organisms** — complex components with their own state: `AddCakeForm`

This structure makes components easy to locate, test in isolation, and reuse without introducing hidden dependencies.

### Data flow

The Next.js App Router is used throughout. Server Components fetch data directly from Supabase (no HTTP round-trip through the app's own API routes), and Route Handlers expose the RESTful API for client-side mutations:

```
Browser
  └── Server Component (page.tsx)
        └── service layer (lib/cakes/service.ts)
              └── Supabase client → PostgreSQL

Browser
  └── Client Component (AddCakeForm.tsx)
        └── fetch POST /api/cakes
              └── Route Handler (app/api/cakes/route.ts)
                    └── service layer → Supabase
```

### Caching strategy

After any mutation (create, update, delete), `revalidatePath` is called server-side inside the Route Handler. This purges Next.js's Full Route Cache for the affected paths so the next page render always reflects the latest data — no stale UI after adding or editing a cake.

### API

A RESTful API is exposed via Next.js Route Handlers:

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/cakes`     | Fetch all cakes   |
| GET    | `/api/cakes/:id` | Fetch single cake |
| POST   | `/api/cakes`     | Create a cake     |
| PUT    | `/api/cakes/:id` | Update a cake     |
| DELETE | `/api/cakes/:id` | Delete a cake     |

### Validation

Zod schemas are defined once in `lib/cakes/validation.ts` and used in both the Route Handler (server-side) and surfaced as field errors back to the form (client-side). Validation rules:

- **Name** — required, must be unique
- **Comment** — required, min 5 characters, max 200 characters
- **Image URL** — required, must be a valid URL
- **Yum Factor** — required, integer between 1 and 5

---

## Progressive Web App (PWA)

PWA support was added without any additional packages, using Next.js 16's built-in metadata APIs:

- **Web manifest** (`app/manifest.ts`) — name, short name, `display: standalone`, theme colour, icons. Makes the app installable from the browser.
- **Icons** — `app/icon.tsx` (32×32 favicon) and `app/apple-icon.tsx` (180×180 Apple touch icon) generated at build time using Next.js's `ImageResponse` API.
- **Service worker** (`public/sw.js`) — registered client-side via a `'use client'` component. Strategy:
  - API routes (`/api/*`) — always network, never cached
  - Navigation requests — network-first with offline fallback
  - Static assets — cache-first for performance
- **Meta tags** — `themeColor` via the `Viewport` export in `layout.tsx`, plus `appleWebApp` capable meta for iOS home screen support.

Verified locally: Chrome's "Install Favourite Cakes" prompt appeared in the address bar, confirming all PWA eligibility criteria were met.

A Lighthouse audit was run against the production Vercel deployment. The results (`lighthouse-score.png` in the repo root) show 100% scores across Performance, Accessibility, Best Practices, and SEO.

---

## Database — Supabase

- Hosted PostgreSQL via Supabase
- Row Level Security (RLS) enabled on the `cakes` table with explicit policies for the `anon` role (SELECT, INSERT, UPDATE, DELETE with `USING (true)`)
- The `anon` key is used server-side — appropriate for a public app with no authentication requirement
- Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) stored in `.env.local` locally and as Vercel environment variables in production

---

## What I Would Do Differently in a Team / Production Context

### CI/CD pipeline

For a solo tech test, pushing directly to `main` with Vercel auto-deploying is acceptable. In a team project:

- **Feature branches** — all work done on short-lived feature branches, never directly on `main`
- **Pull requests** — code reviewed before merge; PRs are the gate
- **CI on PRs** — Lighthouse, linting (`eslint`), type checking (`tsc --noEmit`), and unit/integration tests must all pass before a PR can be merged
- **Branch protection** on `main` — direct pushes blocked; merges require passing status checks
- **Vercel preview deployments** — each PR gets its own preview URL for stakeholder review
- **Production deploy** — triggered only on merge to `main` after all checks pass

### Testing

No automated tests were written for this project due to time constraints. In production I would add:

- **Unit tests** — validation logic (`lib/cakes/validation.ts`), utility functions
- **Component tests** — React Testing Library for form behaviour, error states, and accessibility
- **Integration/API tests** — Route Handler responses for all CRUD operations
- **E2E tests** — Playwright or Cypress covering the critical user journeys (view cakes, add cake, view detail)

### Authentication

The current setup allows anyone to add, edit, or delete cakes. In a real product:

- Add user authentication (e.g. Supabase Auth or Clerk)
- Update RLS policies to scope mutations to the authenticated user (`USING (auth.uid() = user_id)`)
- Add a `user_id` column to the `cakes` table

### Error monitoring

Add Sentry or a similar tool for production error tracking — currently errors are only visible in Vercel function logs.

### Accessibility audit

A full automated and manual accessibility audit (axe, screen reader testing) would be part of the definition of done for each feature.

---

## Potential Improvements

### User accounts and ownership

Currently the app is fully public — anyone can add, edit, or delete any cake. A natural next step would be to introduce user authentication so that:

- Users register and log in (e.g. via Supabase Auth or a provider like Google/GitHub OAuth)
- Each cake is associated with the user who submitted it via a `user_id` column
- Edit and delete actions are only available to the cake's owner
- Supabase RLS policies are updated to enforce ownership at the database level (`USING (auth.uid() = user_id)`) rather than relying on application-level checks

This would turn the app from a shared public board into a personalised list where users manage their own submissions.

### Design system foundations

The component structure follows Atomic Design, but if a proper design handoff were involved (e.g. from Figma) the codebase would benefit from a more formalised design token layer:

- **Design tokens** — colours, spacing, typography, border radius, and shadow values defined as CSS custom properties or a Tailwind theme extension, rather than inline utility classes. This creates a single source of truth that mirrors the design file.
- **Themes** — light/dark mode support via CSS variables toggled by a theme context or `prefers-color-scheme` media query
- **Typography scale** — the `Heading` component already separates semantic level from visual size and weight, which aligns with a token-driven approach. The next step would be to drive those values from design tokens rather than hardcoded Tailwind classes.
- **Component variants** — the `Button` component has `primary` and `outline` variants. A design system would expand this with a full variant/size matrix documented in Storybook or a similar component explorer.

### Edit cake

The API already supports `PUT /api/cakes/:id` but there is no edit UI. An edit page at `/cakes/:id/edit` with a pre-populated form would complete the full CRUD experience for the user.

---

## Tooling

Development was done in [Cursor](https://cursor.sh/) with an AI coding assistant. An `AGENTS.md` file is included in the repo root — this contains instructions for AI agents about the specific Next.js version in use (Next.js 16, which has breaking changes from previous versions). This ensures any AI tooling reads the correct documentation before generating code rather than relying on potentially outdated training data.

---
