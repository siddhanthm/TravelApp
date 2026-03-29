-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Profiles (mirrors auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  name        text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Sync profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- Trips
-- ─────────────────────────────────────────────
create table public.trips (
  id           uuid primary key default uuid_generate_v4(),
  created_by   uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  destination  text not null,
  start_date   date,
  end_date     date,
  notes        text,
  status       text not null default 'planning'
                check (status in ('planning','confirmed','completed','cancelled')),
  search_index tsvector,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create or replace function public.trips_search_index()
returns trigger language plpgsql as $$
begin
  new.search_index := to_tsvector('english',
    coalesce(new.name, '') || ' ' ||
    coalesce(new.destination, '') || ' ' ||
    coalesce(new.notes, '')
  );
  return new;
end;
$$;

create trigger trips_search_index_update
  before insert or update on public.trips
  for each row execute function public.trips_search_index();

-- ─────────────────────────────────────────────
-- Trip Members
-- ─────────────────────────────────────────────
create table public.trip_members (
  id         uuid primary key default uuid_generate_v4(),
  trip_id    uuid not null references public.trips(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null default 'viewer'
              check (role in ('owner','editor','viewer')),
  joined_at  timestamptz not null default now(),
  unique (trip_id, user_id)
);

-- ─────────────────────────────────────────────
-- Hotels
-- ─────────────────────────────────────────────
create table public.hotels (
  id           uuid primary key default uuid_generate_v4(),
  trip_id      uuid not null references public.trips(id) on delete cascade,
  added_by     uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  address      text,
  check_in     date,
  check_out    date,
  price        numeric(12,2),
  currency     text not null default 'USD',
  notes        text,
  booking_url  text,
  search_index tsvector
);

create or replace function public.hotels_search_index()
returns trigger language plpgsql as $$
begin
  new.search_index := to_tsvector('english',
    coalesce(new.name, '') || ' ' ||
    coalesce(new.address, '') || ' ' ||
    coalesce(new.notes, '')
  );
  return new;
end;
$$;

create trigger hotels_search_index_update
  before insert or update on public.hotels
  for each row execute function public.hotels_search_index();

-- ─────────────────────────────────────────────
-- Flights
-- ─────────────────────────────────────────────
create table public.flights (
  id               uuid primary key default uuid_generate_v4(),
  trip_id          uuid not null references public.trips(id) on delete cascade,
  added_by         uuid not null references public.profiles(id) on delete cascade,
  airline          text,
  flight_number    text,
  origin           text not null,
  destination      text not null,
  departure        timestamptz,
  arrival          timestamptz,
  origin_tz        text,
  destination_tz   text,
  price            numeric(12,2),
  currency         text not null default 'USD',
  notes            text,
  booking_url      text,
  search_index     tsvector
);

create or replace function public.flights_search_index()
returns trigger language plpgsql as $$
begin
  new.search_index := to_tsvector('english',
    coalesce(new.airline, '') || ' ' ||
    coalesce(new.flight_number, '') || ' ' ||
    coalesce(new.origin, '') || ' ' ||
    coalesce(new.destination, '') || ' ' ||
    coalesce(new.notes, '')
  );
  return new;
end;
$$;

create trigger flights_search_index_update
  before insert or update on public.flights
  for each row execute function public.flights_search_index();

-- ─────────────────────────────────────────────
-- Places
-- ─────────────────────────────────────────────
create table public.places (
  id              uuid primary key default uuid_generate_v4(),
  trip_id         uuid not null references public.trips(id) on delete cascade,
  added_by        uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  address         text,
  category        text,
  notes           text,
  google_maps_url text,
  place_id        text,
  latitude        double precision,
  longitude       double precision,
  search_index    tsvector
);

create or replace function public.places_search_index()
returns trigger language plpgsql as $$
begin
  new.search_index := to_tsvector('english',
    coalesce(new.name, '') || ' ' ||
    coalesce(new.address, '') || ' ' ||
    coalesce(new.category, '') || ' ' ||
    coalesce(new.notes, '')
  );
  return new;
end;
$$;

create trigger places_search_index_update
  before insert or update on public.places
  for each row execute function public.places_search_index();

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index idx_trip_members_user   on public.trip_members(user_id);
create index idx_trip_members_trip   on public.trip_members(trip_id);
create index idx_hotels_trip         on public.hotels(trip_id);
create index idx_flights_trip        on public.flights(trip_id);
create index idx_places_trip         on public.places(trip_id);
create index idx_trips_created_by    on public.trips(created_by);
create index idx_trips_search        on public.trips    using gin(search_index);
create index idx_hotels_search       on public.hotels   using gin(search_index);
create index idx_flights_search      on public.flights  using gin(search_index);
create index idx_places_search       on public.places   using gin(search_index);

-- ─────────────────────────────────────────────
-- Security definer helpers (bypass RLS — no recursion)
-- ─────────────────────────────────────────────
create or replace function public.get_my_trip_ids()
returns setof uuid language sql security definer stable set search_path = public as $$
  select trip_id from public.trip_members where user_id = auth.uid();
$$;

create or replace function public.get_my_owned_trip_ids()
returns setof uuid language sql security definer stable set search_path = public as $$
  select trip_id from public.trip_members where user_id = auth.uid() and role = 'owner';
$$;

create or replace function public.get_my_editable_trip_ids()
returns setof uuid language sql security definer stable set search_path = public as $$
  select trip_id from public.trip_members where user_id = auth.uid() and role in ('owner','editor');
$$;

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.trips        enable row level security;
alter table public.trip_members enable row level security;
alter table public.hotels       enable row level security;
alter table public.flights      enable row level security;
alter table public.places       enable row level security;

-- profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- trips
create policy "Members can view trips" on public.trips
  for select using (created_by = auth.uid() or id in (select public.get_my_trip_ids()));
create policy "Authenticated users can create trips" on public.trips
  for insert with check (auth.uid() = created_by);
create policy "Owners and editors can update trips" on public.trips
  for update using (id in (select public.get_my_editable_trip_ids()));
create policy "Owners can delete trips" on public.trips
  for delete using (id in (select public.get_my_owned_trip_ids()));

-- trip_members (NO direct trip_members subqueries — all via security definer functions)
create policy "Members can view trip members" on public.trip_members
  for select using (trip_id in (select public.get_my_trip_ids()));
create policy "Users can insert trip members" on public.trip_members
  for insert with check (auth.uid() = user_id);
create policy "Owners can update trip members" on public.trip_members
  for update using (trip_id in (select public.get_my_owned_trip_ids()));
create policy "Owners can delete trip members" on public.trip_members
  for delete using (trip_id in (select public.get_my_owned_trip_ids()));

-- hotels
create policy "Members can view hotels" on public.hotels
  for select using (trip_id in (select public.get_my_trip_ids()));
create policy "Editors can insert hotels" on public.hotels
  for insert with check (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can update hotels" on public.hotels
  for update using (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can delete hotels" on public.hotels
  for delete using (trip_id in (select public.get_my_editable_trip_ids()));

-- flights
create policy "Members can view flights" on public.flights
  for select using (trip_id in (select public.get_my_trip_ids()));
create policy "Editors can insert flights" on public.flights
  for insert with check (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can update flights" on public.flights
  for update using (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can delete flights" on public.flights
  for delete using (trip_id in (select public.get_my_editable_trip_ids()));

-- places
create policy "Members can view places" on public.places
  for select using (trip_id in (select public.get_my_trip_ids()));
create policy "Editors can insert places" on public.places
  for insert with check (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can update places" on public.places
  for update using (trip_id in (select public.get_my_editable_trip_ids()));
create policy "Editors can delete places" on public.places
  for delete using (trip_id in (select public.get_my_editable_trip_ids()));
