'use client'

import dynamic from 'next/dynamic'

const DriversTable = dynamic(() => import('@/features/drivers/drivers-table').then(m => ({ default: m.DriversTable })), { ssr: false })

export function DriversContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Drivers</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your driver workforce
        </p>
      </div>
      <DriversTable />
    </div>
  )
}
