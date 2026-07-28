'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PieChart, type PieData } from '@/components/charts/pie-chart'
import { maintenanceRecords } from '@/data'
import { CHART_COLORS } from '@/constants'

const categoryMap: Record<string, string> = {
  'Oil Change': 'Oil Changes',
  'Tire Replacement': 'Tire Rotation',
  'Brake Inspection & Repair': 'Brake Service',
  'Engine Tune-Up': 'Engine Repair',
  'Transmission Service': 'Transmission',
  'Coolant Flush': 'Other',
  'Air Filter Replacement': 'Other',
  'Battery Replacement': 'Other',
  'Alignment & Balancing': 'Other',
  'AC Service': 'Other',
  'Exhaust System Repair': 'Other',
  'Fuel System Cleaning': 'Other',
  'Suspension Repair': 'Other',
  'Electrical System Diagnosis': 'Other',
  'Clutch Replacement': 'Other',
  'Turbocharger Repair': 'Other',
  'Differential Service': 'Other',
  'Hydraulic System Service': 'Other',
  'Emission System Check': 'Other',
  'Steering Rack Replacement': 'Other',
}

const categoryColors: Record<string, string> = {
  'Oil Changes': CHART_COLORS.blue,
  'Brake Service': CHART_COLORS.red,
  'Tire Rotation': CHART_COLORS.green,
  'Engine Repair': CHART_COLORS.orange,
  'Transmission': CHART_COLORS.purple,
  'Other': CHART_COLORS.yellow,
}

export function MaintenanceHistory() {
  const completed = maintenanceRecords.filter(m => m.status === 'completed')
  const categoryTotals: Record<string, number> = {}

  for (const record of completed) {
    const category = categoryMap[record.serviceType] || 'Other'
    categoryTotals[category] = (categoryTotals[category] || 0) + record.cost
  }

  const data: PieData[] = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: categoryColors[name],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Breakdown</CardTitle>
        <CardDescription>By service type</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart data={data} donut height={280} />
      </CardContent>
    </Card>
  )
}
