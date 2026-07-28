'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import type { Driver } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatDate, getDaysUntil, getStatusFromDays, cn } from '@/lib/utils'
import { CHART_COLORS } from '@/constants'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function generateMonthlyTrips(seed: number): { month: string; trips: number }[] {
  return months.map((month, i) => ({
    month,
    trips: 10 + ((seed * (i + 1) * 7) % 35) + ((seed * 13 + i * 11) % 15),
  }))
}

function generateFuelEfficiency(seed: number): { month: string; mpg: number }[] {
  const base = 6 + (seed % 4)
  return months.map((month, i) => ({
    month,
    mpg: base + Math.sin(i * 0.7) * 1.5 + ((seed * (i + 1) * 3) % 10) / 10,
  }))
}

function generateSafetyScore(seed: number): number {
  return 65 + ((seed * 17) % 30)
}

function generateFuelScore(seed: number): number {
  return 60 + ((seed * 13) % 35)
}

function generateTimelinessScore(seed: number): number {
  return 70 + ((seed * 11) % 25)
}

function generateComplianceScore(seed: number): number {
  return 75 + ((seed * 19) % 20)
}

interface SafetyIncident {
  date: string
  type: string
  severity: 'minor' | 'major' | 'critical'
  description: string
}

function generateSafetyIncidents(driver: Driver, seed: number): SafetyIncident[] {
  const incidentTypes = [
    'Hard Braking',
    'Speeding',
    'Lane Departure',
    'Following Distance',
    'Distracted Driving',
    'Rolling Stop',
  ]
  const count = driver.safetyIncidents
  const incidents: SafetyIncident[] = []
  for (let i = 0; i < Math.min(count, 8); i++) {
    const dayOffset = (seed * (i + 1) * 37) % 365
    const d = new Date()
    d.setDate(d.getDate() - dayOffset)
    const typeIdx = (seed * (i + 1) * 7) % incidentTypes.length
    const severityIdx = (seed * (i + 1) * 13) % 3
    const severity: SafetyIncident['severity'] =
      severityIdx === 0 ? 'minor' : severityIdx === 1 ? 'major' : 'critical'
    incidents.push({
      date: d.toISOString(),
      type: incidentTypes[typeIdx],
      severity,
      description: `Driver involved in ${incidentTypes[typeIdx].toLowerCase()} incident`,
    })
  }
  return incidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function generateExpiryDate(seed: number, baseYears: number): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + baseYears + (seed % 3))
  d.setDate(d.getDate() + (seed * 7) % 60)
  return d.toISOString()
}

