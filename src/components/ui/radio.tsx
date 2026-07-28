'use client'

import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
}

export interface RadioProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  name?: string
  className?: string
}

export function Radio({
  options,
  value,
  onChange,
  name = 'radio-group',
  className,
}: RadioProps) {
  const groupName = name || `radio-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className={cn('flex flex-col gap-3', className)} role="radiogroup">
      {options.map((opt) => {
        const isSelected = value === opt.value
        const id = `${groupName}-${opt.value}`

        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              'inline-flex items-center gap-3 cursor-pointer group',
            )}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                id={id}
                name={groupName}
                value={opt.value}
                checked={isSelected}
                onChange={(e) => e.target.checked && onChange?.(opt.value)}
                className="sr-only"
                aria-checked={isSelected}
              />
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                  isSelected
                    ? 'border-blue-500'
                    : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-500',
                  'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2 focus-within:ring-offset-neutral-950',
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
            <span className="text-sm text-neutral-300 select-none">
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
