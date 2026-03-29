---
name: TravwlGo Tech Stack
overview: Set up the TravwlGo travel planning app from scratch with a modern Next.js stack, Supabase (PostgreSQL + real-time), Google auth, Gemini AI for smart search, multi-user trip collaboration, a design token system for theming, and comprehensive agent support for Cursor/Claude Code.
todos:
  - id: scaffold
    content: Scaffold Next.js 15 project with TypeScript, Tailwind CSS v4, ESLint, Prettier. Install core dependencies (@supabase/supabase-js, @supabase/ssr, @tanstack/react-query, @google/generative-ai, shadcn/ui, zod, react-hook-form).
    status: pending
  - id: agent-support
    content: "Create .cursor/rules/ (project.mdc, frontend.mdc, design.mdc) and AGENTS.md. design.mdc must include the full 'Tactile Wanderer' spec: no-line rule, no-black rule, no-sharp-corners rule, surface hierarchy, CTA-only secondary color, component patterns, glassmorphism nav, typography hierarchy."
    status: pending
  - id: design-tokens
    content: "Implement 'The Tactile Wanderer' design system: copy DESIGN.md into repo, populate globals.css with full color palette (surface hierarchy, primary forest green, secondary terracotta, on-surface), configure tailwind.config.ts color mapping, import Epilogue + Manrope from Google Fonts, set up typography scale."
    status: pending
  - id: supabase-schema
    content: "Define Supabase database schema (Profile, Trip, TripMember, Hotel, Flight, Place) with: UNIQUE constraints, numeric price + currency, timestamptz, tsvector search indexes, GIN indexes, RLS policies, and profile sync trigger."
    status: pending
  - id: auth
    content: Set up Supabase Auth with Google OAuth provider. Configure middleware for session management.
    status: pending
  - id: trip-crud
    content: "Build trip CRUD pages and API: create trip, view trips, trip detail page with tabs for Hotels/Flights/Places."
    status: pending
  - id: collaboration
    content: "Build trip collaboration: invite members, role-based permissions (owner/editor/viewer), real-time updates via Supabase Realtime subscriptions."
    status: pending
  - id: entity-crud
    content: Build Hotel, Flight, and Place add/edit/delete functionality within each trip with real-time sync.
    status: pending
  - id: smart-search
    content: "Implement tiered search: Tier 1 (Postgres full-text via tsvector as pre-filter) + Tier 2 (Gemini reasoning on filtered results with structured JSON output). Build search API route with Zod validation and search UI page."
    status: pending
  - id: recommendations
    content: Add Gemini-powered trip recommendations feature.
    status: pending
  - id: deploy
    content: Configure Vercel deployment, environment variables, and production Supabase project.
    status: pending
isProject: false
---

# TravwlGo - Tech Stack and Project Setup Plan

## Tech Stack

### Frontend

- *Next.js 15 (App Router)* - React framework with SSR/SSG, API routes, and server actions. Ideal for Vercel deployment.
- *TypeScript* - Type safety across the entire codebase.
- *Tailwind CSS v4* - Utility-first CSS with design token integration via CSS variables.
- *shadcn/ui* - High-quality, accessible component library built on Radix UI. Components are copied into the project (not a dependency), making them fully customizable.
- *TanStack Query (React Query)* - Server state management: caching, background refetching, optimistic updates for trip data. Combined with React built-ins (useState, useContext) for UI-only state. No Redux or Zustand needed.

### Backend / Database

- *Next.js Server Actions + API Routes* - No separate backend server needed.
- *Supabase* - Provides PostgreSQL database, real-time subscriptions, Row Level Security (RLS), and authentication in one platform. Key reasons for choosing Supabase:
  - *Real-time collaboration* - Supabase Realtime broadcasts changes instantly to all trip collaborators.
  - *Row Level Security* - Per-trip access control enforced at the database level, not just app code.
  - *Built-in Auth* - Google OAuth with session management, eliminating the need for NextAuth.
  - *pgvector* - Available as a Postgres extension for future embedding-based semantic search.
