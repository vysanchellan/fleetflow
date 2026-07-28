'use client'

import { type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  className,
  ...props
}: CheckboxProps) {
  const generatedId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`

  return (
    <label
      htmlFor={generatedId}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer group',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={generatedId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          aria-checked={checked}
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
            checked
              ? 'bg-blue-500 border-blue-500'
              : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-500',
            'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2 focus-within:ring-offset-neutral-950',
            disabled && 'group-hover:border-neutral-700',
          )}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-neutral-300 select-none">{label}</span>
      )}
    </label>
  )
}
