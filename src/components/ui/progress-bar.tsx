'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export interface ProgressBarProps {
  value?: number
  max?: number
  label?: string
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  variant = 'default',
  size = 'md',
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-neutral-300">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-neutral-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-neutral-800 overflow-hidden',
          sizeStyles[size],
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <motion.div
          className={cn('h-full rounded-full', variantStyles[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