- *Supabase client libraries*: @supabase/supabase-js + @supabase/ssr for server-side rendering support in Next.js.

### Authentication

- *Supabase Auth* with Google OAuth provider. Simpler than NextAuth since Supabase handles sessions, tokens, and user management natively. Integrates directly with RLS policies for authorization.

### AI / Smart Search (Tiered Approach)

Search uses a *three-tier architecture*. MVP builds Tier 1 and Tier 2. Tier 3 is added later when data grows.

*Tier 1 -- SQL + Postgres full-text search (MVP)*

- Add tsvector columns on searchable fields (trips.name, trips.destination, hotels.name, flights.origin, flights.destination, places.name, entity notes).
- Handles straightforward queries cheaply and instantly: "San Francisco hotels", "flights to India".
- Always runs first as a *pre-filter* to reduce the data set before calling Gemini.

*Tier 2 -- Gemini reasoning on filtered results (MVP)*

- *Google Gemini API* (@google/generative-ai SDK) receives only the *Tier 1 result set* (not all user data) plus the original query.
- Gemini interprets complex natural-language intent, re-ranks, and returns *structured JSON output*: { matchedEntityIds: string[], type: "hotel"|"flight"|"place"|"trip", rationale: string }.
- The UI renders from the database using the returned IDs -- never from free-form model text. This prevents hallucinated results.
- System prompt instructs Gemini to only reference records present in the provided context and to refuse to reveal API keys or raw data.

*Tier 3 -- pgvector embeddings (Post-MVP)*

- Enable pgvector extension on Supabase.
- Generate embeddings for trip entities on create/update via a background job.
- Replace Tier 1 full-text search with semantic vector similarity for queries where keyword matching falls short.
- Supports cross-trip search ("Where did I eat the best pasta?") at scale without sending large JSON payloads to Gemini.

*Safeguards (MVP)*

- Authenticate every search request (Supabase JWT required).
- Validate search input with Zod (max length, sanitize).
- Tier 1 results are capped (e.g., top 50 rows) before passing to Gemini to control token usage and cost.
- Gemini responses are validated against the structured output schema before rendering.

### Deployment

- *Vercel* - Zero-config deployment for Next.js. Supports serverless functions, edge runtime, preview deployments, and custom domains.

---

## Project Structure


TravwlGo/
├── .cursor/
│   └── rules/               # Cursor agent rules
│       ├── project.mdc       # Overall project conventions
│       ├── frontend.mdc      # Frontend/component rules
│       └── design.mdc        # Design tokens & theme rules
├── AGENTS.md                 # Claude Code agent instructions
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           # Auth routes (login, callback)
│   │   ├── auth/callback/    # Supabase OAuth callback handler
│   │   ├── (dashboard)/      # Protected routes
│   │   │   ├── trips/        # Trip list & creation
│   │   │   ├── trips/[id]/   # Single trip view (with real-time)
│   │   │   └── search/       # Smart search page
│   │   ├── api/              # API routes
│   │   │   ├── trips/        # Trip CRUD
│   │   │   └── search/       # AI search endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── trips/            # Trip-specific components
│   │   ├── hotels/           # Hotel components
│   │   ├── flights/          # Flight components
│   │   └── places/           # Places components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts     # Browser Supabase client
│   │   │   ├── server.ts     # Server-side Supabase client
│   │   │   └── middleware.ts  # Auth session refresh middleware
│   │   ├── gemini.ts         # Gemini AI client
│   │   └── utils.ts          # Shared utilities
│   ├── hooks/
│   │   ├── use-trip.ts       # TanStack Query hooks for trip data
│   │   ├── use-realtime.ts   # Supabase Realtime subscription hooks
│   │   └── use-auth.ts       # Auth state hook
│   ├── styles/
│   │   └── globals.css       # Tailwind + CSS custom properties
│   └── types/
│       ├── database.ts       # Supabase generated types
│       └── index.ts          # Shared app types
├── supabase/
│   ├── migrations/           # SQL migration files
│   └── seed.sql              # Seed data for development
├── public/                   # Static assets
├── middleware.ts              # Next.js middleware (auth session refresh)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example              # Env var template (no secrets)
└── README.md


