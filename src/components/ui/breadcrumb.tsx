'use client'

import { type ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          const content = (
            <span className="flex items-center gap-1.5">
              {item.icon ? (
                <span className="h-4 w-4 shrink-0">{item.icon}</span>
              ) : idx === 0 ? (
                <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : null}
              {item.label}
            </span>
          )

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-neutral-600 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="text-neutral-100 font-medium"
                  aria-current="page"
                >
                  {content}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  className="text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                >
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
