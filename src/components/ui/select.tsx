'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSelect = (opt: SelectOption) => {
    onChange?.(opt.value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border bg-neutral-900 px-3 py-2 text-sm transition-all duration-200',
          'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25',
          isOpen
            ? 'border-blue-500/50 ring-1 ring-blue-500/25'
            : 'border-neutral-800/50 hover:border-neutral-700/50',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(selectedOption ? 'text-neutral-100' : 'text-neutral-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-neutral-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-1 w-full rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 py-1.5 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={cn(
                  'flex w-full items-center px-3 py-2 text-sm transition-colors duration-150',
                  'focus-visible:outline-none',
                  opt.value === value
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100',
                )}
                role="option"
                aria-selected={opt.value === value}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