const severityColors: Record<string, string> = {
  minor: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  major: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-[#1a1a1a]/95 border border-[#333] backdrop-blur-sm px-3 py-2 shadow-xl">
      <p className="text-xs text-[#999] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  )
}

export interface DriverPerformanceProps {
  driver: Driver
}

export function DriverPerformance({ driver }: DriverPerformanceProps) {
  const seed = useMemo(() => {
    const num = parseInt(driver.id.replace(/\D/g, ''), 10) || 1
    return num
  }, [driver.id])

  const monthlyTrips = useMemo(() => generateMonthlyTrips(seed), [seed])
  const fuelData = useMemo(() => generateFuelEfficiency(seed), [seed])
  const safetyScore = useMemo(() => generateSafetyScore(seed), [seed])
  const fuelScore = useMemo(() => generateFuelScore(seed), [seed])
  const timelinessScore = useMemo(() => generateTimelinessScore(seed), [seed])
  const complianceScore = useMemo(() => generateComplianceScore(seed), [seed])

  const incidents = useMemo(() => generateSafetyIncidents(driver, seed), [driver, seed])

  const licenseExpiry = useMemo(() => generateExpiryDate(seed, 2), [seed])
  const medicalExpiry = useMemo(() => generateExpiryDate(seed + 50, 1), [seed])
  const licenseDays = useMemo(() => getDaysUntil(licenseExpiry), [licenseExpiry])
  const medicalDays = useMemo(() => getDaysUntil(medicalExpiry), [medicalExpiry])

  const gaugeAngle = (driver.drivingScore / 100) * 180
  const gaugeRadians = (gaugeAngle * Math.PI) / 180
  const radius = 54
  const cx = 60
  const cy = 60
  const startX = cx - radius
  const startY = cy
  const endX = cx - radius * Math.cos(gaugeRadians)
  const endY = cy - radius * Math.sin(gaugeRadians)
  const largeArc = gaugeAngle > 90 ? 1 : 0

  const gaugeColor =
    driver.drivingScore > 80 ? '#22c55e' : driver.drivingScore >= 60 ? '#f59e0b' : '#ef4444'

  const axisStyle = { stroke: '#404040', fontSize: 12, tickLine: false }
  const gridStyle = { stroke: '#333', strokeDasharray: '3 3' }

  const scoreBreakdown = [
    { label: 'Safety', score: safetyScore },
    { label: 'Fuel Efficiency', score: fuelScore },
    { label: 'Timeliness', score: timelinessScore },
    { label: 'Compliance', score: complianceScore },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Driving Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 120 120" className="w-48 h-48">
                  <path
                    d={`M ${cx - radius + 4} ${cy} A ${radius - 4} ${radius - 4} 0 1 1 ${cx + radius - 4} ${cy}`}
                    fill="none"
                    stroke="#262626"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${startX + 4} ${startY} A ${radius - 4} ${radius - 4} 0 ${largeArc} 1 ${endX} ${endY}`}
                    fill="none"
                    stroke={gaugeColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    fill="#e5e5e5"
                    fontSize="28"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {driver.drivingScore}
                  </text>
                  <text
                    x={cx}
                    y={cy + 16}
                    textAnchor="middle"
                    fill="#737373"
                    fontSize="10"
                  >
                    / 100
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {scoreBreakdown.map((item) => {
                const variant =
                  item.score > 80
                    ? 'success'
                    : item.score >= 60
                      ? 'warning'
                      : 'danger'
                return (
                  <div key={item.label}>
                    <ProgressBar
                      label={item.label}
                      value={item.score}
                      variant={variant}
                      showValue
                      size="md"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trip Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyTrips} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid {...gridStyle} vertical={false} />
                  <XAxis dataKey="month" {...axisStyle} axisLine={{ stroke: '#404040' }} />
                  <YAxis {...axisStyle} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#333' }} />
                  <Bar
                    dataKey="trips"
                    fill={CHART_COLORS.blue}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Fuel Efficiency Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={fuelData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid {...gridStyle} vertical={false} />
                  <XAxis dataKey="month" {...axisStyle} axisLine={{ stroke: '#404040' }} />
                  <YAxis {...axisStyle} axisLine={false} unit=" MPG" />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#555', strokeDasharray: '3 3' }} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: '#ccc' }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Line
                    type="monotone"
                    dataKey="mpg"
                    stroke={CHART_COLORS.green}
                    strokeWidth={2}
                    dot={{ r: 3, fill: CHART_COLORS.green, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: CHART_COLORS.green, stroke: '#1a1a1a', strokeWidth: 2 }}
                    name="MPG"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Safety Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <p className="text-3xl mb-2">&#x2705;</p>
                    <p className="text-sm text-emerald-400 font-medium">No Incidents</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      This driver has a clean safety record
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/30 border border-neutral-800/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-neutral-200">
                            {incident.type}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border',
                              severityColors[incident.severity],
                            )}
                          >
                            {incident.severity}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {incident.description}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-500 shrink-0">
                        {formatDate(incident.date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>License & Medical Expiry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-neutral-200">Driver License</h4>
                  <span className="text-xs text-neutral-500">
                    Expires {formatDate(licenseExpiry)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={Math.max(0, licenseDays)}
                    max={365}
                    variant={getStatusFromDays(licenseDays)}
                    size="lg"
                    showValue
                  />
                  <span className="text-sm font-medium text-neutral-300 min-w-[80px] text-right">
                    {licenseDays > 0 ? `${licenseDays}d left` : 'Expired'}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-neutral-200">Medical Certificate</h4>
                  <span className="text-xs text-neutral-500">
                    Expires {formatDate(medicalExpiry)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={Math.max(0, medicalDays)}
                    max={365}
                    variant={getStatusFromDays(medicalDays)}
                    size="lg"
                    showValue
                  />
                  <span className="text-sm font-medium text-neutral-300 min-w-[80px] text-right">
                    {medicalDays > 0 ? `${medicalDays}d left` : 'Expired'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
