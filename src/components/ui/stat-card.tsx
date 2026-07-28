'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  icon?: ReactNode
  label?: string
  value?: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'glass'
  className?: string
}

const variantStyles = {
  default: 'bg-neutral-900 border border-neutral-800/50',
  glass:
    'bg-black/40 backdrop-blur-xl border border-neutral-800/30',
}

export function StatCard({
  icon,
  label = 'Stat',
  value = '—',
  trend,
  trendValue,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl p-5',
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        {label && (
          <span className="text-sm font-medium text-neutral-400">{label}</span>
        )}
        {icon && (
          <span className="h-5 w-5 text-neutral-500 shrink-0">{icon}</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-neutral-100 tracking-tight">
          {value}
        </span>
        {trend && trendValue && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-neutral-400',
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-3.5 w-3.5" />
            ) : null}
            {trendValue}
          </span>
        )}
      </div>
    </motion.div>
  )
}
