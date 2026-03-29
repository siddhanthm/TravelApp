export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          created_by: string
          name: string
          destination: string
          start_date: string | null
          end_date: string | null
          notes: string | null
          status: string
          search_index: unknown | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          destination: string
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          destination?: string
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
        }
      }
      trip_members: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      hotels: {
        Row: {
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
          search_index: unknown | null
        }
        Insert: {
          id?: string
          trip_id: string
          added_by: string
          name: string
          address?: string | null
          check_in?: string | null
          check_out?: string | null
          price?: number | null
          currency?: string
          notes?: string | null
          booking_url?: string | null
        }
        Update: {
          id?: string
          trip_id?: string
          added_by?: string
          name?: string
          address?: string | null
          check_in?: string | null
          check_out?: string | null
          price?: number | null
          currency?: string
          notes?: string | null
          booking_url?: string | null
        }
      }
      flights: {
        Row: {
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
          search_index: unknown | null
        }
        Insert: {
          id?: string
          trip_id: string
          added_by: string
          airline?: string | null
          flight_number?: string | null
          origin: string
          destination: string
          departure?: string | null
          arrival?: string | null
          origin_tz?: string | null
          destination_tz?: string | null
          price?: number | null
          currency?: string
          notes?: string | null
          booking_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          origin?: string
          destination?: string
          departure?: string | null
          arrival?: string | null
          price?: number | null
          notes?: string | null
          booking_url?: string | null
        }
      }
      places: {
        Row: {
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
          search_index: unknown | null
        }
        Insert: {
          id?: string
          trip_id: string
          added_by: string
          name: string
          address?: string | null
          category?: string | null
          notes?: string | null
          google_maps_url?: string | null
          place_id?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          category?: string | null
          notes?: string | null
          google_maps_url?: string | null
          latitude?: number | null
          longitude?: number | null
        }
      }
    }
  }
}
