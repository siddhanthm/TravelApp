'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTrip } from '@/hooks/use-trip'
import { useRouter } from 'next/navigation'

const schema = z.object({
  name: z.string().min(1, 'Trip name is required').max(100),
  destination: z.string().min(1, 'Destination is required').max(200),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  notes: z.string().max(2000).optional(),
}).refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  { message: 'End date must be on or after start date', path: ['end_date'] }
)
type FormValues = z.infer<typeof schema>

interface CreateTripDialogProps {
  children: React.ReactNode
}

export function CreateTripDialog({ children }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const createTrip = useCreateTrip()

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const startDate = watch('start_date')

  async function onSubmit(values: FormValues) {
    const trip = await createTrip.mutateAsync({
      name: values.name,
      destination: values.destination,
      start_date: values.start_date,
      end_date: values.end_date,
      notes: values.notes ?? null,
    })
    reset()
    setOpen(false)
    router.push(`/trips/${trip.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="New trip" description="Where are you heading?">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Trip name" id="name" placeholder="Tokyo Adventure" error={errors.name?.message} {...register('name')} />
          <Input label="Destination" id="destination" placeholder="Tokyo, Japan" error={errors.destination?.message} {...register('destination')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" id="start_date" type="date" error={errors.start_date?.message} {...register('start_date')} />
            <Input label="End date" id="end_date" type="date" min={startDate || undefined} error={errors.end_date?.message} {...register('end_date')} />
          </div>
          <Textarea label="Notes" id="notes" placeholder="Anything to keep in mind..." {...register('notes')} />
          <Button variant="cta" type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? 'Creating...' : 'Create trip'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
