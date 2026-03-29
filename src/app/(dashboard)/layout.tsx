import { Nav } from '@/components/nav'
import { Topbar } from '@/components/topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Topbar />
      <main className="pb-28">{children}</main>
      <Nav />
    </div>
  )
}
