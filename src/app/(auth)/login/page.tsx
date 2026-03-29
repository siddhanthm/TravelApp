import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from './google-sign-in-button'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/trips')

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="bg-surface-container-lowest rounded-xl p-10 shadow-ambient max-w-sm w-full text-center">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome back</h1>
        <p className="font-body text-on-surface-variant mb-8">Sign in to open your field journal</p>
        <GoogleSignInButton />
      </div>
    </main>
  )
}
