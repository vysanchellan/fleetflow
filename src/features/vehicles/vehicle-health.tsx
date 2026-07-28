'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { vehicles, inspections } from '@/data'
import { formatDate, cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { Vehicle } from '@/types'

interface VehicleHealthProps {
  vehicleId: string
}

const breakdowns = [
  { label: 'Engine', key: 'engine' },
  { label: 'Transmission', key: 'transmission' },
  { label: 'Brakes', key: 'brakes' },
  { label: 'Tires', key: 'tires' },
  { label: 'Electrical', key: 'electrical' },
  { label: 'Body', key: 'body' },
]

function generateSubScore(healthScore: number, index: number): number {
  const variation = ((healthScore * (index + 1) + index * 17 + 13) % 21) - 10
  return Math.max(5, Math.min(100, healthScore + variation))
}

function getScoreVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 70) return 'success'
  if (score >= 40) return 'warning'
  return 'danger'
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

function getAssessmentText(score: number): string {
  if (score >= 80) return 'Vehicle is in excellent condition. All systems are operating within normal parameters. No immediate maintenance required.'
  if (score >= 60) return 'Vehicle is in good condition with minor areas that may require attention during the next scheduled service.'
  if (score >= 40) return 'Vehicle requires maintenance attention. Several components need inspection or repair to prevent further degradation.'
  return 'Vehicle needs immediate service. Critical components require urgent attention to ensure safe operation.'
}

export function VehicleHealth({ vehicleId }: VehicleHealthProps) {
  const vehicle = useMemo(() => vehicles.find((v) => v.id === vehicleId) ?? null, [vehicleId])

  const subScores = useMemo(() => {
    if (!vehicle) return []
    return breakdowns.map((item, idx) => ({
      ...item,
      score: generateSubScore(vehicle.healthScore, idx),
    }))
  }, [vehicle])

  const lastInspection = useMemo(() => {
    const vehicleInspections = inspections
      .filter((i) => i.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return vehicleInspections[0] ?? null
  }, [vehicleId])

  if (!vehicle) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-neutral-500">
          Vehicle not found
        </CardContent>
      </Card>
    )
  }

  const score = vehicle.healthScore
  const gaugeColor = getScoreColor(score)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - score / 100)

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative h-44 w-44">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="oklch(0.269 0 0)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-4xl font-bold text-neutral-100"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {score}
                  </motion.span>
                  <span className="text-sm text-neutral-500">out of 100</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-neutral-100">
                {score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'} Condition
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subScores.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-neutral-300">{item.label}</span>
                  <span className="text-sm text-neutral-400">{item.score}%</span>
                </div>
                <ProgressBar
                  value={item.score}
                  variant={getScoreVariant(item.score)}
                  size="md"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Last Inspection</CardTitle>
          </CardHeader>
          <CardContent>
            {lastInspection ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">{formatDate(lastInspection.date)}</span>
                  <Badge
                    variant={lastInspection.result === 'pass' ? 'success' : lastInspection.result === 'conditional' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {lastInspection.result === 'pass' ? 'Pass' : lastInspection.result === 'conditional' ? 'Conditional' : 'Fail'}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-400">
                  Type: {lastInspection.type.replace(/_/g, ' ')} &middot; Inspector: {lastInspection.inspector}
                </p>
                {lastInspection.notes && (
                  <p className="text-sm text-neutral-500 bg-neutral-800/50 rounded-lg p-3">{lastInspection.notes}</p>
                )}
                {lastInspection.result === 'pass' && (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    No issues found
                  </div>
                )}
                {lastInspection.result === 'fail' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    {lastInspection.items.filter((i) => i.status === 'fail').length} item(s) failed
                  </div>
                )}
                {lastInspection.result === 'conditional' && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <Info className="h-4 w-4" />
                    Minor issues found
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No inspection records found.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  score >= 70 ? 'bg-emerald-500/15 text-emerald-400' : score >= 40 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400',
                )}
              >
                {score >= 70 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : score >= 40 ? (
                  <Info className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-200 leading-relaxed">{getAssessmentText(score)}</p>
                <p className="text-xs text-neutral-500 mt-2">
                  Last updated: {formatDate(vehicle.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
