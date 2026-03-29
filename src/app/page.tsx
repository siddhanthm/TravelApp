import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <p className="font-label text-sm tracking-[0.05rem] text-on-surface-variant uppercase mb-4">
          Your Digital Field Journal
        </p>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface leading-tight max-w-3xl mb-6">
          Travel planning,{' '}
          <span className="text-primary">beautifully</span>{' '}
          organised
        </h1>
        <p className="font-body text-lg text-on-surface-variant max-w-xl mb-10">
          Plan trips, collaborate with friends in real time, and find anything instantly with AI-powered search.
        </p>
        <Link
          href="/login"
          className="rounded-xl px-8 py-4 font-body font-semibold bg-secondary text-on-secondary hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Start planning for free
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Real-time collaboration', body: 'Invite friends and plan together. Changes appear instantly for everyone.' },
            { title: 'Smart AI search', body: 'Ask in plain English. Our AI finds the right trip, hotel, or flight instantly.' },
            { title: 'Everything in one place', body: 'Hotels, flights, and places — all organised under each trip.' },
          ].map((f) => (
            <div key={f.title} className="bg-surface-container-lowest rounded-xl p-6 shadow-card">
              <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">{f.title}</h3>
              <p className="font-body text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
