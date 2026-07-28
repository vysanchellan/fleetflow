'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  ClipboardCheck,
  IdCard,
  ShieldCheck,
  Fuel,
  Bell,
  CheckCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { notifications } from '@/data'
import { formatDate, formatDateRelative, cn } from '@/lib/utils'
import { listStagger, listItem } from '@/animations'
import type { Notification } from '@/types'

const typeTabs = [
  { value: 'all', label: 'All' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'license', label: 'License' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'fuel', label: 'Fuel' },
]

const priorityLevels = ['all', 'critical', 'high', 'medium', 'low'] as const

const typeIconMap: Record<Notification['type'], typeof Wrench> = {
  maintenance: Wrench,
  inspection: ClipboardCheck,
  license: IdCard,
  insurance: ShieldCheck,
  fuel: Fuel,
  general: Bell,
}

const priorityBadgeVariant: Record<Notification['priority'], 'danger' | 'warning' | 'primary' | 'secondary'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'primary',
  low: 'secondary',
}

function groupByDate(items: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = []
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayItems: Notification[] = []
  const yesterdayItems: Notification[] = []
  const weekItems: Notification[] = []
  const earlierItems: Notification[] = []

  for (const n of items) {
    const d = new Date(n.createdAt).toDateString()
    if (d === today) todayItems.push(n)
    else if (d === yesterday.toDateString()) yesterdayItems.push(n)
    else if (new Date(n.createdAt) > new Date(now.getTime() - 7 * 86400000)) weekItems.push(n)
    else earlierItems.push(n)
  }

  if (todayItems.length) groups.push({ label: 'Today', items: todayItems })
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems })
  if (weekItems.length) groups.push({ label: 'This Week', items: weekItems })
  if (earlierItems.length) groups.push({ label: 'Earlier', items: earlierItems })

  return groups
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  const Icon = typeIconMap[notification.type]
  const timeAgo = formatDateRelative(notification.createdAt)

  return (
    <motion.div
      variants={listItem}
      layout
      onClick={() => !notification.read && onMarkRead(notification.id)}
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all duration-200',
        notification.read
          ? 'border-neutral-800/30 bg-neutral-900/50'
          : 'border-neutral-700/40 bg-neutral-900 hover:bg-neutral-800/60',
      )}
    >
      <div className={cn(
        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
        notification.read ? 'bg-neutral-800' : 'bg-blue-500/10',
      )}>
        <Icon className={cn('h-4 w-4', notification.read ? 'text-neutral-500' : 'text-blue-400')} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
          <span className={cn(
            'text-sm font-medium',
            notification.read ? 'text-neutral-400' : 'text-neutral-100',
          )}>
            {notification.title}
          </span>
        </div>
        <p className={cn(
          'text-xs mt-0.5',
          notification.read ? 'text-neutral-500' : 'text-neutral-400',
        )}>
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-neutral-500">{timeAgo}</span>
          <Badge variant={priorityBadgeVariant[notification.priority]} size="sm">
            {notification.priority}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

export function NotificationList() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let result = notifications
    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter)
    }
    if (priorityFilter !== 'all') {
      result = result.filter((n) => n.priority === priorityFilter)
    }
    return result
  }, [typeFilter, priorityFilter])

  const handleMarkRead = useCallback((id: string) => {
    setReadIds((prev) => new Set(prev).add(id))
  }, [])

  const handleMarkAllRead = useCallback(() => {
    setReadIds(new Set(filtered.map((n) => n.id)))
  }, [filtered])

  const mergedNotifications = useMemo(() => {
    return filtered.map((n) => ({
      ...n,
      read: readIds.has(n.id) || n.read,
    }))
  }, [filtered, readIds])

  const grouped = useMemo(() => groupByDate(mergedNotifications), [mergedNotifications])

  const unreadCount = mergedNotifications.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue="all" value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList>
            {typeTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {priorityLevels.map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p === priorityFilter ? 'all' : p)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150',
                  priorityFilter === p
                    ? 'bg-neutral-700 text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800',
                )}
              >
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <motion.div
        variants={listStagger}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {grouped.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-1">
                {group.label}
              </h3>
              <div className="space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {group.items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </AnimatePresence>

        {grouped.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No notifications</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
