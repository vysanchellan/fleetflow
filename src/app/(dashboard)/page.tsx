import { Metadata } from 'next'
import { DashboardContent } from './dashboard-wrapper'

export const metadata: Metadata = {
  title: 'Dashboard - FleetFlow',
}

export default function DashboardPage() {
  return <DashboardContent />
}
