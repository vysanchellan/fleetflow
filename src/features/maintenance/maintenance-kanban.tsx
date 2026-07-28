'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { maintenanceRecords, vehicles } from '@/data'
import { formatCurrency, formatDate } from '@/lib/utils'

type DisplayStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'

const statusBadgeVariant: Record<DisplayStatus, 'primary' | 'warning' | 'success' | 'danger' | 'secondary'> = {
  scheduled: 'primary',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'danger',
  cancelled: 'secondary',
}

const priorityBadgeVariant: Record<string, 'primary' | 'warning' | 'danger' | 'secondary'> = {
  low: 'secondary',
  medium: 'primary',
  high: 'warning',
  critical: 'danger',
}

const statusLabels: Record<DisplayStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

const columnOrder: DisplayStatus[] = ['scheduled', 'in_progress', 'completed', 'overdue', 'cancelled']

const columnColors: Record<DisplayStatus, string> = {
  scheduled: 'border-t-blue-500/50',
  in_progress: 'border-t-amber-500/50',
  completed: 'border-t-emerald-500/50',
  overdue: 'border-t-red-500/50',
  cancelled: 'border-t-neutral-500/50',
}

function getDisplayStatus(status: string, scheduledDate: string): DisplayStatus {
  if (status === 'pending' && new Date(scheduledDate) < new Date()) return 'overdue'
  if (status === 'pending') return 'scheduled'
  return status as DisplayStatus
}

interface CardData {
  id: string
  vehiclePlate: string
  vehicleModel: string
  serviceType: string
  priority: string
  scheduledDate: string
  cost: number
  workshop: string
  status: DisplayStatus
}

export function MaintenanceKanban() {
  const vehicleMap = useMemo(() => {
    const map = new Map<string, { plateNumber: string; make: string; model: string }>()
    for (const v of vehicles) {
      map.set(v.id, v)
    }
    return map
  }, [])

  const columns = useMemo(() => {
    const grouped: Record<DisplayStatus, CardData[]> = {
      scheduled: [],
      in_progress: [],
      completed: [],
      overdue: [],
      cancelled: [],
    }

    for (const r of maintenanceRecords) {
      const displayStatus = getDisplayStatus(r.status, r.scheduledDate)
      const vehicle = vehicleMap.get(r.vehicleId)
      grouped[displayStatus].push({
        id: r.id,
        vehiclePlate: vehicle?.plateNumber ?? r.vehicleId,
        vehicleModel: vehicle ? `${vehicle.make} ${vehicle.model}` : '',
        serviceType: r.serviceType,
        priority: r.priority,
        scheduledDate: r.scheduledDate,
        cost: r.cost,
        workshop: r.workshop,
        status: displayStatus,
      })
    }

    return grouped
  }, [vehicleMap])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columnOrder.map((colStatus) => {
        const items = columns[colStatus]
        return (
          <div
            key={colStatus}
            className={`flex w-72 shrink-0 flex-col rounded-xl border border-neutral-800/50 bg-neutral-900/50 border-t-2 ${columnColors[colStatus]}`}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800/50">
              <span className="text-sm font-semibold text-neutral-100">
                {statusLabels[colStatus]}
              </span>
              <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-neutral-800 px-1.5 text-xs font-medium text-neutral-400">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {items.length === 0 ? (
                <EmptyState
                  title="No items"
                  description=""
                  className="py-8"
                />
              ) : (
                items.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-neutral-800/50 bg-neutral-900 p-3.5 cursor-grab active:cursor-grabbing shadow-sm hover:border-neutral-700/50 transition-colors duration-200"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-100">
                          {card.vehiclePlate}
                        </span>
                        {card.vehicleModel && (
                          <span className="text-xs text-neutral-500">{card.vehicleModel}</span>
                        )}
                      </div>
                      <Badge variant={priorityBadgeVariant[card.priority] || 'secondary'} size="sm">
                        {card.priority}
                      </Badge>
                    </div>

                    <span className="block text-xs text-neutral-300 mb-2.5">
                      {card.serviceType}
                    </span>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{formatDate(card.scheduledDate)}</span>
                      <span className="font-mono text-neutral-300">{formatCurrency(card.cost)}</span>
                    </div>

                    <span className="block text-xs text-neutral-500 mt-1.5 truncate">
                      {card.workshop}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
