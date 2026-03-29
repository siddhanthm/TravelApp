'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Search, Bell, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'

export function Topbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const name = user?.user_metadata?.full_name as string | undefined
  const initial = name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-[20px]">
      <div className="flex items-center gap-4 px-6 h-16 max-w-7xl mx-auto">

        {/* App name */}
        <Link
          href="/trips"
          className="shrink-0 font-headline font-bold text-xl text-on-surface rounded-xl transition-opacity hover:opacity-75"
        >
          Portkey
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trips, hotels, places…"
              className={cn(
                'w-full bg-surface-container-high rounded-xl',
                'pl-10 pr-4 py-2.5 font-body text-sm text-on-surface',
                'placeholder:text-on-surface-variant',
                'focus:outline-none focus:ring-2 focus:ring-primary-fixed/50',
              )}
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">

          {/* Bell */}
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="Profile menu"
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-surface-container-high hover:ring-2 hover:ring-primary-fixed/50 transition-all"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name ?? 'Profile'}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="font-label text-sm font-medium text-on-surface">{initial}</span>
                )}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className={cn(
                  'z-50 min-w-[200px] p-1.5',
                  'bg-surface-container-lowest rounded-xl shadow-ambient',
                  'data-[state=open]:animate-in data-[state=closed]:animate-out',
                  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                  'origin-top-right',
                )}
              >
                {/* User info */}
                <div className="px-3 py-2.5 mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={name ?? ''} width={32} height={32} className="object-cover w-full h-full" />
                      ) : (
                        <User className="w-4 h-4 text-on-surface-variant" />
                      )}
                    </div>
                    <div className="min-w-0">
                      {name && (
                        <p className="font-body text-sm font-medium text-on-surface truncate">{name}</p>
                      )}
                      <p className="font-label text-xs tracking-[0.05rem] text-on-surface-variant truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider via background shift — no border */}
                <div className="h-px bg-surface-container mx-1 mb-1" />

                <DropdownMenu.Item
                  onSelect={handleSignOut}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl',
                    'font-body text-sm text-on-surface',
                    'cursor-pointer select-none outline-none',
                    'hover:bg-surface-container focus:bg-surface-container',
                    'transition-colors',
                  )}
                >
                  <LogOut className="w-4 h-4 text-on-surface-variant" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

        </div>
      </div>
    </header>
  )
}
