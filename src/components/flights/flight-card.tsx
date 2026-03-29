'use client'

import { Card } from '@/components/ui/card'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import type { Flight } from '@/types'
import { Plane, ArrowRight, DollarSign, ExternalLink, Trash2 } from 'lucide-react'

interface FlightCardProps {
  flight: Flight
  canEdit: boolean
  onDelete: () => void
}

export function FlightCard({ flight, canEdit, onDelete }: FlightCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Plane className="w-4 h-4 text-primary shrink-0" />
            <span className="font-label text-sm tracking-[0.05rem] text-on-surface-variant">
              {flight.airline} {flight.flight_number}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-center">
              <p className="font-headline text-xl font-bold text-on-surface">{flight.origin}</p>
              <p className="font-label text-xs tracking-[0.05rem] text-on-surface-variant">
                {formatDateTime(flight.departure, flight.origin_tz)}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-on-surface-variant shrink-0" />
            <div className="text-center">
              <p className="font-headline text-xl font-bold text-on-surface">{flight.destination}</p>
              <p className="font-label text-xs tracking-[0.05rem] text-on-surface-variant">
                {formatDateTime(flight.arrival, flight.destination_tz)}
              </p>
            </div>
          </div>
          {flight.price != null && (
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span className="font-label text-xs tracking-[0.05rem]">
                {formatCurrency(flight.price, flight.currency)}
              </span>
            </div>
          )}
          {flight.notes && (
            <p className="font-body text-sm text-on-surface-variant mt-2">{flight.notes}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {flight.booking_url && (
            <a href={flight.booking_url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl p-2 hover:bg-surface-container text-on-surface-variant transition-colors" aria-label="Open booking">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {canEdit && (
            <button onClick={onDelete}
              className="rounded-xl p-2 hover:bg-error-container text-on-surface-variant hover:text-on-error-container transition-colors" aria-label="Delete flight">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
