import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { drivers } from '@/data'
import { DriverDetailContent } from './driver-detail-wrapper'

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

  return <DriverDetailContent driver={driver} />
}
