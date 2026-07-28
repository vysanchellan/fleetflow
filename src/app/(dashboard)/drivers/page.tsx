import { Metadata } from 'next'
import { DriversTable } from '@/features/drivers/drivers-table'

export const metadata: Metadata = {
  title: 'Drivers - FleetFlow',
}

export default function DriversPage() {
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
