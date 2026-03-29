# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portkey** — a travel planning app with multi-user trip collaboration, AI-powered smart search, and real-time sync. The project is currently in the **planning/scaffolding phase** — no source code exists yet. The full tech stack plan is in `.plans/initialPlan.plan.md`.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** with CSS custom properties as design tokens
- **shadcn/ui** — components copied into `src/components/ui/` (not a dependency)
- **TanStack Query** for server state (caching, optimistic updates)
- **Supabase** — PostgreSQL + Realtime + Auth (Google OAuth) + RLS
- **Google Gemini API** (`@google/generative-ai`) for smart search
- **Vercel** for deployment

## Commands

Once scaffolded, standard commands will be:

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # tsc --noEmit
```

## Architecture

### App Router Structure

```
src/app/
  (auth)/           # Login page
  auth/callback/    # Supabase OAuth callback
  (dashboard)/      # Protected routes (trips/, trips/[id]/, search/)
  api/trips/        # Trip CRUD API routes
  api/search/       # AI search endpoint
```

### Supabase Client Patterns

Two separate clients — use the right one for the context:
- `src/lib/supabase/client.ts` — browser client (Client Components)
- `src/lib/supabase/server.ts` — server client (Server Components, Server Actions, API routes)
- `middleware.ts` at root — refreshes auth session on every request

### Data Model

Five tables: `profiles`, `trips`, `trip_members`, `hotels`, `flights`, `places`.

Key decisions:
- `profiles` mirrors `auth.users` via a Postgres trigger — all app FKs point to `profiles.id`
- `trip_members` has roles: `owner` / `editor` / `viewer`
- `numeric` for price (not float), `timestamptz` for all timestamps
- `flights` stores `originTz` / `destinationTz` (IANA strings) for correct local time display
- Every entity table has a `tsvector search_index` column for full-text search, populated by trigger

RLS enforces that users only access trips they are a member of.

### Smart Search (Tiered)

1. **Tier 1** — Postgres full-text search on `search_index` columns (pre-filter, capped at 50 rows)
2. **Tier 2** — Gemini receives only the Tier 1 result set and returns `{ matchedEntityIds, type, rationale }` structured JSON — the UI always renders from DB using returned IDs, never from model-generated text

### Real-Time Collaboration

Trip detail pages subscribe to Supabase Realtime channels scoped by `trip_id`. On any INSERT/UPDATE/DELETE, all connected collaborators receive the event and the TanStack Query cache is updated via `queryClient.setQueryData()`.

## Design System: "The Tactile Wanderer"

**Aesthetic**: Premium linen-bound field journal — editorial layouts, organic warmth. Not a utility UI.

### Strict Rules

- **No-Line Rule**: No `1px solid` borders for sectioning — use background color shifts or negative space
- **No-Black Rule**: Never use `#000000` — all dark text uses `--on-surface` (`#1b1c1c`)
- **No-Sharp-Corners Rule**: Every interactive element uses at least `rounded-xl` (`0.75rem`)
- **No-Dividers Rule**: Increase spacing instead of adding separator lines
- **Secondary = CTA only**: Terracotta (`--secondary`, `#8d4e2d`) is reserved exclusively for actionable CTAs ("Book Now") — never decorative
- **Elevation via tonal layering**: Depth from surface color contrast, not heavy shadows. Shadows: 32px blur, 8px Y-offset, 4% opacity
- **Glassmorphism**: Floating nav uses 80% `--surface` opacity + `backdrop-blur-[20px]`

### Design Token Locations (three synchronized places)

1. `src/styles/globals.css` — CSS custom properties (source of truth)
2. `tailwind.config.ts` — maps CSS vars to Tailwind utility classes
3. `.cursor/rules/design.mdc` — full spec for agents

### Color Usage

```
bg-surface                   # base page background (#fbf9f8)
bg-surface-container-lowest  # active cards / lifted elements (#ffffff)
bg-surface-container-high    # input field backgrounds
text-on-surface              # primary text
text-on-surface-variant      # secondary/muted text
bg-primary                   # forest green (#506147)
bg-secondary                 # terracotta — CTA buttons only (#8d4e2d)
bg-secondary-fixed           # active chip background (#ffdbcc)
border-outline-variant/15    # ghost borders (15% opacity only)
```

### Typography

- `font-headline` — **Epilogue** (display, headlines, destination names)
- `font-body` — **Manrope** (body text)
- `font-label` — **Manrope** (metadata, dates, prices — use `tracking-[0.05rem]`)

### Component Patterns

- **Primary buttons**: `rounded-xl`, gradient from `--primary` → `--primary-container` at 135deg, hover shifts gradient 45deg, press scales to 0.98
- **Cards**: `bg-surface-container-lowest`, no dividers, `p-4`
- **Inputs**: `bg-surface-container-high`, no border or ghost border at 15%, focus halo = `ring-2 ring-primary-fixed/50`
- **Chips**: `rounded-full`, inactive = `bg-surface-container-highest`, active = `bg-secondary-fixed`
- **Floating nav**: Glassmorphism, centered bottom, `rounded-xl`, ambient shadow
