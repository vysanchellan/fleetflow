import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { vehicles } from '@/data'
import { VehicleDetailContent } from './vehicle-detail-wrapper'

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

  return <VehicleDetailContent vehicleId={id} />
}
