import { Metadata } from 'next'
import { MaintenanceContent } from './maintenance-wrapper'

export const metadata: Metadata = {
  title: 'Maintenance - FleetFlow',
}

export default function MaintenancePage() {
  return <MaintenanceContent />
}