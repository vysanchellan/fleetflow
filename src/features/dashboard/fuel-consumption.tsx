'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { BarChart, type BarConfig } from '@/components/charts/bar-chart'
import { fuelLogs } from '@/data'
import { CHART_COLORS } from '@/constants'

function generateFuelData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const data: { month: string; fuelCost: number; gallons: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()

    const monthLogs = fuelLogs.filter(f => {
      const fd = new Date(f.date)
      return fd.getMonth() === month && fd.getFullYear() === year
    })

    const fuelCost = Math.round(monthLogs.reduce((sum, f) => sum + f.totalCost, 0))
    const gallons = Math.round(monthLogs.reduce((sum, f) => sum + f.gallons, 0))

    data.push({
      month: `${months[d.getMonth()]} '${String(year).slice(2)}`,
      fuelCost,
      gallons,
    })
  }

  return data
}

export function FuelConsumption() {
  const data = generateFuelData()

  const bars: BarConfig[] = [
    { key: 'fuelCost', name: 'Fuel Cost', color: CHART_COLORS.blue },
    { key: 'gallons', name: 'Gallons', color: CHART_COLORS.cyan },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Consumption</CardTitle>
        <CardDescription>Monthly fuel usage and cost analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={data}
          xKey="month"
          bars={bars}
          height={280}
        />
      </CardContent>
    </Card>
  )
}
