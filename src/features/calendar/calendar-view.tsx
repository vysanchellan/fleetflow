'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { maintenanceRecords } from '@/data'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'

type ViewMode = 'month' | 'week'

type EventType = 'maintenance' | 'inspection' | 'license' | 'insurance'

interface CalendarEvent {
  id: string
  title: string
  type: EventType
  date: Date
  vehicleId?: string
}

const eventColors: Record<EventType, string> = {
  maintenance: 'bg-blue-500',
  inspection: 'bg-amber-500',
  license: 'bg-purple-500',
  insurance: 'bg-emerald-500',
}

const eventBadgeVariants: Record<EventType, 'primary' | 'warning' | 'info' | 'success'> = {
  maintenance: 'primary',
  inspection: 'warning',
  license: 'info',
  insurance: 'success',
}

const eventLabels: Record<EventType, string> = {
  maintenance: 'Maintenance',
  inspection: 'Inspection',
  license: 'License',
  insurance: 'Insurance',
}

const legend: { type: EventType; label: string }[] = [
  { type: 'maintenance', label: 'Maintenance' },
  { type: 'inspection', label: 'Inspection' },
  { type: 'license', label: 'License' },
  { type: 'insurance', label: 'Insurance' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekRange(date: Date) {
  const start = new Date(date)
  start.setDate(start.getDate() - start.getDay())
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

function CalendarDayCell({
  day,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
}: {
  day: number
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative min-h-[5.5rem] px-1.5 py-1 text-left border-b border-r border-neutral-800/30 transition-colors duration-150',
        isCurrentMonth ? 'bg-neutral-900' : 'bg-neutral-950/50',
        isToday && 'ring-1 ring-inset ring-blue-500/50',
        isSelected && 'bg-blue-500/10',
        'hover:bg-neutral-800/50',
      )}
    >
      <span
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs mb-1',
          isToday && 'bg-blue-500 text-white font-semibold',
          !isToday && isCurrentMonth && 'text-neutral-300',
          !isCurrentMonth && 'text-neutral-600',
        )}
      >
        {day}
      </span>
      <div className="space-y-0.5">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className={cn(
              'flex items-center gap-1 rounded px-1 py-0.5 truncate',
              eventColors[event.type],
            )}
            title={event.title}
          >
            <span className="text-[10px] text-white font-medium truncate leading-none">
              {event.title}
            </span>
          </div>
        ))}
        {events.length > 3 && (
          <span className="text-[10px] text-neutral-500 pl-1">
            +{events.length - 3} more
          </span>
        )}
      </div>
    </button>
  )
}

export function CalendarView() {
  const today = useMemo(() => new Date(), [])
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('month')

  const goToPrev = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentMonth((prev) => {
        if (prev === 0) { setCurrentYear((y) => y - 1); return 11 }
        return prev - 1
      })
    } else {
      const d = new Date(currentYear, currentMonth, 1)
      d.setDate(d.getDate() - 7)
      setCurrentMonth(d.getMonth())
      setCurrentYear(d.getFullYear())
    }
    setSelectedDate(null)
  }, [viewMode, currentYear, currentMonth])

  const goToNext = useCallback(() => {
    if (viewMode === 'month') {
      setCurrentMonth((prev) => {
        if (prev === 11) { setCurrentYear((y) => y + 1); return 0 }
        return prev + 1
      })
    } else {
      const d = new Date(currentYear, currentMonth, 1)
      d.setDate(d.getDate() + 7)
      setCurrentMonth(d.getMonth())
      setCurrentYear(d.getFullYear())
    }
    setSelectedDate(null)
  }, [viewMode, currentYear, currentMonth])

  const events = useMemo(() => {
    const eventTypes: EventType[] = ['maintenance', 'inspection', 'license', 'insurance']
    const result: CalendarEvent[] = []

    for (const r of maintenanceRecords) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      result.push({
        id: r.id,
        title: r.serviceType,
        type,
        date: new Date(r.scheduledDate),
        vehicleId: r.vehicleId,
      })
    }

    return result
  }, [])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const key = e.date.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    }
    return map
  }, [events])

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const startDay = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

    const days: { date: Date; day: number; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }[] = []

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

  const weekDays = useMemo(() => {
    const monthStart = new Date(currentYear, currentMonth, 1)
    const { start, end } = getWeekRange(monthStart)
    const days: { date: Date; day: number; isToday: boolean; events: CalendarEvent[] }[] = []

    let current = new Date(start)
    while (current <= end) {
      days.push({
        date: new Date(current),
        day: current.getDate(),
        isToday: current.toDateString() === today.toDateString(),
        events: eventsByDate.get(current.toDateString()) || [],
      })
      current.setDate(current.getDate() + 1)
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

  const [animateKey, setAnimateKey] = useState(0)
  const handlePrev = useCallback(() => { goToPrev(); setAnimateKey((k) => k + 1) }, [goToPrev])
  const handleNext = useCallback(() => { goToNext(); setAnimateKey((k) => k + 1) }, [goToNext])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-base font-semibold text-neutral-100 min-w-44 text-center">
            {monthLabel}
          </h3>
          <button
            onClick={handleNext}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-neutral-800/50 p-0.5">
          <button
            onClick={() => setViewMode('month')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'month' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-400 hover:text-neutral-200',
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              viewMode === 'week' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-400 hover:text-neutral-200',
            )}
          >
            <CalendarRange className="h-3.5 w-3.5" />
            Week
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${animateKey}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' ? (
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
                  <CalendarDayCell
                    key={idx}
                    day={day.day}
                    date={day.date}
                    events={day.events}
                    isCurrentMonth={day.isCurrentMonth}
                    isToday={day.isToday}
                    isSelected={selectedDate?.toDateString() === day.date.toDateString()}
                    onClick={() => setSelectedDate(day.date)}
                  />
                ))}
              </div>
            </div>
          ) : (
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
                {weekDays.map((day, idx) => (
                  <CalendarDayCell
                    key={idx}
                    day={day.day}
                    date={day.date}
                    events={day.events}
                    isCurrentMonth={true}
                    isToday={day.isToday}
                    isSelected={selectedDate?.toDateString() === day.date.toDateString()}
                    onClick={() => setSelectedDate(day.date)}
                  />
                ))}
                {weekDays.length < 7 &&
                  Array.from({ length: 7 - weekDays.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="min-h-[5.5rem] bg-neutral-950/50 border-b border-r border-neutral-800/30" />
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4">
        {legend.map((item) => (
          <div key={item.type} className="flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded', eventColors[item.type])} />
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
              Events on {selectedDate?.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h4>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {selectedEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  variants={staggerItem}
                  className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', eventColors[event.type])} />
                      <span className="text-sm font-medium text-neutral-100">{event.title}</span>
                      <Badge variant={eventBadgeVariants[event.type]} size="sm">
                        {eventLabels[event.type]}
                      </Badge>
                    </div>
                    {event.vehicleId && (
                      <span className="text-xs text-neutral-500 mt-0.5 ml-4">
                        Vehicle: {event.vehicleId}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
