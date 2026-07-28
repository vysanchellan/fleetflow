'use client'

import dynamic from 'next/dynamic'

const KpiCards = dynamic(() => import('@/features/dashboard/kpi-cards').then(m => ({ default: m.KpiCards })), { ssr: false })
const FleetUtilization = dynamic(() => import('@/features/dashboard/fleet-utilization').then(m => ({ default: m.FleetUtilization })), { ssr: false })
const FuelConsumption = dynamic(() => import('@/features/dashboard/fuel-consumption').then(m => ({ default: m.FuelConsumption })), { ssr: false })
const MaintenanceHistory = dynamic(() => import('@/features/dashboard/maintenance-history').then(m => ({ default: m.MaintenanceHistory })), { ssr: false })
const VehicleStatus = dynamic(() => import('@/features/dashboard/vehicle-status').then(m => ({ default: m.VehicleStatus })), { ssr: false })
const MonthlyExpenses = dynamic(() => import('@/features/dashboard/monthly-expenses').then(m => ({ default: m.MonthlyExpenses })), { ssr: false })
const RecentActivity = dynamic(() => import('@/features/dashboard/recent-activity').then(m => ({ default: m.RecentActivity })), { ssr: false })
const UpcomingReminders = dynamic(() => import('@/features/dashboard/upcoming-reminders').then(m => ({ default: m.UpcomingReminders })), { ssr: false })
const Alerts = dynamic(() => import('@/features/dashboard/alerts').then(m => ({ default: m.Alerts })), { ssr: false })

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Overview of your fleet operations
        </p>
      </div>
      <Alerts />
      <KpiCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetUtilization />
        <FuelConsumption />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyExpenses />
        </div>
        <VehicleStatus />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceHistory />
        <UpcomingReminders />
      </div>
      <RecentActivity />
    </div>
  )
}
