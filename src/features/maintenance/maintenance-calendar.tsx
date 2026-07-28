'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { maintenanceRecords } from '@/data'
import { formatCurrency } from '@/lib/utils'

type DisplayStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'

const statusColors: Record<DisplayStatus, string> = {
  scheduled: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  completed: 'bg-emerald-500',
  overdue: 'bg-red-500',
  cancelled: 'bg-neutral-500',
}

const statusLabels: Record<DisplayStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

const badgeVariant: Record<DisplayStatus, 'primary' | 'warning' | 'success' | 'danger' | 'secondary'> = {
  scheduled: 'primary',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'danger',
  cancelled: 'secondary',
}

function getDisplayStatus(status: string, scheduledDate: string): DisplayStatus {
  if (status === 'pending' && new Date(scheduledDate) < new Date()) return 'overdue'
  if (status === 'pending') return 'scheduled'
  return status as DisplayStatus
}

interface DayEvent {
  id: string
  vehicleId: string
  serviceType: string
  status: DisplayStatus
  cost: number
  workshop: string
}

interface CalendarDay {
  date: Date
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  events: DayEvent[]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const legend: { status: DisplayStatus; label: string }[] = [
  { status: 'scheduled', label: 'Scheduled' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'completed', label: 'Completed' },
  { status: 'overdue', label: 'Overdue' },
  { status: 'cancelled', label: 'Cancelled' },
]

export function MaintenanceCalendar() {
  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
    setSelectedDate(null)
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
    setSelectedDate(null)
  }, [])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DayEvent[]>()
    for (const r of maintenanceRecords) {
      const dateKey = new Date(r.scheduledDate).toDateString()
      if (!map.has(dateKey)) map.set(dateKey, [])
      map.get(dateKey)!.push({
        id: r.id,
        vehicleId: r.vehicleId,
        serviceType: r.serviceType,
        status: getDisplayStatus(r.status, r.scheduledDate),
        cost: r.cost,
        workshop: r.workshop,
      })
    }
    return map
  }, [])

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const startDay = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const days: CalendarDay[] = []

    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i)
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        events: eventsByDate.get(date.toDateString()) || [],
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      days.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: eventsByDate.get(date.toDateString()) || [],
      })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(currentYear, currentMonth + 1, i)
      days.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        events: eventsByDate.get(date.toDateString()) || [],
      })
    }

    return days
  }, [currentYear, currentMonth, today, eventsByDate])

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return []
    return eventsByDate.get(selectedDate.toDateString()) || []
  }, [selectedDate, eventsByDate])

  const monthLabel = useMemo(() => {
    return new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }, [currentYear, currentMonth])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-base font-semibold text-neutral-100 min-w-40 text-center">
            {monthLabel}
          </h3>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800/50 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-neutral-800/50">
          {DAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(day.date)}
              className={`
                relative min-h-20 px-1.5 py-1.5 text-left border-b border-r border-neutral-800/30
                transition-colors duration-150
                ${day.isCurrentMonth ? 'bg-neutral-900' : 'bg-neutral-950/50'}
                ${day.isToday ? 'ring-1 ring-inset ring-blue-500/50' : ''}
                ${selectedDate && day.date.toDateString() === selectedDate.toDateString() ? 'bg-blue-500/10' : ''}
                hover:bg-neutral-800/50
              `}
            >
              <span
                className={`
                  inline-flex h-6 w-6 items-center justify-center rounded-full text-xs
                  ${day.isToday ? 'bg-blue-500 text-white font-semibold' : ''}
                  ${!day.isToday && day.isCurrentMonth ? 'text-neutral-300' : ''}
                  ${!day.isCurrentMonth ? 'text-neutral-600' : ''}
                  ${day.isToday ? '' : ''}
                `}
              >
                {day.day}
              </span>

              {day.events.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {day.events.slice(0, 4).map((event) => (
                    <span
                      key={event.id}
                      className={`h-1.5 w-1.5 rounded-full ${statusColors[event.status]}`}
                      title={`${event.serviceType} - ${statusLabels[event.status]}`}
                    />
                  ))}
                  {day.events.length > 4 && (
                    <span className="text-[10px] text-neutral-500">+{day.events.length - 4}</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {legend.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${statusColors[item.status]}`} />
            <span className="text-xs text-neutral-400">{item.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedEvents.length > 0 && (
          <motion.div
            key={selectedDate?.toDateString()}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-neutral-800/50 bg-neutral-900/50 p-4"
          >
            <h4 className="text-sm font-semibold text-neutral-100 mb-3">
              Services on {selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h4>
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-100">{event.vehicleId}</span>
                      <Badge variant={badgeVariant[event.status]} size="sm">
                        {statusLabels[event.status]}
                      </Badge>
                    </div>
                    <span className="text-xs text-neutral-400">{event.serviceType}</span>
                    <span className="text-xs text-neutral-500">{event.workshop}</span>
                  </div>
                  <span className="text-sm font-mono text-neutral-200">{formatCurrency(event.cost)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
