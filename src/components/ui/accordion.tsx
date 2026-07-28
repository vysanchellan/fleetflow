'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type AccordionType = 'single' | 'multiple'

interface AccordionContextType {
  type: AccordionType
  openValues: string[]
  toggleValue: (value: string) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordionContext() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion components must be used within an Accordion provider')
  return ctx
}

export interface AccordionProps {
  type?: AccordionType
  defaultValue?: string | string[]
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggleValue = useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        if (type === 'single') {
          return prev.includes(value) ? [] : [value]
        }
        return prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      })
    },
    [type],
  )

  return (
    <AccordionContext.Provider value={{ type, openValues, toggleValue }}>
      <div className={cn('divide-y divide-neutral-800/50', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return <div className={cn('py-1', className)}>{children}</div>
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function AccordionTrigger({
  children,
  className,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const { openValues, toggleValue } = useAccordionContext()
  const isOpen = openValues.includes(
    (props as { value?: string }).value ?? '',
  )

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = (e.currentTarget.closest('[data-accordion-value]') as HTMLElement)
      ?.dataset.accordionValue
    if (value) toggleValue(value)
    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between py-3 px-1 text-sm font-medium text-neutral-100',
        'hover:text-neutral-100 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-lg',
        className,
      )}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200',
          isOpen && 'rotate-180',
        )}
      />
    </button>
  )
}

export interface AccordionContentProps {
  children: ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key="content"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className={cn('pb-3 px-1 text-sm text-neutral-400', className)}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
