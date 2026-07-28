'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Wrench, ClipboardCheck, IdCard, ShieldCheck, Fuel, ChevronRight } from 'lucide-react'
import { notifications } from '@/data'
import { formatDateRelative, cn } from '@/lib/utils'
import type { Notification } from '@/types'

const typeIconMap: Record<Notification['type'], typeof Bell> = {
  maintenance: Wrench,
  inspection: ClipboardCheck,
  license: IdCard,
  insurance: ShieldCheck,
  fuel: Fuel,
  general: Bell,
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const unread = notifications.filter((n) => !n.read)
  const recent = unread.slice(0, 5)

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
        aria-label={`Notifications${unread.length > 0 ? ` (${unread.length} unread)` : ''}`}
      >
        <Bell className="h-4.5 w-4.5" />
        {unread.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none"
          >
            {unread.length > 99 ? '99+' : unread.length}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-neutral-800/50">
              <h4 className="text-sm font-semibold text-neutral-100">Notifications</h4>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/30">
                  {recent.map((n) => {
                    const Icon = typeIconMap[n.type]
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Icon className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-neutral-200 truncate">
                            {n.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-neutral-600 mt-0.5 block">
                            {formatDateRelative(n.createdAt)}
                          </span>
                        </div>
                        <span className={cn(
                          'h-2 w-2 rounded-full shrink-0 mt-1.5',
                          n.priority === 'critical' && 'bg-red-500',
                          n.priority === 'high' && 'bg-amber-500',
                          n.priority === 'medium' && 'bg-blue-500',
                          n.priority === 'low' && 'bg-neutral-600',
                        )} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-neutral-800/50 px-4 py-2.5">
              <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors w-full justify-center">
                View all
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
