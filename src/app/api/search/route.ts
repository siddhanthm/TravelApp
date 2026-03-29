import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geminiModel, SEARCH_SYSTEM_PROMPT } from '@/lib/gemini'
import { z } from 'zod'

const searchSchema = z.object({
  query: z.string().min(1).max(500),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { query } = searchSchema.parse(body)

    // ── Tier 1: Postgres full-text search ──────────────────────
    const tsQuery = query.trim().split(/\s+/).join(' & ')

    const [tripsResult, hotelsResult, flightsResult, placesResult] = await Promise.all([
      supabase.from('trips').select('id, name, destination, notes, status')
        .textSearch('search_index', tsQuery).limit(15),
      supabase.from('hotels').select('id, name, address, notes, trip_id')
        .textSearch('search_index', tsQuery).limit(15),
      supabase.from('flights').select('id, airline, origin, destination, notes, trip_id')
        .textSearch('search_index', tsQuery).limit(10),
      supabase.from('places').select('id, name, address, category, notes, trip_id')
        .textSearch('search_index', tsQuery).limit(15),
    ])

    const tier1Results = {
      trips: tripsResult.data ?? [],
      hotels: hotelsResult.data ?? [],
      flights: flightsResult.data ?? [],
      places: placesResult.data ?? [],
    }

    const totalResults = tier1Results.trips.length + tier1Results.hotels.length +
      tier1Results.flights.length + tier1Results.places.length

    if (totalResults === 0) {
      return NextResponse.json({ results: null, tier1Count: 0, query })
    }

    // ── Tier 2: Gemini re-ranking ───────────────────────────────
    const contextPrompt = `${SEARCH_SYSTEM_PROMPT}

User query: "${query}"

Matching travel data:
${JSON.stringify(tier1Results, null, 2)}

Return JSON matching the schema: { matchedEntityIds: string[], type: "hotel" | "flight" | "place" | "trip", rationale: string }`

    const geminiResponse = await geminiModel.generateContent(contextPrompt)
    const rawText = geminiResponse.response.text()

    let parsed
    try {
      parsed = JSON.parse(rawText)
    } catch {
      return NextResponse.json({ results: null, tier1Count: totalResults, query, error: 'AI parsing failed' })
    }

    const resultSchema = z.object({
      matchedEntityIds: z.array(z.string()),
      type: z.enum(['hotel', 'flight', 'place', 'trip']),
      rationale: z.string(),
    })

    const validated = resultSchema.parse(parsed)

    return NextResponse.json({
      results: validated,
      tier1Count: totalResults,
      query,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
