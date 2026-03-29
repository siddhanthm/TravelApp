'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { TripWithMembers } from '@/types'
import { MapPin, Users, Calendar } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'active' | 'error'> = {
  planning: 'default',
  confirmed: 'active',
  completed: 'default',
  cancelled: 'error',
}

interface TripCardProps {
  trip: TripWithMembers
}

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter()

  return (
    <Card onClick={() => router.push(`/trips/${trip.id}`)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-headline text-xl font-semibold text-on-surface truncate mb-1">{trip.name}</h2>
          <div className="flex items-center gap-1.5 text-on-surface-variant mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="font-body text-sm truncate">{trip.destination}</span>
          </div>
          <div className="flex items-center gap-4">
            {(trip.start_date || trip.end_date) && (
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="font-label text-xs tracking-[0.05rem]">
                  {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="font-label text-xs tracking-[0.05rem]">
                {trip.trip_members?.length ?? 1}
              </span>
            </div>
          </div>
        </div>
        <Badge variant={statusVariant[trip.status] ?? 'default'}>
          {trip.status}
        </Badge>
      </div>
    </Card>
  )
}
