'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Droplets, Gauge, TrendingUp, Fuel, Trophy } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { fuelLogs, vehicles, drivers } from '@/data'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'

export function FuelStats() {
  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthLogs = fuelLogs.filter(f => {
      const d = new Date(f.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const totalFuelCost = monthLogs.reduce((sum, f) => sum + f.totalCost, 0)
    const totalGallons = monthLogs.reduce((sum, f) => sum + f.gallons, 0)
    const avgMpg = monthLogs.length > 0
      ? monthLogs.reduce((sum, f) => sum + f.mpg, 0) / monthLogs.length
      : 0
    const avgPriceGal = monthLogs.length > 0
      ? monthLogs.reduce((sum, f) => sum + f.pricePerGallon, 0) / monthLogs.length
      : 0

    const stationCounts = new Map<string, number>()
    for (const f of fuelLogs) {
      const stationName = f.station.split(' — ')[0]
      stationCounts.set(stationName, (stationCounts.get(stationName) ?? 0) + 1)
    }
    const mostUsedStation = Array.from(stationCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'

    const vehicleMpg = new Map<string, { total: number; count: number }>()
    for (const f of fuelLogs) {
      const cur = vehicleMpg.get(f.vehicleId) ?? { total: 0, count: 0 }
      cur.total += f.mpg
      cur.count += 1
      vehicleMpg.set(f.vehicleId, cur)
    }

    const vehicleMap = new Map(vehicles.map(v => [v.id, v.plateNumber]))
    const bestMpgEntry = Array.from(vehicleMpg.entries())
      .map(([id, v]) => ({ id, avg: v.total / v.count }))
      .sort((a, b) => b.avg - a.avg)[0]
    const bestMpgVehicle = bestMpgEntry ? (vehicleMap.get(bestMpgEntry.id) ?? bestMpgEntry.id) : '-'

    return {
      totalFuelCost,
      totalGallons,
      avgMpg,
      avgPriceGal,
      mostUsedStation,
      bestMpgVehicle,
    }
  }, [])

  const cards = [
    { icon: <DollarSign />, label: 'Total Fuel Cost (This Month)', value: formatCurrency(stats.totalFuelCost) },
    { icon: <Droplets />, label: 'Total Gallons (This Month)', value: formatNumber(Math.round(stats.totalGallons)) },
    { icon: <Gauge />, label: 'Average MPG (Fleet-wide)', value: stats.avgMpg.toFixed(1) },
    { icon: <TrendingUp />, label: 'Average Price per Gallon', value: formatCurrency(stats.avgPriceGal) },
    { icon: <Fuel />, label: 'Most Used Station', value: stats.mostUsedStation },
    { icon: <Trophy />, label: 'Vehicle with Best MPG', value: stats.bestMpgVehicle },
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
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
