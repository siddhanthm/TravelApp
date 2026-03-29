'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Trip, TripWithMembers, Hotel, Flight, Place } from '@/types'

// ─── Query Keys ────────────────────────────────────────────────
export const tripKeys = {
  all: ['trips'] as const,
  detail: (id: string) => ['trips', id] as const,
  hotels: (tripId: string) => ['trips', tripId, 'hotels'] as const,
  flights: (tripId: string) => ['trips', tripId, 'flights'] as const,
  places: (tripId: string) => ['trips', tripId, 'places'] as const,
}

// ─── Trips ─────────────────────────────────────────────────────
export function useTrips() {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_members(*, profile:profiles(*))')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as TripWithMembers[]
    },
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('trips')
        .select('*, trip_members(*, profile:profiles(*))')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as TripWithMembers
    },
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Pick<Trip, 'name' | 'destination' | 'start_date' | 'end_date' | 'notes'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({ ...input, created_by: user.id, status: 'planning' })
        .select()
        .single()
      if (tripError) throw tripError

      // Owner adds themselves as member
      const { error: memberError } = await supabase
        .from('trip_members')
        .insert({ trip_id: trip.id, user_id: user.id, role: 'owner' })
      if (memberError) throw memberError

      return trip as Trip
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.all }),
  })
}

export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Partial<Pick<Trip, 'name' | 'destination' | 'start_date' | 'end_date' | 'notes' | 'status'>>) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('trips')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', tripId)
        .select()
        .single()
      if (error) throw error
      return data as Trip
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all })
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (tripId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('trips').delete().eq('id', tripId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.all }),
  })
}

// ─── Hotels ────────────────────────────────────────────────────
export function useHotels(tripId: string) {
  return useQuery({
    queryKey: tripKeys.hotels(tripId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('trip_id', tripId)
        .order('check_in', { ascending: true })
      if (error) throw error
      return data as Hotel[]
    },
    enabled: !!tripId,
  })
}

export function useCreateHotel(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<Hotel, 'id' | 'trip_id' | 'added_by'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('hotels')
        .insert({ ...input, trip_id: tripId, added_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Hotel
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.hotels(tripId) }),
  })
}

export function useUpdateHotel(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Hotel> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('hotels').update(input).eq('id', id).select().single()
      if (error) throw error
      return data as Hotel
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.hotels(tripId) }),
  })
}

export function useDeleteHotel(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (hotelId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('hotels').delete().eq('id', hotelId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.hotels(tripId) }),
  })
}

// ─── Flights ───────────────────────────────────────────────────
export function useFlights(tripId: string) {
  return useQuery({
    queryKey: tripKeys.flights(tripId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('trip_id', tripId)
        .order('departure', { ascending: true })
      if (error) throw error
      return data as Flight[]
    },
    enabled: !!tripId,
  })
}

export function useCreateFlight(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<Flight, 'id' | 'trip_id' | 'added_by'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('flights')
        .insert({ ...input, trip_id: tripId, added_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Flight
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.flights(tripId) }),
  })
}

export function useUpdateFlight(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Flight> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('flights').update(input).eq('id', id).select().single()
      if (error) throw error
      return data as Flight
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.flights(tripId) }),
  })
}

export function useDeleteFlight(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (flightId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('flights').delete().eq('id', flightId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.flights(tripId) }),
  })
}

// ─── Places ────────────────────────────────────────────────────
export function usePlaces(tripId: string) {
  return useQuery({
    queryKey: tripKeys.places(tripId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('trip_id', tripId)
        .order('name', { ascending: true })
      if (error) throw error
      return data as Place[]
    },
    enabled: !!tripId,
  })
}

export function useCreatePlace(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<Place, 'id' | 'trip_id' | 'added_by'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('places')
        .insert({ ...input, trip_id: tripId, added_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Place
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.places(tripId) }),
  })
}

export function useUpdatePlace(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<Place> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase.from('places').update(input).eq('id', id).select().single()
      if (error) throw error
      return data as Place
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.places(tripId) }),
  })
}

export function useDeletePlace(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (placeId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('places').delete().eq('id', placeId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripKeys.places(tripId) }),
  })
}
