'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateFlight } from '@/hooks/use-trip'

const schema = z.object({
  origin: z.string().min(1, 'Origin required').max(100),
  destination: z.string().min(1, 'Destination required').max(100),
  airline: z.string().max(100).optional(),
  flight_number: z.string().max(20).optional(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  origin_tz: z.string().optional(),
  destination_tz: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().default('USD'),
  notes: z.string().max(2000).optional(),
  booking_url: z.string().url('Invalid URL').optional().or(z.literal('')),
}).refine(
  (data) => !data.departure || !data.arrival || new Date(data.arrival) >= new Date(data.departure),
  { message: 'Arrival must be on or after departure', path: ['arrival'] }
)
type FormValues = z.infer<typeof schema>

export function AddFlightDialog({ tripId, children }: { tripId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const createFlight = useCreateFlight(tripId)

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'USD' },
  })
  const departure = watch('departure')

  async function onSubmit(values: FormValues) {
    await createFlight.mutateAsync({
      origin: values.origin,
      destination: values.destination,
      airline: values.airline ?? null,
      flight_number: values.flight_number ?? null,
      departure: values.departure ?? null,
      arrival: values.arrival ?? null,
      origin_tz: values.origin_tz ?? null,
      destination_tz: values.destination_tz ?? null,
      price: values.price ? parseFloat(values.price) : null,
      currency: values.currency,
      notes: values.notes ?? null,
      booking_url: values.booking_url || null,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="Add flight">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="From" id="origin" placeholder="NRT" error={errors.origin?.message} {...register('origin')} />
            <Input label="To" id="destination" placeholder="JFK" error={errors.destination?.message} {...register('destination')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Airline" id="airline" placeholder="ANA" {...register('airline')} />
            <Input label="Flight no." id="flight_number" placeholder="NH009" {...register('flight_number')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Departure" id="departure" type="datetime-local" {...register('departure')} />
            <Input label="Arrival" id="arrival" type="datetime-local" min={departure || undefined} error={errors.arrival?.message} {...register('arrival')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origin timezone" id="origin_tz" placeholder="Asia/Tokyo" {...register('origin_tz')} />
            <Input label="Dest. timezone" id="destination_tz" placeholder="America/New_York" {...register('destination_tz')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" id="price" type="number" step="0.01" {...register('price')} />
            <Input label="Currency" id="currency" placeholder="USD" {...register('currency')} />
          </div>
          <Input label="Booking URL" id="booking_url" type="url" error={errors.booking_url?.message} {...register('booking_url')} />
          <Textarea label="Notes" id="notes" {...register('notes')} />
          <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? 'Adding...' : 'Add flight'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
