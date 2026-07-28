import { Metadata } from 'next'
import { MaintenanceView } from './maintenance-view'

export const metadata: Metadata = {
  title: 'Maintenance - FleetFlow',
}

export default function MaintenancePage() {
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