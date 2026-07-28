'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Droplets, DollarSign, Gauge, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, type BarConfig } from '@/components/charts/bar-chart'
import { LineChart, type LineConfig } from '@/components/charts/line-chart'
import { fuelLogs, vehicles, drivers } from '@/data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { CHART_COLORS } from '@/constants'
import { staggerContainer, staggerItem } from '@/animations'

function getMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const data: { month: string; fuelCost: number; avgPrice: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()

    const monthLogs = fuelLogs.filter(f => {
      const fd = new Date(f.date)
      return fd.getMonth() === month && fd.getFullYear() === year
    })

    const fuelCost = Math.round(monthLogs.reduce((sum, f) => sum + f.totalCost, 0))
    const avgPrice = monthLogs.length > 0
      ? monthLogs.reduce((sum, f) => sum + f.pricePerGallon, 0) / monthLogs.length
      : 0

    data.push({
      month: `${months[d.getMonth()]} '${String(year).slice(2)}`,
      fuelCost,
      avgPrice: parseFloat(avgPrice.toFixed(2)),
    })
  }

  return data
}

function getVehicleComparison() {
  const vehicleMap = new Map(vehicles.map(v => [v.id, v.plateNumber]))

  const vehicleCosts = new Map<string, number>()
  for (const f of fuelLogs) {
    vehicleCosts.set(f.vehicleId, (vehicleCosts.get(f.vehicleId) ?? 0) + f.totalCost)
  }

  return Array.from(vehicleCosts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, cost]) => ({
      vehicle: vehicleMap.get(id) ?? id,
      fuelCost: Math.round(cost),
    }))
}

function getMpgTrend() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const data: { month: string; mpg: number }[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()

    const monthLogs = fuelLogs.filter(f => {
      const fd = new Date(f.date)
      return fd.getMonth() === month && fd.getFullYear() === year
    })

    const avgMpg = monthLogs.length > 0
      ? monthLogs.reduce((sum, f) => sum + f.mpg, 0) / monthLogs.length
      : 0

    data.push({
      month: `${months[d.getMonth()]} '${String(year).slice(2)}`,
      mpg: parseFloat(avgMpg.toFixed(1)),
    })
  }

  return data
}

function getSummaryStats() {
  const totalGallons = fuelLogs.reduce((sum, f) => sum + f.gallons, 0)
  const totalCost = fuelLogs.reduce((sum, f) => sum + f.totalCost, 0)
  const avgMpg = fuelLogs.length > 0
    ? fuelLogs.reduce((sum, f) => sum + f.mpg, 0) / fuelLogs.length
    : 0
  const avgPriceGal = fuelLogs.length > 0
    ? fuelLogs.reduce((sum, f) => sum + f.pricePerGallon, 0) / fuelLogs.length
    : 0

  return { totalGallons, totalCost, avgMpg, avgPriceGal }
}

export function FuelCharts() {
  const monthlyData = useMemo(getMonthlyData, [])
  const vehicleData = useMemo(getVehicleComparison, [])
  const mpgData = useMemo(getMpgTrend, [])
  const summary = useMemo(getSummaryStats, [])

  const monthlyBars: BarConfig[] = [
    { key: 'fuelCost', name: 'Fuel Cost', color: CHART_COLORS.blue },
    { key: 'avgPrice', name: 'Avg Price/Gal', color: CHART_COLORS.orange },
  ]

  const vehicleBars: BarConfig[] = [
    { key: 'fuelCost', name: 'Fuel Cost', color: CHART_COLORS.blue },
  ]

  const mpgLines: LineConfig[] = [
    { key: 'mpg', name: 'Avg MPG', color: CHART_COLORS.green },
  ]

  const statCards = [
    { icon: <Droplets className="h-5 w-5" />, label: 'Total Gallons', value: formatNumber(Math.round(summary.totalGallons)) },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Total Cost', value: formatCurrency(Math.round(summary.totalCost)) },
    { icon: <Gauge className="h-5 w-5" />, label: 'Avg MPG', value: (summary.avgMpg).toFixed(1) },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Avg Price/Gal', value: formatCurrency(summary.avgPriceGal) },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 text-neutral-400 text-xs uppercase tracking-wider mb-2">
                  {card.icon}
                  <span>{card.label}</span>
                </div>
                <p className="text-2xl font-semibold text-neutral-100 tracking-tight">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Fuel Usage</CardTitle>
            <CardDescription>Fuel cost and average price per gallon over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlyData} xKey="month" bars={monthlyBars} height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Vehicles by Fuel Cost</CardTitle>
            <CardDescription>Highest total fuel expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={vehicleData} xKey="vehicle" bars={vehicleBars} height={280} horizontal />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fuel Economy Trend</CardTitle>
          <CardDescription>Average MPG across the fleet over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={mpgData} xKey="month" lines={mpgLines} height={280} />
        </CardContent>
      </Card>
    </div>
  )
}
