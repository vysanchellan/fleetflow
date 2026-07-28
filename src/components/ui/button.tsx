'use client'

import { forwardRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const variantStyles = {
  primary:
    'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-500/20',
  secondary:
    'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/50',
  ghost: 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/20',
  outline:
    'border border-neutral-700/50 text-neutral-100 hover:bg-neutral-800 hover:border-neutral-600',
}

const sizeStyles = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-10 w-10 p-0',
}

export interface ButtonProps {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  isLoading?: boolean
  fullWidth?: boolean
  asChild?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      className,
      children,
      type = 'button',
      onClick,
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-medium',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
          'disabled:opacity-50 disabled:pointer-events-none',
          'select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        )}
        <span className={cn(isLoading && 'opacity-70')}>{children}</span>
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
