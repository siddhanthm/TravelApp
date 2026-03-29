'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-3">Something went wrong</h1>
        <p className="font-body text-on-surface-variant mb-8">{error.message}</p>
        <Button variant="primary" onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
