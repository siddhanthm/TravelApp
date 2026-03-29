'use client'

import { useState } from 'react'
import { useTripRealtime } from '@/hooks/use-realtime'
import { useTrip } from '@/hooks/use-trip'
import { HotelList } from '@/components/hotels/hotel-list'
import { FlightList } from '@/components/flights/flight-list'
import { PlaceList } from '@/components/places/place-list'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TripWithMembers } from '@/types'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

type Tab = 'hotels' | 'flights' | 'places'

interface TripDetailProps {
  tripId: string
  initialTrip: TripWithMembers
  userId: string
}

export function TripDetail({ tripId, initialTrip, userId }: TripDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('hotels')
  const { data: trip } = useTrip(tripId)
  const current = trip ?? initialTrip

  useTripRealtime(tripId)

  const myRole = current.trip_members?.find((m) => m.user_id === userId)?.role
  const canEdit = myRole === 'owner' || myRole === 'editor'

  const tabs: { key: Tab; label: string }[] = [
    { key: 'hotels', label: 'Hotels' },
    { key: 'flights', label: 'Flights' },
    { key: 'places', label: 'Places' },
  ]

  return (
    <div className="px-6 pt-8 max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/trips" className="inline-flex items-center gap-1.5 font-label text-sm tracking-[0.05rem] text-on-surface-variant hover:text-on-surface mb-6 rounded-xl transition-colors">
        <ArrowLeft className="w-4 h-4" />
        All trips
      </Link>

      {/* Trip header */}
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-2">{current.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="font-body">{current.destination}</span>
          </div>
          {(current.start_date || current.end_date) && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="font-label text-sm tracking-[0.05rem]">
                {formatDate(current.start_date)} – {formatDate(current.end_date)}
              </span>
            </div>
          )}
          <Badge>{current.status}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-full px-4 py-1.5 font-label text-sm tracking-[0.05rem] transition-colors',
              activeTab === tab.key
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'hotels' && <HotelList tripId={tripId} canEdit={canEdit} />}
      {activeTab === 'flights' && <FlightList tripId={tripId} canEdit={canEdit} />}
      {activeTab === 'places' && <PlaceList tripId={tripId} canEdit={canEdit} />}
    </div>
  )
}
