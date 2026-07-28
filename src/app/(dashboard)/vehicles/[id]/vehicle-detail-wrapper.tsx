'use client'

import dynamic from 'next/dynamic'

const VehicleDetail = dynamic(() => import('@/features/vehicles/vehicle-detail').then(m => ({ default: m.VehicleDetail })), { ssr: false })
const VehicleHealth = dynamic(() => import('@/features/vehicles/vehicle-health').then(m => ({ default: m.VehicleHealth })), { ssr: false })
const VehicleTimeline = dynamic(() => import('@/features/vehicles/vehicle-timeline').then(m => ({ default: m.VehicleTimeline })), { ssr: false })

export function VehicleDetailContent({ vehicleId }: { vehicleId: string }) {
  return (
    <div className="space-y-6">
      <VehicleDetail vehicleId={vehicleId} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VehicleHealth vehicleId={vehicleId} />
        </div>
        <div className="lg:col-span-2">
          <VehicleTimeline vehicleId={vehicleId} />
        </div>
      </div>
    </div>
  )
}
