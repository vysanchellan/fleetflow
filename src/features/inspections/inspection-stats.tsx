'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, Percent, AlertTriangle, XCircle, Wrench } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { PieChart, type PieData } from '@/components/charts/pie-chart'
import { inspections } from '@/data'
import { formatNumber } from '@/lib/utils'
import { CHART_COLORS } from '@/constants'
import { staggerContainer, staggerItem } from '@/animations'

export function InspectionStats() {
  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthInspections = inspections.filter(ins => {
      const d = new Date(ins.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const total = monthInspections.length
    const passCount = monthInspections.filter(ins => ins.result === 'pass').length
    const conditionalCount = monthInspections.filter(ins => ins.result === 'conditional').length
    const failCount = monthInspections.filter(ins => ins.result === 'fail').length

    const passRate = total > 0 ? (passCount / total) * 100 : 0
    const failRate = total > 0 ? (failCount / total) * 100 : 0

    const failureItemCounts = new Map<string, number>()
    for (const ins of inspections) {
      for (const item of ins.items) {
        if (item.status === 'fail') {
          failureItemCounts.set(item.name, (failureItemCounts.get(item.name) ?? 0) + 1)
        }
      }
    }
    const mostCommonFailure = Array.from(failureItemCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-'

    return {
      total,
      passCount,
      conditionalCount,
      failCount,
      passRate,
      failRate,
      mostCommonFailure,
    }
  }, [])

  const pieData: PieData[] = [
    { name: 'Pass', value: stats.passCount, color: CHART_COLORS.success },
    { name: 'Conditional', value: stats.conditionalCount, color: CHART_COLORS.warning },
    { name: 'Fail', value: stats.failCount, color: CHART_COLORS.danger },
  ]

  const statCards = [
    { icon: <ClipboardCheck className="h-5 w-5" />, label: 'Total Inspections (This Month)', value: formatNumber(stats.total) },
    { icon: <Percent className="h-5 w-5" />, label: 'Pass Rate', value: `${stats.passRate.toFixed(1)}%` },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Fail Rate', value: `${stats.failRate.toFixed(1)}%` },
    { icon: <Wrench className="h-5 w-5" />, label: 'Most Common Failure Item', value: stats.mostCommonFailure },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            <StatCard
              icon={card.icon}
              label={card.label}
              value={card.value}
            />
          </motion.div>
        ))}
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Results Distribution</CardTitle>
          <CardDescription>Pass, conditional, and fail breakdown for this month</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full max-w-sm">
            <PieChart data={pieData} height={280} donut />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
