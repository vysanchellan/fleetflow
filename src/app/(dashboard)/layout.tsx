import { Providers } from '@/components/layout/providers'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DashboardShell>{children}</DashboardShell>
    </Providers>
  )
}
