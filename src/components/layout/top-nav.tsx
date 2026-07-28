'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  LogOut,
  User,
  Settings,
  Truck,
  Wrench,
  Fuel,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { useTheme } from './theme-provider'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { NAV_ITEMS } from '@/constants'
import { notifications as notificationData } from '@/data/notifications'

function formatTimeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function usePageTitle(): string {
  const pathname = usePathname()
  const item = NAV_ITEMS.find(
    (n) => n.href !== '/' && pathname.startsWith(n.href),
  )
  if (pathname === '/') return 'Dashboard'
  return item?.label ?? 'Dashboard'
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, handler])
}

export function TopNav() {
  const pathname = usePathname()
  const { toggle: toggleSidebar, isOpen } = useSidebar()
  const { theme, setTheme } = useTheme()
  const pageTitle = usePageTitle()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifRef = useRef<HTMLDivElement>(null)
  const quickRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useClickOutside(notifRef, () => setShowNotifications(false))
  useClickOutside(quickRef, () => setShowQuickActions(false))
  useClickOutside(userRef, () => setShowUserMenu(false))

  const unreadNotifications = notificationData.filter((n) => !n.read)
  const recentNotifications = unreadNotifications.slice(0, 5)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowNotifications(false)
        setShowQuickActions(false)
        setShowUserMenu(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 transition-all duration-200"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-neutral-500">FleetFlow</span>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
          <span className="text-neutral-100 font-medium">{pageTitle}</span>
        </div>
        <div className="sm:hidden">
          <span className="text-sm text-neutral-100 font-medium">{pageTitle}</span>
        </div>
      </div>

      {/* Center/Right section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:block relative w-56 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicles, drivers..."
            className="h-9 w-full rounded-lg border border-neutral-800/50 bg-neutral-900/50 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
          />
        </div>
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 transition-all duration-200"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Quick Actions */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 transition-all duration-200"
            aria-haspopup="true"
            aria-expanded={showQuickActions}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">Quick Action</span>
          </button>
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 py-1.5"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                role="menu"
              >
                {[
                  { label: 'Add Vehicle', icon: Truck },
                  { label: 'Schedule Maintenance', icon: Wrench },
                  { label: 'Log Fuel', icon: Fuel },
                  { label: 'New Inspection', icon: ClipboardCheck },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 transition-colors duration-150"
                    role="menuitem"
                  >
                    <action.icon className="h-4 w-4 text-neutral-500" />
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 transition-all duration-200"
            aria-label={`Notifications (${unreadNotifications.length} unread)`}
            aria-haspopup="true"
            aria-expanded={showNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-neutral-950">
                {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50">
                  <h3 className="text-sm font-semibold text-neutral-100">Notifications</h3>
                  <Badge variant="danger" size="sm">
                    {unreadNotifications.length} new
                  </Badge>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-neutral-500">
                      No new notifications
                    </div>
                  ) : (
                    recentNotifications.map((n) => (
                      <button
                        key={n.id}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-neutral-800/50 transition-colors duration-150"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
                          <Bell className="h-4 w-4 text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-100 truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-1">
                            {formatTimeAgo(n.createdAt)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-neutral-800/50 px-4 py-2.5">
                  <button className="w-full text-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 transition-all duration-200"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-neutral-800/50 transition-all duration-200"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
          >
            <Avatar name="Alex Morgan" size="sm" status="online" className="shrink-0" />
            <span className="hidden lg:block text-sm font-medium text-neutral-100">
              Alex
            </span>
            <ChevronRight className="hidden lg:block h-3.5 w-3.5 text-neutral-500" />
          </button>
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl bg-neutral-900 border border-neutral-800/50 shadow-xl shadow-neutral-900/50 py-1.5"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                role="menu"
              >
                <div className="px-3 py-2 border-b border-neutral-800/50 mb-1">
                  <p className="text-sm font-medium text-neutral-100">Alex Morgan</p>
                  <p className="text-xs text-neutral-500">alex@fleetflow.com</p>
                </div>
                {[
                  { label: 'Profile', icon: User },
                  { label: 'Settings', icon: Settings },
                  { label: 'Sign Out', icon: LogOut, variant: 'danger' as const },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150',
                      item.variant === 'danger'
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100',
                    )}
                    role="menuitem"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            className="absolute inset-x-0 top-0 z-50 flex h-16 items-center gap-3 bg-neutral-950/95 backdrop-blur-xl px-4 border-b border-neutral-800/50"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <Search className="h-5 w-5 text-neutral-500 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search vehicles, drivers..."
              className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setShowMobileSearch(false)
              }}
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
