'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AreaChart } from '@/components/charts/area-chart'
import { vehicles } from '@/data'
import { CHART_COLORS } from '@/constants'

function generateUtilizationData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const total = vehicles.length
  const activeBase = vehicles.filter(v => v.status === 'active').length
  const data: { month: string; activeFleet: number; utilizationRate: number }[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthLabel = months[d.getMonth()]
    const yearLabel = d.getFullYear()
    const seed = d.getMonth() * 7 + d.getFullYear()

    const variance = Math.round((seed % 5) - 2)
    const active = Math.min(total, Math.max(0, activeBase + variance))
    const utilization = Math.round((active / total) * 100)

    data.push({
      month: `${monthLabel} '${String(yearLabel).slice(2)}`,
      activeFleet: active,
      utilizationRate: utilization,
    })
  }

  return data
}

export function FleetUtilization() {
  const data = generateUtilizationData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Utilization</CardTitle>
        <CardDescription>12-month overview</CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={data}
          xKey="month"
          yKey="activeFleet"
          yKey2="utilizationRate"
          height={280}
          color={CHART_COLORS.primary}
          color2={CHART_COLORS.success}
        />
      </CardContent>
    </Card>
  )
}
