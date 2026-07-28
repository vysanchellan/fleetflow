import { Metadata } from 'next'
import { VehiclesTable } from '@/features/vehicles/vehicles-table'

export const metadata: Metadata = {
  title: 'Vehicles - FleetFlow',
}

export default function VehiclesPage() {
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
