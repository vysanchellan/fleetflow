'use client'

import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { vehicles } from '@/data'
import { staggerContainer, staggerItem } from '@/animations'

const statusConfig: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }> = {
  active: { label: 'Active', variant: 'success' },
  in_maintenance: { label: 'In Maintenance', variant: 'warning' },
  inactive: { label: 'Inactive', variant: 'info' },
  out_of_service: { label: 'Out of Service', variant: 'danger' },
}

export function VehicleStatus() {
  const total = vehicles.length
  const counts: Record<string, number> = {}

  for (const v of vehicles) {
    counts[v.status] = (counts[v.status] || 0) + 1
  }

  const statuses = ['active', 'in_maintenance', 'inactive', 'out_of_service']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {statuses.map(status => {
            const config = statusConfig[status]
            const count = counts[status] || 0
            const percentage = Math.round((count / total) * 100)

            return (
              <motion.div key={status} variants={staggerItem}>
                <ProgressBar
                  label={`${config.label} (${count})`}
                  value={count}
                  max={total}
                  variant={config.variant}
                  size="lg"
                  showValue
                />
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}
