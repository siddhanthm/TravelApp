'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateHotel } from '@/hooks/use-trip'

const schema = z.object({
  name: z.string().min(1, 'Hotel name is required').max(200),
  address: z.string().max(500).optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().default('USD'),
  notes: z.string().max(2000).optional(),
  booking_url: z.string().url('Invalid URL').optional().or(z.literal('')),
}).refine(
  (data) => !data.check_in || !data.check_out || new Date(data.check_out) >= new Date(data.check_in),
  { message: 'Check-out must be on or after check-in', path: ['check_out'] }
)
type FormValues = z.infer<typeof schema>

export function AddHotelDialog({ tripId, children }: { tripId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const createHotel = useCreateHotel(tripId)

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'USD' },
  })
  const checkIn = watch('check_in')

  async function onSubmit(values: FormValues) {
    await createHotel.mutateAsync({
      name: values.name,
      address: values.address ?? null,
      check_in: values.check_in ?? null,
      check_out: values.check_out ?? null,
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
      <DialogContent title="Add hotel">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Hotel name" id="name" placeholder="Park Hyatt Tokyo" error={errors.name?.message} {...register('name')} />
          <Input label="Address" id="address" placeholder="3-7-1-2 Nishi Shinjuku" {...register('address')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Check-in" id="check_in" type="date" {...register('check_in')} />
            <Input label="Check-out" id="check_out" type="date" min={checkIn || undefined} error={errors.check_out?.message} {...register('check_out')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" id="price" type="number" step="0.01" placeholder="0.00" {...register('price')} />
            <Input label="Currency" id="currency" placeholder="USD" {...register('currency')} />
          </div>
          <Input label="Booking URL" id="booking_url" type="url" placeholder="https://..." error={errors.booking_url?.message} {...register('booking_url')} />
          <Textarea label="Notes" id="notes" placeholder="Confirmation number, room preferences..." {...register('notes')} />
          <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? 'Adding...' : 'Add hotel'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
