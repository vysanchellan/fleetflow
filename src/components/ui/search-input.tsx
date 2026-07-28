'use client'

import { useState, useRef, useEffect, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  debounceMs?: number
}

export function SearchInput({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue ?? '')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue)
    }
  }, [externalValue])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onChange?.(internalValue)
    }, debounceMs)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [internalValue, debounceMs, onChange])

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-lg border border-neutral-800/50 bg-neutral-900 pl-10 pr-10 text-sm text-neutral-100',
          'placeholder:text-neutral-500',
          'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25',
          'transition-all duration-200',
        )}
        aria-label={placeholder}
        {...props}
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
