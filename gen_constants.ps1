$path = "C:\Users\notwi\Desktop\fleet flow\fleet-flow\src\constants\index.ts"
$content = @"
export const APP_NAME = 'FleetFlow'
export const APP_TAGLINE = 'Smart Fleet Management Platform'
export const APP_DESCRIPTION = 'Enterprise-grade fleet management for transport, logistics, mining, and construction companies.'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Vehicles', href: '/vehicles', icon: 'Truck' },
  { label: 'Drivers', href: '/drivers', icon: 'Users' },
  { label: 'Maintenance', href: '/maintenance', icon: 'Wrench' },
  { label: 'Fuel Logs', href: '/fuel', icon: 'Fuel' },
  { label: 'Inspections', href: '/inspections', icon: 'ClipboardCheck' },
  { label: 'Documents', href: '/documents', icon: 'FileText' },
  { label: 'Notifications', href: '/notifications', icon: 'Bell' },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
  { label: 'Reports', href: '/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
]

export const VEHICLE_STATUS_COLORS = {
  active: 'emerald',
  inactive: 'slate',
  maintenance: 'amber',
  out_of_service: 'red',
} as const

export const DRIVER_STATUS_COLORS = {
  available: 'emerald',
  on_trip: 'blue',
  off_duty: 'slate',
  sick: 'amber',
  vacation: 'purple',
} as const

export const MAINTENANCE_PRIORITY_COLORS = {
  low: 'slate',
  medium: 'blue',
  high: 'amber',
  critical: 'red',
} as const

export const MAINTENANCE_STATUS_COLORS = {
  scheduled: 'blue',
  in_progress: 'amber',
  completed: 'emerald',
  overdue: 'red',
  cancelled: 'slate',
} as const

export const PAGE_SIZE = 20

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
}

export const CHART_COLORS_ARRAY = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#14b8a6',
]

export const ROLES = {
  admin: [
    { action: 'manage', subject: 'all' },
  ],
  fleet_manager: [
    { action: 'read', subject: 'all' },
    { action: 'create', subject: 'vehicle' },
    { action: 'update', subject: 'vehicle' },
    { action: 'create', subject: 'maintenance' },
    { action: 'update', subject: 'maintenance' },
    { action: 'create', subject: 'fuel' },
    { action: 'create', subject: 'inspection' },
    { action: 'update', subject: 'inspection' },
    { action: 'create', subject: 'driver' },
    { action: 'update', subject: 'driver' },
  ],
  driver: [
    { action: 'read', subject: 'vehicle' },
    { action: 'read', subject: 'maintenance' },
    { action: 'create', subject: 'fuel' },
    { action: 'create', subject: 'inspection' },
    { action: 'read', subject: 'driver' },
  ],
}

export const DEPARTMENTS = ['Transport', 'Mining', 'Construction', 'Logistics', 'Delivery', 'Municipal'] as const

export const SERVICE_TYPES = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'engine_repair', label: 'Engine Repair' },
  { value: 'transmission', label: 'Transmission Service' },
  { value: 'battery', label: 'Battery Replacement' },
  { value: 'ac_service', label: 'AC Service' },
  { value: 'general', label: 'General Service' },
  { value: 'emissions_test', label: 'Emissions Test' },
  { value: 'safety_inspection', label: 'Safety Inspection' },
  { value: 'other', label: 'Other' },
] as const
"@
Set-Content -LiteralPath $path -Value $content