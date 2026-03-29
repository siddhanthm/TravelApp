import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TripNotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-3">Trip not found</h1>
        <p className="font-body text-on-surface-variant mb-8">This trip doesn't exist or you don't have access.</p>
        <Button asChild variant="primary">
          <Link href="/trips">Back to trips</Link>
        </Button>
      </div>
    </div>
  )
}
