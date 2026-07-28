'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notifications } from '@/data'
import { formatDateRelative, cn } from '@/lib/utils'
import { staggerItem } from '@/animations'

interface AlertItem {
  id: string
  title: string
  message: string
  priority: string
  vehicleId?: string
  driverId?: string
  time: string
}

const priorityIcon = {
  critical: <AlertTriangle className="h-4 w-4" />,
  high: <AlertCircle className="h-4 w-4" />,
  medium: <Info className="h-4 w-4" />,
  low: <Info className="h-4 w-4" />,
}

const priorityBadge: Record<string, 'danger' | 'warning' | 'info'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'info',
}

function getAlerts(): AlertItem[] {
  return notifications
    .filter(n => !n.read && (n.priority === 'critical' || n.priority === 'high'))
    .slice(0, 5)
    .map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      priority: n.priority,
      vehicleId: n.vehicleId,
      driverId: n.driverId,
      time: formatDateRelative(n.createdAt),
    }))
}

export function Alerts() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const alerts = getAlerts().filter(a => !dismissed.has(a.id))

  const dismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 && (
          <p className="text-sm text-neutral-500">No active alerts</p>
        )}
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              layout
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                alert.priority === 'critical'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-amber-500/10 border-amber-500/20',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                  alert.priority === 'critical'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400',
                )}
              >
                {priorityIcon[alert.priority as keyof typeof priorityIcon]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-neutral-100">{alert.title}</p>
                  <Badge
                    variant={priorityBadge[alert.priority]}
                    size="sm"
                  >
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{alert.message}</p>
                <p className="text-[11px] text-neutral-500 mt-1">{alert.time}</p>
              </div>
              <button
                onClick={() => dismiss(alert.id)}
                className="mt-0.5 h-5 w-5 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
