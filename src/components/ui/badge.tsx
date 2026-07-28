'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-neutral-800 text-neutral-300 border-neutral-700/50',
  primary: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  secondary: 'bg-neutral-700/30 text-neutral-300 border-neutral-600/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border-red-500/25',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  outline: 'bg-transparent text-neutral-400 border-neutral-700/50',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  dot?: boolean
  children: ReactNode
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'default' && 'bg-neutral-400',
            variant === 'primary' && 'bg-blue-400',
            variant === 'secondary' && 'bg-neutral-300',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'info' && 'bg-sky-400',
            variant === 'outline' && 'bg-neutral-400',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