---

## Data Model (Supabase PostgreSQL Schema)

mermaid
erDiagram
    AuthUsers ||--|| Profile : mirrors
    Profile ||--o{ TripMember : joins
    Trip ||--o{ TripMember : has
    Trip ||--o{ Hotel : has
    Trip ||--o{ Flight : has
    Trip ||--o{ Place : has
    Profile {
        uuid id PK
        text email
        text name
        text avatarUrl
        timestamptz createdAt
    }
    Trip {
        uuid id PK
        uuid createdBy FK
        text name
        text destination
        date startDate
        date endDate
        text notes
        text status
        tsvector searchIndex
        timestamptz createdAt
        timestamptz updatedAt
    }
    TripMember {
        uuid id PK
        uuid tripId FK
        uuid userId FK
        text role
        timestamptz joinedAt
    }
    Hotel {
        uuid id PK
        uuid tripId FK
        uuid addedBy FK
        text name
        text address
        date checkIn
        date checkOut
        numeric price
        text currency
        text notes
        text bookingUrl
        tsvector searchIndex
    }
    Flight {
        uuid id PK
        uuid tripId FK
        uuid addedBy FK
        text airline
        text flightNumber
        text origin
        text destination
        timestamptz departure
        timestamptz arrival
        text originTz
        text destinationTz
        numeric price
        text currency
        text notes
        text bookingUrl
        tsvector searchIndex
    }
    Place {
        uuid id PK
        uuid tripId FK
        uuid addedBy FK
        text name
        text address
        text category
        text notes
        text googleMapsUrl
        text placeId
        float latitude
        float longitude
        tsvector searchIndex
    }




### MVP data model decisions

- *Profile vs auth.users*: public.profiles mirrors auth.users via a Postgres trigger on signup. All app FKs point to profiles.id. This keeps app queries within public schema and avoids direct auth schema references.
- *UNIQUE(trip_id, user_id)* on trip_members prevents duplicate memberships.
- *numeric* for price (not float) avoids floating-point rounding errors. currency column (ISO 4217, default "USD") included from the start since adding it later requires a migration across existing rows.
- *timestamptz* for all timestamps (not timestamp) so times are stored in UTC and render correctly across time zones.
- *originTz / destinationTz* on Flight (IANA timezone strings like "America/New_York") for correct local time display of departures/arrivals.
- *placeId + latitude/longitude* on Place alongside googleMapsUrl for future map features and deduplication.
- *tsvector searchIndex* on Trip, Hotel, Flight, Place for Tier 1 full-text search. Populated via Postgres trigger on insert/update.
- *category* on Place uses a text column for MVP flexibility. A lookup table or enum can be added post-MVP when categories stabilize.

### MVP indexes

sql
CREATE INDEX idx_trip_members_user ON trip_members(user_id);
CREATE INDEX idx_trip_members_trip ON trip_members(trip_id);
CREATE UNIQUE INDEX idx_trip_members_unique ON trip_members(trip_id, user_id);
CREATE INDEX idx_hotels_trip ON hotels(trip_id);
CREATE INDEX idx_flights_trip ON flights(trip_id);
CREATE INDEX idx_places_trip ON places(trip_id);
CREATE INDEX idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_trips_search ON trips USING GIN(search_index);
CREATE INDEX idx_hotels_search ON hotels USING GIN(search_index);
CREATE INDEX idx_flights_search ON flights USING GIN(search_index);
CREATE INDEX idx_places_search ON places USING GIN(search_index);


### TripMember roles

owner (full control, can delete trip, manage members), editor (can add/edit/delete hotels, flights, places), viewer (read-only access).

### Row Level Security

Every table has RLS policies ensuring users can only access data for trips they are a member of. Example policy for Hotels:

sql
CREATE POLICY "Users can view hotels for their trips" ON hotels
  FOR SELECT USING (
    trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
  );


### Post-MVP hardening (not built now, designed for later)

- *Soft delete*: Add deleted_at timestamptz on Trip, Hotel, Flight, Place for undo support and audit trails. Requires updating RLS policies to filter WHERE deleted_at IS NULL.
- *updated_by*: Add to entities for accountability in collaborative editing.
- *Invite system*: trip_invites table with invite_token, expires_at, invited_email, role for email-based invites.
- *File uploads*: Supabase Storage for avatars, receipts, travel photos with per-trip RLS bucket policies.
- *Notifications*: notifications table + Resend/SendGrid for email alerts on trip invites, role changes, entity updates.
- *Place category enum*: Migrate category from free text to a place_categories lookup table once categories are well-defined.
- *Audit log*: activity_feed table tracking who changed what and when, for collaborative transparency.

---

## Design Theme System: "The Tactile Wanderer"

Source specification: DESIGN.md (copied into repo root for reference).

*Creative North Star*: "The Digital Field Journal" -- a premium, linen-bound journal aesthetic with editorial layouts, asymmetric breathing room, and organic warmth. Not a utility spreadsheet.

### Color Palette (Humanist Neutral)

Design tokens live in three synchronized locations:

*1. src/styles/globals.css* - CSS custom properties (source of truth):

css
:root {
  /* ── Surface hierarchy (paper stack, lightest → darkest) ── */
  --surface-container-lowest: #ffffff;   /* active cards, lifted elements */
  --surface: #fbf9f8;                    /* base page background */
  --surface-bright: #fbf9f8;
  --surface-container-low: #f6f3f2;      /* large content areas, itinerary feeds */
  --surface-container: #f0eded;          /* mid-level containers */
  --surface-container-high: #eae8e7;     /* input field backgrounds */
  --surface-container-highest: #e4e2e1;  /* inactive chips, dense surfaces */
  --surface-variant: #e4e2e1;
  --surface-dim: #dcd9d9;
  --surface-tint: #526349;

  /* ── Primary (Forest Green) ── */
  --primary: #506147;
  --on-primary: #ffffff;
  --primary-container: #687a5e;
  --on-primary-container: #f8ffee;
  --primary-fixed: #d5e8c7;             /* focus halos at 50% opacity */
  --primary-fixed-dim: #b9ccad;         /* dark mode surfaces */
  --on-primary-fixed: #111f0b;
  --on-primary-fixed-variant: #3b4b33;

  /* ── Secondary (Terracotta — CTA only, never decorative) ── */
  --secondary: #8d4e2d;
  --on-secondary: #ffffff;
  --secondary-container: #fdaa83;
  --on-secondary-container: #783d1e;
  --secondary-fixed: #ffdbcc;           /* active chip background */
  --secondary-fixed-dim: #ffb693;
  --on-secondary-fixed: #351000;        /* text on secondary-fixed */
  --on-secondary-fixed-variant: #703718;

  /* ── Tertiary (Warm Earth) ── */
  --tertiary: #655a4b;
  --on-tertiary: #ffffff;
  --tertiary-container: #7e7362;
  --on-tertiary-container: #fffbff;
  --tertiary-fixed: #f0e0cc;
  --tertiary-fixed-dim: #d3c4b1;
  --on-tertiary-fixed: #221a0e;
  --on-tertiary-fixed-variant: #4f4537;

  /* ── Error ── */
  --error: #ba1a1a;
  --on-error: #ffffff;
  --error-container: #ffdad6;
  --on-error-container: #93000a;

  /* ── Text ── */
  --on-surface: #1b1c1c;               /* primary text — never use #000000 */
  --on-surface-variant: #444840;        /* secondary/muted text */
  --on-background: #1b1c1c;
  --background: #fbf9f8;

  /* ── Borders & outlines ── */
  --outline: #757870;
  --outline-variant: #c4c8be;           /* ghost borders at 15% opacity only */

  /* ── Inverse (for snackbars, tooltips) ── */
  --inverse-surface: #303030;
  --inverse-on-surface: #f3f0f0;
  --inverse-primary: #b9ccad;
}


*2. tailwind.config.ts* - Maps CSS variables to Tailwind utility classes:

typescript
colors: {
  surface: {
    DEFAULT: 'var(--surface)',
    bright: 'var(--surface-bright)',
    dim: 'var(--surface-dim)',
    tint: 'var(--surface-tint)',
    variant: 'var(--surface-variant)',
    'container-lowest': 'var(--surface-container-lowest)',
    'container-low': 'var(--surface-container-low)',
    container: 'var(--surface-container)',
    'container-high': 'var(--surface-container-high)',
    'container-highest': 'var(--surface-container-highest)',
  },
  primary: {
    DEFAULT: 'var(--primary)',
    container: 'var(--primary-container)',
    fixed: 'var(--primary-fixed)',
    'fixed-dim': 'var(--primary-fixed-dim)',
  },
  secondary: {
    DEFAULT: 'var(--secondary)',
    container: 'var(--secondary-container)',
    fixed: 'var(--secondary-fixed)',
    'fixed-dim': 'var(--secondary-fixed-dim)',
  },
  tertiary: {
    DEFAULT: 'var(--tertiary)',
    container: 'var(--tertiary-container)',
    fixed: 'var(--tertiary-fixed)',
    'fixed-dim': 'var(--tertiary-fixed-dim)',
  },
  error: {
    DEFAULT: 'var(--error)',
    container: 'var(--error-container)',
  },
  'on-primary': { DEFAULT: 'var(--on-primary)', container: 'var(--on-primary-container)', fixed: 'var(--on-primary-fixed)', 'fixed-variant': 'var(--on-primary-fixed-variant)' },
  'on-secondary': { DEFAULT: 'var(--on-secondary)', container: 'var(--on-secondary-container)', fixed: 'var(--on-secondary-fixed)', 'fixed-variant': 'var(--on-secondary-fixed-variant)' },
  'on-tertiary': { DEFAULT: 'var(--on-tertiary)', container: 'var(--on-tertiary-container)', fixed: 'var(--on-tertiary-fixed)', 'fixed-variant': 'var(--on-tertiary-fixed-variant)' },
  'on-error': { DEFAULT: 'var(--on-error)', container: 'var(--on-error-container)' },
  'on-surface': { DEFAULT: 'var(--on-surface)', variant: 'var(--on-surface-variant)' },
  'on-background': 'var(--on-background)',
  background: 'var(--background)',
  outline: { DEFAULT: 'var(--outline)', variant: 'var(--outline-variant)' },
  inverse: { surface: 'var(--inverse-surface)', 'on-surface': 'var(--inverse-on-surface)', primary: 'var(--inverse-primary)' },
}


Usage examples: bg-surface, bg-surface-container-lowest, text-on-surface, text-on-surface-variant, bg-primary, bg-secondary-fixed, text-on-secondary-fixed, border-outline-variant/15 (15% opacity ghost border), bg-error-container, text-on-error-container.

*3. .cursor/rules/design.mdc* - Full design spec for agents, including all rules below.

### Typography

Google Fonts imports: *Epilogue* (display/headlines) + *Manrope* (body/labels/utility).

Tailwind fontFamily config:

typescript
fontFamily: {
  headline: ['Epilogue', 'sans-serif'],
  body: ['Manrope', 'sans-serif'],
  label: ['Manrope', 'sans-serif'],
}


Usage via Tailwind: font-headline for display/headlines, font-body for body text, font-label for metadata.

- display-lg, headline-md -- font-headline (Epilogue), bold sparingly, "Travel Poster" feel for destination names
- title-lg -- font-headline in secondary (terracotta) for section sub-headers, warm rhythmic breaks
- label-md -- font-label (Manrope), increased letter-spacing (0.05rem) for metadata (dates, prices)
- Body text -- font-body (Manrope), all sizes

### Border Radius

Tailwind borderRadius config:

typescript
borderRadius: {
  DEFAULT: '0.25rem',   // 4px — minimum for non-interactive elements
  lg: '0.5rem',         // 8px
  xl: '0.75rem',        // 12px — minimum for interactive elements (per No-Sharp-Corners rule)
  full: '9999px',       // pill shapes for chips
}


Usage: rounded (default 4px), rounded-lg (8px), rounded-xl (12px, buttons/cards), rounded-full (chips).

*Reminder*: The "No-Sharp-Corners" rule mandates every interactive element uses at least rounded-xl (0.75rem). Primary buttons use rounded-xl with the gradient. Chips use rounded-full.

### Strict Design Rules (enforced in .cursor/rules/design.mdc)

*The "No-Line" Rule*: No 1px solid borders for sectioning. Use background shifts or negative space instead.

*The "No-Black" Rule*: Never use #000000. All "black" text uses --on-surface (#1b1c1c).

*The "No-Sharp-Corners" Rule*: Every interactive element uses at least md (0.75rem) radius.

*The "No-Dividers" Rule*: If items are too close, increase spacing rather than adding a line.

*Elevation via Tonal Layering*: Depth comes from surface color contrast, not heavy drop shadows. Ambient shadows use 32px blur, 8px Y-offset, 4% opacity.

*Glassmorphism for Floating Elements*: 80% --surface opacity + 20px backdrop-blur for nav bars and overlays.

*Secondary = CTA Only*: Terracotta (#8d4e2d) is reserved exclusively for actionable highlights ("Book Now", primary CTA).

### Component Patterns

- *Primary Buttons*: rounded-xl (0.75rem), gradient from --primary to --primary-container at 135deg, hover shifts gradient 45deg, press scales to 0.98
- *Planning Cards*: --surface-container-lowest background, no dividers, 1rem internal padding, secondary color only for actionable highlights
- *Input Fields*: --surface-container-high background, no border (or ghost border at 15%), focus halo using --primary-fixed at 50% opacity, 2px
- *Selection Chips*: Pill-shaped, inactive uses --surface-container-highest, active uses --secondary-fixed (#ffdbcc)
- *Floating Navigation*: Glassmorphism bar centered at bottom, xl corners, ambient shadow

### Dark Mode (Post-MVP)

Use --primary-fixed-dim (#b9ccad) for dark mode surfaces to maintain the "Forest" character.

---

## Agent Support

### For Cursor (.cursor/rules/)

Three rule files:

- **project.mdc** - Tech stack, project structure, coding conventions (TypeScript strict mode, Prisma usage patterns, server action patterns, import conventions).
- **frontend.mdc** - Component patterns (use shadcn/ui, Tailwind only - no inline styles, component file structure), form handling with react-hook-form + zod.
- **design.mdc** - Full color palette, typography, spacing, component styling guidelines. This ensures any agent-generated UI matches your brand.

### For Claude Code (AGENTS.md)

Root-level AGENTS.md containing:

- Project overview and tech stack summary
- Directory structure guide
- Design token locations and usage
- Database schema overview
- Key conventions (naming, file structure, patterns)
- How to run dev server, tests, linting

This single file gives Claude Code (or any LLM agent) full context to work effectively.

---

## Real-Time Collaboration Architecture

mermaid
sequenceDiagram
    participant UserA as User A (Browser)
    participant Next as Next.js Server
    participant Supa as Supabase
    participant UserB as User B (Browser)

    UserA->>Next: Add hotel via Server Action
    Next->>Supa: INSERT into hotels table
    Supa-->>UserA: Realtime broadcast (INSERT event)
    Supa-->>UserB: Realtime broadcast (INSERT event)
    UserA->>UserA: TanStack Query cache update
    UserB->>UserB: TanStack Query cache update




Each trip detail page subscribes to Supabase Realtime channels scoped to that trip's ID. When any collaborator makes a change (add/edit/delete a hotel, flight, or place), all other connected users receive the update instantly and TanStack Query's cache is updated via queryClient.setQueryData().

---

## Implementation Sequence

The implementation will proceed in this order, with linting (eslint, prettier) and type-checking enforced at every step.