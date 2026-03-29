'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/trips', label: 'Trips', icon: Map },
  { href: '/search', label: 'Search', icon: Search },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface/80 backdrop-blur-[20px] rounded-xl shadow-ambient px-6 py-3 flex items-center gap-6">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-col items-center gap-1 font-label text-xs tracking-[0.05rem] transition-colors rounded-xl px-3 py-2',
            pathname.startsWith(href)
              ? 'text-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
