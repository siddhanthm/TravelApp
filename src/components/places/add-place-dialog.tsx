'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePlace } from '@/hooks/use-trip'

const schema = z.object({
  name: z.string().min(1, 'Place name is required').max(200),
  address: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  google_maps_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export function AddPlaceDialog({ tripId, children }: { tripId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const createPlace = useCreatePlace(tripId)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    await createPlace.mutateAsync({
      name: values.name,
      address: values.address ?? null,
      category: values.category ?? null,
      notes: values.notes ?? null,
      google_maps_url: values.google_maps_url || null,
      place_id: null,
      latitude: null,
      longitude: null,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="Add place">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Place name" id="name" placeholder="Shinjuku Gyoen" error={errors.name?.message} {...register('name')} />
          <Input label="Address" id="address" placeholder="11 Naitomachi, Shinjuku" {...register('address')} />
          <Input label="Category" id="category" placeholder="Park, Restaurant, Museum..." {...register('category')} />
          <Input label="Google Maps URL" id="google_maps_url" type="url" error={errors.google_maps_url?.message} {...register('google_maps_url')} />
          <Textarea label="Notes" id="notes" placeholder="Opening hours, tips..." {...register('notes')} />
          <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? 'Adding...' : 'Add place'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
