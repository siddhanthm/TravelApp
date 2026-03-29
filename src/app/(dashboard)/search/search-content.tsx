'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Search } from 'lucide-react'

interface SearchApiResult {
  results: {
    matchedEntityIds: string[]
    type: 'hotel' | 'flight' | 'place' | 'trip'
    rationale: string
  } | null
  tier1Count: number
  query: string
  error?: string
}

export function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchApiResult | null>(null)

  // Auto-trigger search when arriving from topbar with a pre-filled query
  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    runSearch(query)
  }

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Hotels in Tokyo with pool…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="cta" type="submit" disabled={loading} className="gap-2 shrink-0">
          {loading ? <Spinner className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          Search
        </Button>
      </form>

      {result && (
        <div className="flex flex-col gap-4">
          <p className="font-label text-sm tracking-[0.05rem] text-on-surface-variant">
            {result.tier1Count} initial matches · AI filtered to {result.results?.matchedEntityIds.length ?? 0} results
          </p>

          {result.results ? (
            <Card>
              <p className="font-label text-xs tracking-[0.05rem] text-on-surface-variant mb-2 uppercase">
                {result.results.type}s
              </p>
              <p className="font-body text-on-surface mb-4">{result.results.rationale}</p>
              <div className="flex flex-col gap-2">
                {result.results.matchedEntityIds.map((id) => (
                  <div key={id} className="bg-surface-container rounded-xl px-4 py-3">
                    <p className="font-label text-xs tracking-[0.05rem] text-on-surface-variant">{id}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <p className="font-body text-on-surface-variant">
                {result.error ?? 'No results found for your query.'}
              </p>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
