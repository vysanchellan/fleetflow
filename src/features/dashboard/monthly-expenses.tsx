'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LineChart, type LineConfig } from '@/components/charts/line-chart'
import { maintenanceRecords, fuelLogs } from '@/data'
import { CHART_COLORS } from '@/constants'

function generateMonthlyExpenses() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const data: { month: string; fuel: number; maintenance: number; total: number }[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()
    const label = `${months[d.getMonth()]} '${String(year).slice(2)}`

    const fuelTotal = fuelLogs
      .filter(f => {
        const fd = new Date(f.date)
        return fd.getMonth() === month && fd.getFullYear() === year
      })
      .reduce((sum, f) => sum + f.totalCost, 0)

    const maintTotal = maintenanceRecords
      .filter(m => {
        if (!m.completedDate) return false
        const md = new Date(m.completedDate)
        return md.getMonth() === month && md.getFullYear() === year
      })
      .reduce((sum, m) => sum + m.cost, 0)

    data.push({
      month: label,
      fuel: Math.round(fuelTotal),
      maintenance: Math.round(maintTotal),
      total: Math.round(fuelTotal + maintTotal),
    })
  }

  return data
}

export function MonthlyExpenses() {
  const data = generateMonthlyExpenses()

  const lines: LineConfig[] = [
    { key: 'fuel', name: 'Fuel', color: CHART_COLORS.blue },
    { key: 'maintenance', name: 'Maintenance', color: CHART_COLORS.orange },
    { key: 'total', name: 'Total', color: CHART_COLORS.success },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Operational costs overview</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={data}
          xKey="month"
          lines={lines}
          height={280}
        />
      </CardContent>
    </Card>
  )
}
