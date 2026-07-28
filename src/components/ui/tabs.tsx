'use client'

import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
  type HTMLAttributes,
  useCallback,
} from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
  activeRef: React.RefObject<HTMLButtonElement | null>
  indicatorStyle: { left: number; width: number }
  setIndicatorStyle: (style: { left: number; width: number }) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within a Tabs provider')
  return ctx
}

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnChange,
  children,
  className,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  const activeRef = useRef<HTMLButtonElement | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const onValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) setUncontrolledValue(newValue)
      controlledOnChange?.(newValue)
    },
    [isControlled, controlledOnChange],
  )

  return (
    <TabsContext.Provider
      value={{ value, onValueChange, activeRef, indicatorStyle, setIndicatorStyle }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { indicatorStyle } = useTabsContext()
  return (
    <div
      className={cn(
        'relative inline-flex h-10 items-center rounded-lg bg-neutral-800/50 p-1 gap-1',
        className,
      )}
      role="tablist"
      {...props}
    >
      {children}
      <motion.div
        className="absolute inset-y-1 rounded-md bg-blue-500/20 z-0"
        layout
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        aria-hidden="true"
      />
    </div>
  )
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  children: ReactNode
}

export function TabsTrigger({
  value: tabValue,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const { value, onValueChange, activeRef, setIndicatorStyle } = useTabsContext()
  const isActive = value === tabValue
  const ref = useRef<HTMLButtonElement | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onValueChange(tabValue)
    onClick?.(e)
  }

  const updateIndicator = useCallback(
    (el: HTMLButtonElement) => {
      const parent = el.parentElement
      if (parent) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
        })
        ;(activeRef as React.MutableRefObject<HTMLButtonElement | null>).current = el
      }
    },
    [setIndicatorStyle, activeRef],
  )

  const setRef = (el: HTMLButtonElement | null) => {
    ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
    if (el && isActive) {
      updateIndicator(el)
    }
  }

  return (
    <button
      ref={setRef}
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
      className={cn(
        'relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
        isActive ? 'text-neutral-100' : 'text-neutral-400 hover:text-neutral-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children: ReactNode
}

export function TabsContent({
  value: tabValue,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value } = useTabsContext()
  if (value !== tabValue) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}
