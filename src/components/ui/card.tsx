'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-neutral-900 border border-neutral-800/50 shadow-sm',
  glass:
    'bg-black/40 backdrop-blur-xl border border-neutral-800/30 shadow-lg shadow-neutral-900/50',
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles
  hoverable?: boolean
  children: ReactNode
}

export function Card({
  variant = 'default',
  hoverable = false,
  className,
  children,
}: CardProps) {
  if (hoverable) {
    return (
      <motion.div
        className={cn(
          'rounded-xl cursor-pointer',
          variantStyles[variant],
          'hover:border-neutral-700/50 transition-colors duration-200',
          className,
        )}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-neutral-100', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-neutral-400 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-neutral-800/50 flex items-center gap-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
