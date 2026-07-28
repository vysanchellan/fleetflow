'use client'

import dynamic from 'next/dynamic'

const VehiclesTable = dynamic(() => import('@/features/vehicles/vehicles-table').then(m => ({ default: m.VehiclesTable })), { ssr: false })

export function VehiclesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Vehicles</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your fleet vehicles
        </p>
      </div>
      <VehiclesTable />
    </div>
  )
}
