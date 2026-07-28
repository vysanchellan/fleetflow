'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
  separator?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  className?: string
}

export function Dropdown({
  trigger,
  items,
  align = 'start',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-50 mt-2 min-w-[14rem] rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 py-1.5',
              align === 'end' ? 'right-0' : 'left-0',
            )}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            role="menu"
          >
            {items.map((item, idx) => (
              <div key={idx}>
                {item.separator && idx > 0 && (
                  <div className="my-1.5 border-t border-neutral-800/50" />
                )}
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:bg-neutral-800',
                    item.variant === 'danger'
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100',
                    item.disabled && 'opacity-40 pointer-events-none',
                  )}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className="h-4 w-4 shrink-0">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
