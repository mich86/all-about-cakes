# All About Cakes

A simple CRUD web app for viewing and submitting favourite cakes.

**Live demo:** TODO

## Features

- Browse all cakes (image + name)
- View cake details (comment and yum factor)
- Add a new cake with server-side validation
- Responsive layout for mobile and desktop
- REST API backed by Supabase

## Tech stack

| Tool | Version |
| ---- | ------- |
| Next.js | 16.2.9 |
| React | 19.2.4 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Supabase JS client | 2.108.2 |
| Zod | 4.4.3 |
| ESLint | 9 (via `eslint-config-next`) |
| Prettier | 3.8.4 |

Package manager: **npm**

## Getting started

### Prerequisites

- Node.js 20.9+ (required by Next.js 16)
- A Supabase project with a `cakes` table (see below)

### Setup

```bash
git clone git@github.com:mich86/all-about-cakes.git
cd all-about-cakes
npm install
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # production build
npm run start   # run production build locally
npm run lint    # ESLint (from create-next-app — eslint.config.mjs)
```

Prettier is also configured (`.prettierrc`) but has no npm script — format on save in your editor, or run `npx prettier --write .` manually.

## Supabase table

```sql
create table cakes (
  id bigint generated always as identity primary key,
  name text not null unique,
  comment text not null,
  "imageUrl" text not null,
  "yumFactor" integer not null check ("yumFactor" between 1 and 5),
  created_at timestamptz default now()
);
```

## API

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | `/api/cakes`   | List all cakes           |
| POST   | `/api/cakes`   | Create a cake            |
| GET    | `/api/cakes/:id` | Get one cake           |
| PUT    | `/api/cakes/:id` | Update a cake (API only — no UI) |
| DELETE | `/api/cakes/:id` | Delete a cake (API only — no UI) |

PUT and DELETE are implemented in `app/api/cakes/[id]/route.ts`. The UI only calls GET and POST. You can test the full API with curl, e.g. `curl -X DELETE http://localhost:3000/api/cakes/1`.

## Validation

- **Name** — required, unique
- **Comment** — required, 5–200 characters
- **Image URL** — required (plain text field)
- **Yum factor** — required, 1–5

Invalid fields return error messages displayed below the relevant form field.

## Deployment

Deploy to Vercel (or similar). Set the same environment variables as `.env.local` in your hosting dashboard.

Optional: set `NEXT_PUBLIC_APP_URL` to your production URL if server-side fetches need an explicit base URL.
