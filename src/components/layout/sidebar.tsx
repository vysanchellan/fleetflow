'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  Fuel,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  BarChart3,
  Settings,
  Search,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { NAV_ITEMS } from '@/constants'
import { Tooltip } from '@/components/ui/tooltip'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Truck,
  Users,
  Wrench,
  Fuel,
  ClipboardCheck,
  FileText,
  Bell,
  Calendar,
  BarChart3,
  Settings,
}

const SIDEBAR_OPEN_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64

function SidebarNavItem({
  item,
  isActive,
  isCollapsed,
  onClose,
}: {
  item: (typeof NAV_ITEMS)[number]
  isActive: boolean
  isCollapsed: boolean
  onClose: () => void
}) {
  const Icon = iconMap[item.icon]

  const content = (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'text-blue-400 bg-blue-500/10 border-l-2 border-blue-500 ml-0 pl-[10px]'
          : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border-l-2 border-transparent ml-0 pl-[10px]',
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            'h-5 w-5 shrink-0 transition-colors duration-200',
            isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-neutral-100',
          )}
        />
      )}
      {!isCollapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {item.icon === 'Bell' && (
        <Badge
          variant="danger"
          size="sm"
          className={cn(
            'ml-auto',
            isCollapsed && 'absolute -top-1 -right-1 px-1 py-0 min-w-[16px] h-4 flex items-center justify-center text-[9px]',
          )}
        >
          3
        </Badge>
      )}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip content={item.label} position="right" delay={300}>
        {content}
      </Tooltip>
    )
  }

  return content
}

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, toggle } = useSidebar()
  const isCollapsed = !isOpen

  const sidebarContent = (
    <div
      className={cn(
        'flex h-full flex-col bg-neutral-950 border-r border-neutral-800/50',
        isMobile && 'bg-neutral-950/95 backdrop-blur-xl',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-neutral-800/50 shrink-0',
          isCollapsed ? 'justify-center px-0' : 'px-4',
        )}
      >
        {isCollapsed ? (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
            <Truck className="h-5 w-5 text-blue-400" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10">
              <Truck className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-lg font-bold text-neutral-100 tracking-tight">
              Fleet<span className="text-blue-400">Flow</span>
            </span>
          </div>
        )}
        {!isMobile && !isCollapsed && (
          <button
            onClick={toggle}
            className="ml-auto p-1.5 rounded-lg text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800/50 transition-colors duration-200"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <button className="flex w-full items-center gap-2.5 rounded-lg border border-neutral-800/50 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-400 hover:border-neutral-700/50 transition-all duration-200">
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <span className="ml-auto text-[10px] text-neutral-600 border border-neutral-800 rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </button>
        </div>
      )}

      {/* Divider after search */}
      {!isCollapsed && <div className="mx-3 mt-2 mb-1 border-t border-neutral-800/30" />}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            }
            isCollapsed={isCollapsed}
            onClose={() => {
              if (isMobile) toggle()
            }}
          />
        ))}
      </nav>

      {/* Workspace Selector */}
      <div
        className={cn(
          'border-t border-neutral-800/50 shrink-0',
          isCollapsed ? 'px-2 py-3' : 'px-3 py-3',
        )}
      >
        <button
          className={cn(
            'flex w-full items-center rounded-lg transition-colors duration-200 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50',
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5',
          )}
        >
          {isCollapsed ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-[10px] font-bold text-blue-400">
              FC
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-400 shrink-0">
                FC
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-neutral-100 truncate">
                  FleetFlow Corp
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  Enterprise Plan
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500" />
            </>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          'border-t border-neutral-800/50 shrink-0',
          isCollapsed ? 'px-2 py-3' : 'px-3 py-3',
        )}
      >
        <button
          className={cn(
            'flex w-full items-center rounded-lg transition-colors duration-200 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50',
            isCollapsed ? 'justify-center p-1.5' : 'gap-3 px-3 py-2.5',
          )}
        >
          <Avatar
            name="Alex Morgan"
            size="sm"
            status="online"
            className="shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-neutral-100 truncate">
                Alex Morgan
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                Fleet Manager
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  )

  // Mobile: overlay sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggle}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px]"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop: inline sidebar with animated width
  return (
    <motion.aside
      className="relative h-screen shrink-0 overflow-hidden"
      animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_OPEN_WIDTH }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
    >
      {sidebarContent}
      {/* Collapse toggle button when collapsed */}
      {isCollapsed && (
        <button
          onClick={toggle}
          className="absolute -right-3 top-[60px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700/50 text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-colors duration-200 shadow-lg"
          aria-label="Expand sidebar"
        >
          <PanelLeft className="h-3 w-3" />
        </button>
      )}
    </motion.aside>
  )
}
