'use client'

import { useTrips } from '@/hooks/use-trip'
import { TripCard } from './trip-card'
import { Spinner } from '@/components/ui/spinner'
import { TripCarousel } from './upcoming-carousel'
import type { TripWithMembers } from '@/types'

function categorizeTripsByDate(trips: TripWithMembers[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const current: TripWithMembers[] = []
  const upcoming: TripWithMembers[] = []
  const past: TripWithMembers[] = []

  for (const trip of trips) {
    const start = trip.start_date ? new Date(trip.start_date) : null
    const end = trip.end_date ? new Date(trip.end_date) : null

    if (start && end && start <= today && end >= today) {
      current.push(trip)
    } else if (end && end < today) {
      past.push(trip)
    } else {
      upcoming.push(trip)
    }
  }

  upcoming.sort((a, b) => {
    if (!a.start_date) return 1
    if (!b.start_date) return -1
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })

  past.sort((a, b) => {
    if (!a.end_date) return 1
    if (!b.end_date) return -1
    return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
  })

  return { current, upcoming, past }
}

function TripSection({ title, trips }: { title: string; trips: TripWithMembers[] }) {
  if (!trips.length) return null
  return (
    <div className="px-6 max-w-2xl mx-auto w-full flex flex-col gap-3">
      <h2 className="font-headline text-2xl font-bold text-on-surface">{title}</h2>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  )
}

export function TripList() {
  const { data: trips, isLoading } = useTrips()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  const { current, upcoming, past } = categorizeTripsByDate(trips ?? [])
  const hasAny = current.length + upcoming.length + past.length > 0

  return (
    <div className="flex flex-col gap-10 pb-4">
      {!hasAny && (
        <div className="px-6 max-w-2xl mx-auto w-full">
          <div className="bg-surface-container-lowest rounded-xl p-10 text-center">
            <p className="font-headline text-xl text-on-surface mb-2">No trips yet</p>
            <p className="font-body text-on-surface-variant">Create your first trip to get started.</p>
          </div>
        </div>
      )}

      <TripSection title="Current trip" trips={current} />
      <TripCarousel title="Upcoming trips" trips={upcoming} showAddCard />
      <TripCarousel title="Past trips" trips={past} />
    </div>
  )
}
