'use client'

import { motion } from 'framer-motion'
import { Truck, CheckCircle, Users, Wrench, Fuel, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { vehicles, drivers, maintenanceRecords, fuelLogs } from '@/data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'

function getKPIs() {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter(v => v.status === 'active').length
  const totalDrivers = drivers.length
  const upcomingServices = maintenanceRecords.filter(m =>
    m.status === 'pending' && new Date(m.scheduledDate) > now
  ).length

  const currentMonthFuel = fuelLogs.filter(f => {
    const d = new Date(f.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const monthlyFuelCost = currentMonthFuel.reduce((sum, f) => sum + f.totalCost, 0)

  const currentMonthMaint = maintenanceRecords.filter(m => {
    if (!m.completedDate) return false
    const d = new Date(m.completedDate)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const monthlyMaintCost = currentMonthMaint.reduce((sum, m) => sum + m.cost, 0)

  const prevMonthFuel = fuelLogs.filter(f => {
    const d = new Date(f.date)
    const pm = currentMonth === 0 ? 11 : currentMonth - 1
    const py = currentMonth === 0 ? currentYear - 1 : currentYear
    return d.getMonth() === pm && d.getFullYear() === py
  })
  const prevFuelCost = prevMonthFuel.reduce((sum, f) => sum + f.totalCost, 0)

  const prevMonthMaint = maintenanceRecords.filter(m => {
    if (!m.completedDate) return false
    const d = new Date(m.completedDate)
    const pm = currentMonth === 0 ? 11 : currentMonth - 1
    const py = currentMonth === 0 ? currentYear - 1 : currentYear
    return d.getMonth() === pm && d.getFullYear() === py
  })
  const prevMaintCost = prevMonthMaint.reduce((sum, m) => sum + m.cost, 0)

  const fuelTrend = prevFuelCost > 0 ? ((monthlyFuelCost - prevFuelCost) / prevFuelCost) * 100 : 0
  const maintTrend = prevMaintCost > 0 ? ((monthlyMaintCost - prevMaintCost) / prevMaintCost) * 100 : 0

  return {
    totalVehicles, activeVehicles, totalDrivers, upcomingServices,
    monthlyFuelCost, monthlyMaintCost, fuelTrend, maintTrend,
  }
}

export function KpiCards() {
  const kpi = getKPIs()

  const cards = [
    { icon: <Truck />, label: 'Total Vehicles', value: formatNumber(kpi.totalVehicles), trend: 'up' as const, trendValue: `${kpi.totalVehicles} fleet` },
    { icon: <CheckCircle />, label: 'Active Vehicles', value: formatNumber(kpi.activeVehicles), trend: 'up' as const, trendValue: `${Math.round((kpi.activeVehicles / kpi.totalVehicles) * 100)}% active` },
    { icon: <Users />, label: 'Total Drivers', value: formatNumber(kpi.totalDrivers), trend: 'up' as const, trendValue: `${kpi.totalDrivers} on roster` },
    { icon: <Wrench />, label: 'Upcoming Services', value: formatNumber(kpi.upcomingServices), trend: 'down' as const, trendValue: 'pending' },
    { icon: <Fuel />, label: 'Fuel Cost', value: formatCurrency(kpi.monthlyFuelCost), trend: kpi.fuelTrend >= 0 ? 'up' as const : 'down' as const, trendValue: `${kpi.fuelTrend >= 0 ? '+' : ''}${kpi.fuelTrend.toFixed(1)}%` },
    { icon: <DollarSign />, label: 'Maintenance Cost', value: formatCurrency(kpi.monthlyMaintCost), trend: kpi.maintTrend >= 0 ? 'up' as const : 'down' as const, trendValue: `${kpi.maintTrend >= 0 ? '+' : ''}${kpi.maintTrend.toFixed(1)}%` },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {cards.map((card, idx) => (
        <motion.div key={idx} variants={staggerItem}>
          <StatCard
            icon={card.icon}
            label={card.label}
            value={card.value}
            trend={card.trend}
            trendValue={card.trendValue}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
