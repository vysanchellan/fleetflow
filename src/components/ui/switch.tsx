'use client'

import { type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}

export function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  className,
  ...props
}: SwitchProps) {
  const generatedId = id || `switch-${Math.random().toString(36).slice(2, 9)}`

  return (
    <label
      htmlFor={generatedId}
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer group',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={generatedId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          aria-checked={checked}
          role="switch"
          {...props}
        />
        <div
          className={cn(
            'h-6 w-11 rounded-full transition-colors duration-200 flex items-center',
            checked ? 'bg-blue-500' : 'bg-neutral-700',
            'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2 focus-within:ring-offset-neutral-950',
          )}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'h-5 w-5 rounded-full bg-white shadow-sm',
              checked ? 'ml-[22px]' : 'ml-0.5',
            )}
          />
        </div>
      </div>
      {label && (
        <span className="text-sm text-neutral-300 select-none">{label}</span>
      )}
    </label>
  )
}
