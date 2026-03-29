import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TripDetail } from '@/components/trips/trip-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: trip } = await supabase
    .from('trips')
    .select('*, trip_members(*, profile:profiles(*))')
    .eq('id', id)
    .single()

  if (!trip) notFound()

  return <TripDetail tripId={id} initialTrip={trip} userId={user.id} />
}
