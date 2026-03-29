# Portkey

A travel planning app with multi-user trip collaboration, AI-powered smart search, and real-time sync.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Components | shadcn/ui (copied into `src/components/ui/`) |
| Server state | TanStack Query |
| Database / Auth | Supabase (PostgreSQL + Realtime + RLS + Google OAuth) |
| AI | Google Gemini API (`@google/generative-ai`) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with OAuth credentials
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Install and run

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build       # Production build
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login page
│   ├── auth/callback/    # Supabase OAuth callback
│   ├── (dashboard)/      # Protected routes
│   │   ├── trips/        # Trip list & creation
│   │   ├── trips/[id]/   # Trip detail (real-time)
│   │   └── search/       # Smart search
│   └── api/
│       ├── trips/        # Trip CRUD API routes
│       └── search/       # AI search endpoint
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── trips/
│   ├── hotels/
│   ├── flights/
│   └── places/
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Browser client (Client Components)
│   │   └── server.ts     # Server client (Server Components / API routes)
│   └── gemini.ts
├── hooks/
│   ├── use-trip.ts       # TanStack Query trip hooks
│   ├── use-realtime.ts   # Supabase Realtime hooks
│   └── use-auth.ts
└── styles/
    └── globals.css       # Design tokens (CSS custom properties)
middleware.ts             # Auth session refresh on every request
```

## Architecture

### Auth

Supabase Auth with Google OAuth. `middleware.ts` refreshes the session on every request. Two separate Supabase clients exist — use `client.ts` in Client Components and `server.ts` in Server Components, Server Actions, and API routes.

### Data model

Five tables: `profiles`, `trips`, `trip_members`, `hotels`, `flights`, `places`.

- `profiles` mirrors `auth.users` via a Postgres trigger — all app FKs reference `profiles.id`
- `trip_members` roles: `owner` / `editor` / `viewer`
- `numeric` for prices (no float rounding errors), `timestamptz` for all timestamps
- `flights` stores `originTz` / `destinationTz` (IANA strings) for correct local time display
- Every entity table has a `tsvector search_index` column for full-text search, populated by trigger
- RLS ensures users only access trips they are a member of

### Smart search (tiered)

1. **Tier 1** — Postgres full-text search on `search_index` columns (pre-filter, capped at 50 rows)
2. **Tier 2** — Gemini receives only the Tier 1 result set and returns `{ matchedEntityIds, type, rationale }` structured JSON. The UI always renders from the DB using returned IDs — never from model-generated text.

### Real-time collaboration

Trip detail pages subscribe to Supabase Realtime channels scoped by `trip_id`. On any INSERT / UPDATE / DELETE, all connected collaborators receive the event and the TanStack Query cache is updated via `queryClient.setQueryData()`.

## Design System: "The Tactile Wanderer"

A premium linen-bound field journal aesthetic — editorial layouts, organic warmth.

Design tokens live in three synchronized places:

1. `src/styles/globals.css` — CSS custom properties (source of truth)
2. `tailwind.config.ts` — maps CSS vars to Tailwind utility classes
3. `.cursor/rules/design.mdc` — full spec for AI agents

Key rules enforced across all UI:

- **No borders for layout** — use background color shifts or negative space instead of `1px solid` dividers
- **No pure black** — all dark text uses `--on-surface` (`#1b1c1c`)
- **Rounded corners everywhere** — every interactive element uses at least `rounded-xl` (0.75rem)
- **Terracotta = CTA only** — `--secondary` (`#8d4e2d`) is reserved for actionable CTAs, never decorative
- **Depth via tonal layering** — elevation from surface color contrast, not heavy shadows
- **Glassmorphism nav** — 80% `--surface` opacity + `backdrop-blur-[20px]`

Fonts: **Epilogue** (headlines) + **Manrope** (body/labels) from Google Fonts.
