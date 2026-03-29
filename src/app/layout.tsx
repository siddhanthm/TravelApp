import type { Metadata } from 'next'
import { Epilogue, Manrope } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portkey — Your Digital Field Journal',
  description: 'Plan trips, collaborate in real time, and discover smarter with AI-powered search.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${epilogue.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
