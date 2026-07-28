'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Truck,
  Fuel,
  Wrench,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react'
import { MetricCard } from '@/components/ui/metric-card'
import { vehicles, drivers, maintenanceRecords, fuelLogs } from '@/data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'

export function ReportCharts() {
  const analytics = useMemo(() => {
    const totalVehicles = vehicles.length
    const activeVehicles = vehicles.filter((v) => v.status === 'active').length
    const inMaintenance = vehicles.filter((v) => v.status === 'in_maintenance').length
    const utilizationRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0

    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.totalCost, 0)
    const totalGallons = fuelLogs.reduce((sum, f) => sum + f.gallons, 0)
    const totalMiles = fuelLogs.reduce((sum, f) => sum + f.tripMiles, 0)
    const avgMpg = totalGallons > 0 ? (totalMiles / totalGallons).toFixed(1) : '0'

    const fuelByMonth = Array.from({ length: 6 }, (_, i) => {
      const month = new Date()
      month.setMonth(month.getMonth() - i)
      const m = month.getMonth()
      const y = month.getFullYear()
      const logs = fuelLogs.filter((f) => {
        const d = new Date(f.date)
        return d.getMonth() === m && d.getFullYear() === y
      })
      return logs.reduce((s, f) => s + f.totalCost, 0)
    }).reverse()

    const totalMaintCost = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0)
    const pendingServices = maintenanceRecords.filter((m) => m.status === 'pending').length
    const completedServices = maintenanceRecords.filter((m) => m.status === 'completed').length
    const avgCostPerService = completedServices > 0
      ? maintenanceRecords.filter((m) => m.status === 'completed').reduce((s, m) => s + m.cost, 0) / completedServices
      : 0

    const totalDrivers = drivers.length
    const avgScore = drivers.length > 0
      ? Math.round(drivers.reduce((s, d) => s + d.drivingScore, 0) / drivers.length)
      : 0
    const totalTrips = drivers.reduce((s, d) => s + d.totalTrips, 0)

    const totalDowntimeDays = maintenanceRecords
      .filter((m) => m.status === 'completed' || m.status === 'in_progress')
      .reduce((s) => s + Math.floor(Math.random() * 5) + 1, 0)

    const fuelCost = totalFuelCost
    const maintCost = totalMaintCost
    const otherCost = Math.round((fuelCost + maintCost) * 0.15)

    return {
      totalVehicles, activeVehicles, inMaintenance, utilizationRate,
      totalFuelCost, avgMpg, fuelByMonth,
      totalMaintCost, pendingServices, avgCostPerService,
      totalDrivers, avgScore, totalTrips,
      totalDowntimeDays, fuelCost, maintCost, otherCost,
    }
  }, [])

  const utilizationData = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 40) + 60,
  )

  const cards = [
    {
      icon: <Truck />,
      title: 'Fleet Analytics',
      value: formatNumber(analytics.totalVehicles),
      subtitle: `${analytics.activeVehicles} active · ${analytics.inMaintenance} in maintenance`,
      chartData: utilizationData,
      trend: analytics.utilizationRate >= 70 ? 'up' as const : 'down' as const,
    },
    {
      icon: <Fuel />,
      title: 'Fuel Analytics',
      value: formatCurrency(analytics.totalFuelCost),
      subtitle: `Avg ${analytics.avgMpg} mpg`,
      chartData: analytics.fuelByMonth,
      trend: parseFloat(analytics.avgMpg) >= 8 ? 'up' as const : 'down' as const,
    },
    {
      icon: <Wrench />,
      title: 'Maintenance Analytics',
      value: formatCurrency(analytics.totalMaintCost),
      subtitle: `${analytics.pendingServices} pending · avg ${formatCurrency(Math.round(analytics.avgCostPerService))}`,
      trend: analytics.pendingServices > 5 ? 'down' as const : 'up' as const,
    },
    {
      icon: <Users />,
      title: 'Driver Analytics',
      value: formatNumber(analytics.totalDrivers),
      subtitle: `Avg score ${analytics.avgScore}% · ${formatNumber(analytics.totalTrips)} trips`,
      trend: analytics.avgScore >= 80 ? 'up' as const : 'down' as const,
    },
    {
      icon: <Clock />,
      title: 'Downtime',
      value: `${analytics.totalDowntimeDays} days`,
      subtitle: 'Across all vehicles',
      trend: analytics.totalDowntimeDays > 30 ? 'down' as const : 'up' as const,
    },
    {
      icon: <DollarSign />,
      title: 'Cost Breakdown',
      value: formatCurrency(analytics.fuelCost + analytics.maintCost + analytics.otherCost),
      subtitle: `Fuel ${formatCurrency(analytics.fuelCost)} · Maint ${formatCurrency(analytics.maintCost)} · Other ${formatCurrency(analytics.otherCost)}`,
    },
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
          <MetricCard
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            chartData={card.chartData}
            trend={card.trend}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
