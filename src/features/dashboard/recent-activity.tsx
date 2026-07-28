'use client'

import { Wrench, Fuel, ClipboardCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Timeline, type TimelineItem } from '@/components/ui/timeline'
import { maintenanceRecords, fuelLogs, inspections } from '@/data'
import { formatDateRelative } from '@/lib/utils'

function getRecentActivity(): TimelineItem[] {
  const now = new Date()

  const maintItems = maintenanceRecords.filter(m => m.status === 'completed').map(m => ({
    icon: <Wrench />,
    title: m.serviceType,
    description: `${m.vehicleId} — ${m.workshop}`,
    date: formatDateRelative(m.completedDate || m.scheduledDate),
    status: 'completed' as const,
    sortDate: new Date(m.completedDate || m.scheduledDate).getTime(),
  }))

  const fuelItems = fuelLogs.map(f => ({
    icon: <Fuel />,
    title: `Fuel — ${f.station.split(' — ')[0]}`,
    description: `${f.vehicleId} · ${f.gallons} gal · $${f.totalCost}`,
    date: formatDateRelative(f.date),
    status: 'completed' as const,
    sortDate: new Date(f.date).getTime(),
  }))

  const inspectionItems = inspections.map(i => ({
    icon: <ClipboardCheck />,
    title: `${i.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Inspection`,
    description: `${i.vehicleId} — ${i.result === 'pass' ? 'Passed' : i.result === 'fail' ? 'Failed' : 'Conditional'}`,
    date: formatDateRelative(i.date),
    status: i.result === 'pass' ? 'completed' as const : i.result === 'fail' ? 'error' as const : 'current' as const,
    sortDate: new Date(i.date).getTime(),
  }))

  return [...maintItems, ...fuelItems, ...inspectionItems]
    .sort((a, b) => b.sortDate - a.sortDate)
    .slice(0, 10)
    .map(({ sortDate, ...item }) => item)
}

export function RecentActivity() {
  const items = getRecentActivity()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline items={items} />
      </CardContent>
    </Card>
  )
}
