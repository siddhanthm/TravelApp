import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TripList } from '@/components/trips/trip-list'

export default async function TripsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="pt-12">
      <div className="px-6 mb-8">
        <h1 className="font-headline text-4xl font-bold text-on-surface">Your trips</h1>
      </div>
      <TripList />
    </div>
  )
}
