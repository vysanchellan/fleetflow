'use client'

import { useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Timeline, type TimelineItem } from '@/components/ui/timeline'
import { maintenanceRecords, fuelLogs, inspections } from '@/data'
import { formatDate, formatCurrency } from '@/lib/utils'
import { fadeInUp } from '@/animations'
import { Wrench, Fuel, ClipboardList } from 'lucide-react'

interface VehicleTimelineProps {
  vehicleId: string
}

interface TimelineEvent {
  date: Date
  type: 'maintenance' | 'fuel' | 'inspection'
  title: string
  description: string
  icon: ReactNode
  status: TimelineItem['status']
}

export function VehicleTimeline({ vehicleId }: VehicleTimelineProps) {
  const events = useMemo(() => {
    const allEvents: TimelineEvent[] = []

    const vehicleMaintenance = maintenanceRecords.filter((m) => m.vehicleId === vehicleId)
    for (const m of vehicleMaintenance) {
      allEvents.push({
        date: new Date(m.completedDate ?? m.scheduledDate),
        type: 'maintenance',
        title: m.serviceType,
        description: `${m.workshop} \u2014 ${formatCurrency(m.cost)}`,
        icon: <Wrench className="h-4 w-4" />,
        status: m.status === 'completed' ? 'completed' : m.status === 'in_progress' ? 'current' : m.status === 'pending' ? 'pending' : 'error',
      })
    }

    const vehicleFuel = fuelLogs.filter((f) => f.vehicleId === vehicleId)
    for (const f of vehicleFuel) {
      allEvents.push({
        date: new Date(f.date),
        type: 'fuel',
        title: `${f.gallons} gal \u2014 ${f.station}`,
        description: `${f.mpg} MPG \u2022 ${formatCurrency(f.totalCost)}`,
        icon: <Fuel className="h-4 w-4" />,
        status: 'completed',
      })
    }

    const vehicleInspections = inspections.filter((i) => i.vehicleId === vehicleId)
    for (const ins of vehicleInspections) {
      allEvents.push({
        date: new Date(ins.date),
        type: 'inspection',
        title: `${ins.type.replace(/_/g, ' ')} Inspection`,
        description: `Result: ${ins.result} \u2014 ${ins.inspector}`,
        icon: <ClipboardList className="h-4 w-4" />,
        status: ins.result === 'pass' ? 'completed' : ins.result === 'conditional' ? 'current' : 'error',
      })
    }

    allEvents.sort((a, b) => b.date.getTime() - a.date.getTime())

    return allEvents.slice(0, 20)
  }, [vehicleId])

  const groupedEvents = useMemo(() => {
    const groups: Array<{ month: string; events: TimelineItem[] }> = []
    let currentMonth = ''

    for (const event of events) {
      const monthKey = event.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (monthKey !== currentMonth) {
        currentMonth = monthKey
        groups.push({ month: monthKey, events: [] })
      }
      groups[groups.length - 1].events.push({
        icon: event.icon,
        title: event.title,
        description: event.description,
        date: formatDate(event.date),
        status: event.status,
      })
    }

    return groups
  }, [events])

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <ClipboardList className="h-10 w-10 text-neutral-600" />
        <p className="text-neutral-500 text-sm">No activity recorded for this vehicle.</p>
      </div>
    )
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-8">
      {groupedEvents.map((group) => (
        <div key={group.month}>
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {group.month}
          </h3>
          <Timeline items={group.events} />
        </div>
      ))}
    </motion.div>
  )
}
