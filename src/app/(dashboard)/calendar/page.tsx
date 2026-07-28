import { Metadata } from 'next'
import { CalendarContent } from './calendar-wrapper'

export const metadata: Metadata = {
  title: 'Calendar - FleetFlow',
}

export default function CalendarPage() {
  return <CalendarContent />
}
