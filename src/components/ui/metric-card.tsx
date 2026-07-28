'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  icon?: ReactNode
  title?: string
  value?: string | number
  subtitle?: string
  chartData?: number[]
  trend?: 'up' | 'down'
  onClick?: () => void
  className?: string
}

export function MetricCard({
  icon,
  title = 'Metric',
  value = '—',
  subtitle,
  chartData,
  trend,
  onClick,
  className,
}: MetricCardProps) {
  const maxVal = chartData ? Math.max(...chartData) : 1

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'rounded-xl bg-neutral-900 border border-neutral-800/50 p-5',
        'hover:border-neutral-700/50 transition-colors duration-200',
        onClick && 'cursor-pointer',
        className,
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick() } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <span className="h-4 w-4 text-neutral-400">{icon}</span>
            </span>
          )}
          <span className="text-sm font-medium text-neutral-400">{title}</span>
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-emerald-400' : 'text-red-400',
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold text-neutral-100 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-neutral-500 mt-0.5">{subtitle}</div>
          )}
        </div>
        {chartData && chartData.length > 0 && (
          <div className="flex items-end gap-[2px] h-10">
            {chartData.map((point, i) => (
              <div
                key={i}
                className="w-2 rounded-sm bg-blue-500/30"
                style={{
                  height: `${(point / maxVal) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
