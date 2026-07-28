'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type TimelineStatus = 'completed' | 'current' | 'pending' | 'error'

const statusColors: Record<TimelineStatus, string> = {
  completed: 'bg-emerald-500',
  current: 'bg-blue-500',
  pending: 'bg-neutral-700',
  error: 'bg-red-500',
}

const statusPulse: Record<TimelineStatus, boolean> = {
  completed: false,
  current: true,
  pending: false,
  error: false,
}

export interface TimelineItem {
  icon?: ReactNode
  title?: string
  description?: string
  date?: string
  status?: TimelineStatus
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        const status = item.status ?? 'pending'

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-neutral-800" />
            )}

            {/* Icon / dot */}
            <div className="relative z-10 mt-1">
              {item.icon ? (
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    statusColors[status],
                  )}
                >
                  <span className="h-4 w-4 text-white">{item.icon}</span>
                </div>
              ) : (
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      'h-[10px] w-[10px] rounded-full',
                      statusColors[status],
                      statusPulse[status] && 'animate-pulse',
                    )}
                  />
                  {status === 'current' && (
                    <div className="absolute h-5 w-5 rounded-full bg-blue-500/20 animate-ping" />
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                {item.title && (
                  <span className="text-sm font-medium text-neutral-100">
                    {item.title}
                  </span>
                )}
                {item.date && (
                  <span className="text-xs text-neutral-500 shrink-0">
                    {item.date}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
