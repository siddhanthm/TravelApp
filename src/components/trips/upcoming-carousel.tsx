'use client'

import { useRouter } from 'next/navigation'
import { CreateTripDialog } from './create-trip-dialog'
import { cn } from '@/lib/utils'
import type { TripWithMembers } from '@/types'
import { Plus } from 'lucide-react'
import Image from 'next/image'

// Travel-inspired gradient backgrounds — deterministically assigned per trip
const GRADIENTS = [
  ['#2a4a22', '#4a7c52'],
  ['#1e3a5c', '#2e6b8a'],
  ['#7a3a1e', '#b86e3a'],
  ['#1a3d20', '#3d7a52'],
  ['#3a3d4a', '#5c7282'],
  ['#4a2235', '#8a5260'],
]

function getGradient(str: string): [string, string] {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

function formatStartDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()
}

function MemberAvatars({ members }: { members: TripWithMembers['trip_members'] }) {
  if (!members?.length) return null
  const visible = members.slice(0, 3)
  const extra = members.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div
          key={m.id}
          className="w-7 h-7 rounded-full border-2 border-surface-container-lowest overflow-hidden bg-surface-container flex items-center justify-center font-label text-xs text-on-surface-variant shrink-0"
          style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: visible.length - i }}
        >
          {m.profile?.avatar_url ? (
            <Image
              src={m.profile.avatar_url}
              alt={m.profile.name ?? ''}
              width={28}
              height={28}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>{m.profile?.name?.[0]?.toUpperCase() ?? '?'}</span>
          )}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-surface-container flex items-center justify-center font-label text-xs text-on-surface-variant shrink-0"
          style={{ marginLeft: '-8px' }}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}

function AddTripCard() {
  return (
    <CreateTripDialog>
      <button
        className={cn(
          'snap-start flex-none',
          'w-[80vw] sm:w-[45vw] lg:w-[calc(33.333%-11px)]',
          'h-[360px] rounded-xl',
          'border-2 border-dashed border-outline-variant',
          'bg-surface-container-low hover:bg-surface-container',
          'flex flex-col items-center justify-center gap-4',
          'transition-colors cursor-pointer'
        )}
      >
        <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center">
          <Plus className="w-6 h-6 text-on-surface-variant" />
        </div>
        <div className="text-center">
          <p className="font-headline text-base font-semibold text-on-surface">Add New Trip</p>
          <p className="font-body text-sm text-on-surface-variant mt-0.5">Start your next journal</p>
        </div>
      </button>
    </CreateTripDialog>
  )
}

function TripCarouselCard({ trip, dateField = 'start_date' }: { trip: TripWithMembers; dateField?: 'start_date' | 'end_date' }) {
  const router = useRouter()
  const [fromColor, toColor] = getGradient(trip.name + trip.destination)
  const startDate = formatStartDate(trip[dateField])

  return (
    <button
      onClick={() => router.push(`/trips/${trip.id}`)}
      className={cn(
        'snap-start flex-none text-left',
        'w-[80vw] sm:w-[45vw] lg:w-[calc(33.333%-11px)]',
        'h-[360px] rounded-xl overflow-hidden',
        'bg-surface-container-lowest shadow-card hover:shadow-ambient',
        'flex flex-col transition-shadow'
      )}
    >
      {/* Gradient image area */}
      <div
        className="relative flex-none h-[200px]"
        style={{ background: `linear-gradient(135deg, ${fromColor}, ${toColor})` }}
      >
        {/* Soft light highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_65%)]" />
        {startDate && (
          <span className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-3 py-1 font-label text-xs tracking-[0.05rem] text-on-surface">
            {startDate}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2 min-h-0">
        <h3 className="font-headline text-lg font-semibold text-on-surface leading-snug line-clamp-1">
          {trip.name}
        </h3>
        <p className="font-body text-sm text-on-surface-variant line-clamp-2 flex-1">
          {trip.notes ?? trip.destination}
        </p>
        {trip.trip_members?.length > 0 && (
          <MemberAvatars members={trip.trip_members} />
        )}
      </div>
    </button>
  )
}

interface TripCarouselProps {
  title: string
  trips: TripWithMembers[]
  showAddCard?: boolean
}

export function TripCarousel({ title, trips, showAddCard = false }: TripCarouselProps) {
  if (!trips.length && !showAddCard) return null
  return (
    <div className="flex flex-col gap-5">
      <div className="px-6">
        <h2 className="font-headline text-2xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide px-6">
        {showAddCard && <AddTripCard />}
        {trips.map((trip) => (
          <TripCarouselCard key={trip.id} trip={trip} dateField={showAddCard ? 'start_date' : 'end_date'} />
        ))}
      </div>
    </div>
  )
}
