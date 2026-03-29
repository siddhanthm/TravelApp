'use client'

import { useHotels, useDeleteHotel } from '@/hooks/use-trip'
import { HotelCard } from './hotel-card'
import { AddHotelDialog } from './add-hotel-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'

interface HotelListProps {
  tripId: string
  canEdit: boolean
}

export function HotelList({ tripId, canEdit }: HotelListProps) {
  const { data: hotels, isLoading } = useHotels(tripId)
  const deleteHotel = useDeleteHotel(tripId)

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="flex flex-col gap-4">
      {canEdit && (
        <AddHotelDialog tripId={tripId}>
          <Button variant="cta" size="sm" className="self-start gap-2">
            <Plus className="w-4 h-4" />
            Add hotel
          </Button>
        </AddHotelDialog>
      )}
      {!hotels?.length && (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
          <p className="font-body text-on-surface-variant">No hotels added yet.</p>
        </div>
      )}
      {hotels?.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} canEdit={canEdit} onDelete={() => deleteHotel.mutate(hotel.id)} />
      ))}
    </div>
  )
}
