export const APP_NAME = 'FleetFlow'

export interface NavItem {
  label: string
  href: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Vehicles', href: '/vehicles', icon: 'Truck' },
  { label: 'Drivers', href: '/drivers', icon: 'Users' },
  { label: 'Maintenance', href: '/maintenance', icon: 'Wrench' },
  { label: 'Fuel', href: '/fuel', icon: 'Fuel' },
  { label: 'Inspections', href: '/inspections', icon: 'ClipboardCheck' },
  { label: 'Documents', href: '/documents', icon: 'FileText' },
  { label: 'Notifications', href: '/notifications', icon: 'Bell' },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { label: 'Reports', href: '/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
]

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#22c55e',
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899',
} as const
