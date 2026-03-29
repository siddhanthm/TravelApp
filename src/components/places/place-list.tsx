'use client'

import { usePlaces, useDeletePlace } from '@/hooks/use-trip'
import { PlaceCard } from './place-card'
import { AddPlaceDialog } from './add-place-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'

interface PlaceListProps {
  tripId: string
  canEdit: boolean
}

export function PlaceList({ tripId, canEdit }: PlaceListProps) {
  const { data: places, isLoading } = usePlaces(tripId)
  const deletePlace = useDeletePlace(tripId)

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="flex flex-col gap-4">
      {canEdit && (
        <AddPlaceDialog tripId={tripId}>
          <Button variant="cta" size="sm" className="self-start gap-2">
            <Plus className="w-4 h-4" />
            Add place
          </Button>
        </AddPlaceDialog>
      )}
      {!places?.length && (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
          <p className="font-body text-on-surface-variant">No places added yet.</p>
        </div>
      )}
      {places?.map((place) => (
        <PlaceCard key={place.id} place={place} canEdit={canEdit} onDelete={() => deletePlace.mutate(place.id)} />
      ))}
    </div>
  )
}
