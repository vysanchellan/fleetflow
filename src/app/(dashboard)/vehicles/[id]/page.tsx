import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { VehicleDetail } from '@/features/vehicles/vehicle-detail'
import { vehicles } from '@/data'
import { VehicleHealth } from '@/features/vehicles/vehicle-health'
import { VehicleTimeline } from '@/features/vehicles/vehicle-timeline'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const vehicle = vehicles.find(v => v.id === id)
  if (!vehicle) return { title: 'Vehicle Not Found - FleetFlow' }
  return {
    title: `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model} - FleetFlow`,
  }
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params
  const vehicle = vehicles.find(v => v.id === id)
  if (!vehicle) notFound()

  return (
    <div className="space-y-6">
      <VehicleDetail vehicleId={id} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VehicleHealth vehicleId={id} />
        </div>
        <div className="lg:col-span-2">
          <VehicleTimeline vehicleId={id} />
        </div>
      </div>
    </div>
  )
}
