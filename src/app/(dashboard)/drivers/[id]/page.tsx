import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { drivers } from '@/data'
import { DriverDetail } from '@/features/drivers/driver-detail'
import { DriverPerformance } from '@/features/drivers/driver-performance'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const driver = drivers.find(d => d.id === id)
  if (!driver) return { title: 'Driver Not Found - FleetFlow' }
  return {
    title: `${driver.firstName} ${driver.lastName} - Driver - FleetFlow`,
  }
}

export default async function DriverDetailPage({ params }: Props) {
  const { id } = await params
  const driver = drivers.find(d => d.id === id)
  if (!driver) notFound()

  return (
    <div className="space-y-6">
      <DriverDetail driver={driver} />
      <DriverPerformance driver={driver} />
    </div>
  )
}
