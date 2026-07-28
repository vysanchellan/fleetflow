import { Metadata } from 'next'
import { CalendarView } from '@/features/calendar/calendar-view'

export const metadata: Metadata = {
  title: 'Calendar - FleetFlow',
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Calendar</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Schedule and events overview
        </p>
      </div>
      <CalendarView />
    </div>
  )
}
