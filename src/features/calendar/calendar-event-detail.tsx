'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  Truck,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, cn } from '@/lib/utils'
import { drivers } from '@/data'

type EventType = 'maintenance' | 'inspection' | 'license' | 'insurance'

type Priority = 'low' | 'medium' | 'high' | 'critical'

interface CalendarEventDetailData {
  id: string
  title: string
  type: EventType
  date: string
  vehicleId?: string
  driverId?: string
  description: string
  priority: Priority
  status: 'pending' | 'completed'
}

interface CalendarEventDetailProps {
  event: CalendarEventDetailData | null
  isOpen: boolean
  onClose: () => void
  onMarkComplete?: (id: string) => void
}

const eventColors: Record<EventType, string> = {
  maintenance: 'bg-blue-500',
  inspection: 'bg-amber-500',
  license: 'bg-purple-500',
  insurance: 'bg-emerald-500',
}

const eventAccent: Record<EventType, string> = {
  maintenance: 'border-blue-500/25 bg-blue-500/5',
  inspection: 'border-amber-500/25 bg-amber-500/5',
  license: 'border-purple-500/25 bg-purple-500/5',
  insurance: 'border-emerald-500/25 bg-emerald-500/5',
}

const priorityVariant: Record<Priority, 'danger' | 'warning' | 'primary' | 'secondary'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'primary',
  low: 'secondary',
}

const typeLabels: Record<EventType, string> = {
  maintenance: 'Maintenance',
  inspection: 'Inspection',
  license: 'License',
  insurance: 'Insurance',
}

export function CalendarEventDetail({
  event,
  isOpen,
  onClose,
  onMarkComplete,
}: CalendarEventDetailProps) {
  const driverName = event?.driverId
    ? (() => {
        const d = drivers.find((dr) => dr.id === event.driverId)
        return d ? `${d.firstName} ${d.lastName}` : event.driverId
      })()
    : undefined

  return (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'rounded-xl border overflow-hidden',
            eventAccent[event.type],
          )}
        >
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <div className={cn('h-3 w-3 rounded-full', eventColors[event.type])} />
              <div>
                <h3 className="text-base font-semibold text-neutral-100">
                  {event.title}
                </h3>
                <Badge variant={priorityVariant[event.priority]} size="sm" className="mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {event.priority}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-5 pb-5 space-y-4">
            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <Badge variant={event.status === 'completed' ? 'success' : 'warning'} size="sm">
                {event.status === 'completed' ? 'Completed' : 'Pending'}
              </Badge>
            </div>

            <div>
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Type
              </span>
              <p className="text-sm text-neutral-200 mt-0.5">{typeLabels[event.type]}</p>
            </div>

            {event.vehicleId && (
              <div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Related Vehicle
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Truck className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-200">{event.vehicleId}</span>
                </div>
              </div>
            )}

            {driverName && (
              <div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Related Driver
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <User className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-200">{driverName}</span>
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Description
              </span>
              <p className="text-sm text-neutral-300 mt-0.5 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-neutral-800/30">
              {event.status !== 'completed' && onMarkComplete && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onMarkComplete(event.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
