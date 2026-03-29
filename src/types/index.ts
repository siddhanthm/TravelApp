export type TripRole = 'owner' | 'editor' | 'viewer'
export type TripStatus = 'planning' | 'confirmed' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Trip {
  id: string
  created_by: string
  name: string
  destination: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  status: TripStatus
  created_at: string
  updated_at: string
}

export interface TripMember {
  id: string
  trip_id: string
  user_id: string
  role: TripRole
  joined_at: string
  profile?: Profile
}

export interface TripWithMembers extends Trip {
  trip_members: TripMember[]
}

export interface Hotel {
  id: string
  trip_id: string
  added_by: string
  name: string
  address: string | null
  check_in: string | null
  check_out: string | null
  price: number | null
  currency: string
  notes: string | null
  booking_url: string | null
}

export interface Flight {
  id: string
  trip_id: string
  added_by: string
  airline: string | null
  flight_number: string | null
  origin: string
  destination: string
  departure: string | null
  arrival: string | null
  origin_tz: string | null
  destination_tz: string | null
  price: number | null
  currency: string
  notes: string | null
  booking_url: string | null
}

export interface Place {
  id: string
  trip_id: string
  added_by: string
  name: string
  address: string | null
  category: string | null
  notes: string | null
  google_maps_url: string | null
  place_id: string | null
  latitude: number | null
  longitude: number | null
}

export interface SearchResult {
  matched_entity_ids: string[]
  type: 'hotel' | 'flight' | 'place' | 'trip'
  rationale: string
}
