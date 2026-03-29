'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { tripKeys } from './use-trip'

export function useTripRealtime(tripId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!tripId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`trip-${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hotels', filter: `trip_id=eq.${tripId}` },
        () => queryClient.invalidateQueries({ queryKey: tripKeys.hotels(tripId) })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flights', filter: `trip_id=eq.${tripId}` },
        () => queryClient.invalidateQueries({ queryKey: tripKeys.flights(tripId) })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'places', filter: `trip_id=eq.${tripId}` },
        () => queryClient.invalidateQueries({ queryKey: tripKeys.places(tripId) })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${tripId}` },
        () => queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [tripId, queryClient])
}
