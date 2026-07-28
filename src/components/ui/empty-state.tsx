'use client'

import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
    >
      <div className="h-14 w-14 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
        {icon ? (
          <span className="h-6 w-6 text-neutral-500">{icon}</span>
        ) : (
          <Inbox className="h-6 w-6 text-neutral-500" />
        )}
      </div>
      <h3 className="text-base font-semibold text-neutral-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-neutral-400 max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
