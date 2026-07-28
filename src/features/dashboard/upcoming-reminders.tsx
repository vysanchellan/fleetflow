'use client'

import { Wrench, ClipboardCheck, FileText, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { maintenanceRecords, documents, inspections } from '@/data'
import { cn, getDaysUntil, getStatusFromDays } from '@/lib/utils'

interface Reminder {
  type: 'maintenance' | 'inspection' | 'expiration'
  title: string
  subtitle: string
  daysUntil: number
}

function getReminders(): Reminder[] {
  const now = new Date()
  const results: Reminder[] = []

  const upcomingMaint = maintenanceRecords.filter(m =>
    (m.status === 'pending' || m.status === 'in_progress') && new Date(m.scheduledDate) > now
  )
  for (const m of upcomingMaint) {
    results.push({
      type: 'maintenance',
      title: m.serviceType,
      subtitle: `${m.vehicleId} — ${m.workshop}`,
      daysUntil: getDaysUntil(m.scheduledDate),
    })
  }

  if (results.length < 5) {
    const pendingDocs = documents.filter(d => d.expiresAt && new Date(d.expiresAt) > now)
    for (const d of pendingDocs) {
      if (results.length >= 5) break
      results.push({
        type: 'expiration',
        title: d.name,
        subtitle: `${d.category} — ${d.vehicleId || d.driverId || ''}`,
        daysUntil: getDaysUntil(d.expiresAt!),
      })
    }
  }

  if (results.length < 5) {
    const scheduledInsp = inspections.filter(i => i.type === 'scheduled')
    for (const i of scheduledInsp) {
      if (results.length >= 5) break
      const days = getDaysUntil(i.date)
      if (days > 0) {
        results.push({
          type: 'inspection',
          title: 'Scheduled Inspection',
          subtitle: `${i.vehicleId} — ${i.inspector}`,
          daysUntil: days,
        })
      }
    }
  }

  return results.slice(0, 5).sort((a, b) => a.daysUntil - b.daysUntil)
}

const typeIcons = {
  maintenance: <Wrench className="h-4 w-4" />,
  inspection: <ClipboardCheck className="h-4 w-4" />,
  expiration: <FileText className="h-4 w-4" />,
}

export function UpcomingReminders() {
  const reminders = getReminders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.length === 0 && (
          <p className="text-sm text-neutral-500">No upcoming reminders</p>
        )}
        {reminders.map((reminder, idx) => {
          const severity = getStatusFromDays(reminder.daysUntil)
          return (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                severity === 'danger' && 'bg-red-500/10 border-red-500/20',
                severity === 'warning' && 'bg-amber-500/10 border-amber-500/20',
                severity === 'success' && 'bg-emerald-500/10 border-emerald-500/20',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                  severity === 'danger' && 'bg-red-500/20 text-red-400',
                  severity === 'warning' && 'bg-amber-500/20 text-amber-400',
                  severity === 'success' && 'bg-emerald-500/20 text-emerald-400',
                )}
              >
                {typeIcons[reminder.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-100">{reminder.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{reminder.subtitle}</p>
              </div>
              <span
                className={cn(
                  'text-xs font-medium shrink-0 mt-1',
                  severity === 'danger' && 'text-red-400',
                  severity === 'warning' && 'text-amber-400',
                  severity === 'success' && 'text-emerald-400',
                )}
              >
                {reminder.daysUntil === 0 ? 'Today' : `${reminder.daysUntil}d`}
              </span>
            </div>
          )
        })}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href="/maintenance">View All Reminders</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
