import { Metadata } from 'next'
import { DriversContent } from './drivers-wrapper'

export const metadata: Metadata = {
  title: 'Drivers - FleetFlow',
}

export default function DriversPage() {
  return <DriversContent />
}
