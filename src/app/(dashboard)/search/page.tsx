import { Suspense } from 'react'
import { SearchContent } from './search-content'
import { Spinner } from '@/components/ui/spinner'

export default function SearchPage() {
  return (
    <div className="px-6 pt-8 max-w-2xl mx-auto">
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-2">Smart search</h1>
      <p className="font-body text-on-surface-variant mb-8">
        Ask in plain English — AI finds the right trip, hotel, flight, or place.
      </p>
      <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
