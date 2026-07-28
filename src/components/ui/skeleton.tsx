'use client'

import { cn } from '@/lib/utils'

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'table' | 'chart'
  className?: string
  lines?: number
}

export function Skeleton({
  variant = 'text',
  className,
  lines = 3,
}: SkeletonProps) {
  const base = 'animate-pulse rounded-lg bg-neutral-800/50'

  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(base, 'h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl bg-neutral-900 border border-neutral-800/50 p-6', className)} aria-hidden="true">
        <div className={cn(base, 'h-5 w-1/3 mb-4')} />
        <div className={cn(base, 'h-8 w-1/2 mb-3')} />
        <div className={cn(base, 'h-4 w-2/3')} />
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('flex flex-col gap-3', className)} aria-hidden="true">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={cn(base, 'h-4 flex-1')} />
          ))}
        </div>
        {Array.from({ length: lines }).map((_, row) => (
          <div key={row} className="flex gap-4 pt-3 border-t border-neutral-800/30">
            {Array.from({ length: 4 }).map((_, col) => (
              <div
                key={col}
                className={cn(base, 'h-4 flex-1', col === 0 ? 'w-1/4' : '')}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div className={cn('flex items-end gap-2 h-48', className)} aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(base, 'flex-1')}
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    )
  }

  return null
}
