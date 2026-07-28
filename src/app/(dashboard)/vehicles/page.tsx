import { Metadata } from 'next'
import { VehiclesContent } from './vehicles-wrapper'

export const metadata: Metadata = {
  title: 'Vehicles - FleetFlow',
}

export default function VehiclesPage() {
  return <VehiclesContent />
}
