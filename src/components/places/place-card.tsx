'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Place } from '@/types'
import { MapPin, ExternalLink, Trash2 } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  canEdit: boolean
  onDelete: () => void
}

export function PlaceCard({ place, canEdit, onDelete }: PlaceCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <h3 className="font-headline text-lg font-semibold text-on-surface truncate">{place.name}</h3>
          </div>
          {place.category && (
            <Badge className="mb-2">{place.category}</Badge>
          )}
          {place.address && (
            <p className="font-body text-sm text-on-surface-variant">{place.address}</p>
          )}
          {place.notes && (
            <p className="font-body text-sm text-on-surface-variant mt-2">{place.notes}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {place.google_maps_url && (
            <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl p-2 hover:bg-surface-container text-on-surface-variant transition-colors" aria-label="Open in Maps">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {canEdit && (
            <button onClick={onDelete}
              className="rounded-xl p-2 hover:bg-error-container text-on-surface-variant hover:text-on-error-container transition-colors" aria-label="Delete place">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
