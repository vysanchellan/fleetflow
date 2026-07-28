'use client'

import dynamic from 'next/dynamic'

const CalendarView = dynamic(() => import('@/features/calendar/calendar-view').then(m => ({ default: m.CalendarView })), { ssr: false })

export function CalendarContent() {
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
