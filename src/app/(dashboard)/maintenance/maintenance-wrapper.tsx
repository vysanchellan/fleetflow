'use client'

import dynamic from 'next/dynamic'

const MaintenanceView = dynamic(() => import('./maintenance-view').then(m => ({ default: m.MaintenanceView })), { ssr: false })

export function MaintenanceContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Maintenance</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Track and manage vehicle maintenance
        </p>
      </div>
      <MaintenanceView />
    </div>
  )
}
