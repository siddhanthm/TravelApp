'use client'

import { useFlights, useDeleteFlight } from '@/hooks/use-trip'
import { FlightCard } from './flight-card'
import { AddFlightDialog } from './add-flight-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'

interface FlightListProps {
  tripId: string
  canEdit: boolean
}

export function FlightList({ tripId, canEdit }: FlightListProps) {
  const { data: flights, isLoading } = useFlights(tripId)
  const deleteFlight = useDeleteFlight(tripId)

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>

  return (
    <div className="flex flex-col gap-4">
      {canEdit && (
        <AddFlightDialog tripId={tripId}>
          <Button variant="cta" size="sm" className="self-start gap-2">
            <Plus className="w-4 h-4" />
            Add flight
          </Button>
        </AddFlightDialog>
      )}
      {!flights?.length && (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
          <p className="font-body text-on-surface-variant">No flights added yet.</p>
        </div>
      )}
      {flights?.map((flight) => (
        <FlightCard key={flight.id} flight={flight} canEdit={canEdit} onDelete={() => deleteFlight.mutate(flight.id)} />
      ))}
    </div>
  )
}
