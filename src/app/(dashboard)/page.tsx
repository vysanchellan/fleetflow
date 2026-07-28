import { Metadata } from 'next'
import { KpiCards } from '@/features/dashboard/kpi-cards'
import { FleetUtilization } from '@/features/dashboard/fleet-utilization'
import { FuelConsumption } from '@/features/dashboard/fuel-consumption'
import { MaintenanceHistory } from '@/features/dashboard/maintenance-history'
import { VehicleStatus } from '@/features/dashboard/vehicle-status'
import { MonthlyExpenses } from '@/features/dashboard/monthly-expenses'
import { RecentActivity } from '@/features/dashboard/recent-activity'
import { UpcomingReminders } from '@/features/dashboard/upcoming-reminders'
import { Alerts } from '@/features/dashboard/alerts'

export const metadata: Metadata = {
  title: 'Dashboard - FleetFlow',
}

export default function DashboardPage() {
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
