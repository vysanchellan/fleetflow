'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProgressBar } from '@/components/ui/progress-bar'
import { vehicles, drivers, fuelLogs, maintenanceRecords, documents } from '@/data'
import { formatNumber, formatDate } from '@/lib/utils'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations'
import { ArrowLeft, Truck, Gauge, Fuel, Wrench, FileText } from 'lucide-react'
import { VehicleTimeline } from './vehicle-timeline'
import type { Vehicle } from '@/types'

const statusConfig: Record<Vehicle['status'], { variant: 'success' | 'warning' | 'danger' | 'secondary'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  in_maintenance: { variant: 'warning', label: 'In Maintenance' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  out_of_service: { variant: 'danger', label: 'Out of Service' },
}

const fuelTypeLabels: Record<Vehicle['fuelType'], string> = {
  diesel: 'Diesel',
  gasoline: 'Gasoline',
  electric: 'Electric',
  hybrid: 'Hybrid',
  cng: 'CNG',
}

interface VehicleDetailProps {
  vehicleId: string
}

export function VehicleDetail({ vehicleId }: VehicleDetailProps) {
  const router = useRouter()

  const vehicle = useMemo(() => vehicles.find((v) => v.id === vehicleId) ?? null, [vehicleId])

  const driverName = useMemo(() => {
    if (!vehicle?.assignedDriverId) return null
    const driver = drivers.find((d) => d.id === vehicle.assignedDriverId)
    return driver ? `${driver.firstName} ${driver.lastName}` : null
  }, [vehicle])

  const avgMpg = useMemo(() => {
    const logs = fuelLogs.filter((f) => f.vehicleId === vehicleId)
    if (logs.length === 0) return '\u2014'
    const avg = logs.reduce((sum, f) => sum + f.mpg, 0) / logs.length
    return avg.toFixed(1)
  }, [vehicleId])

  const vehicleMaintenance = useMemo(
    () => maintenanceRecords.filter((m) => m.vehicleId === vehicleId).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
    [vehicleId],
  )

  const vehicleDocuments = useMemo(
    () => documents.filter((d) => d.vehicleId === vehicleId),
    [vehicleId],
  )

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Truck className="h-12 w-12 text-neutral-600" />
        <p className="text-neutral-400 text-lg">Vehicle not found</p>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="h-48 bg-gradient-to-br from-blue-600/20 to-blue-900/30 flex items-center justify-center rounded-t-xl">
              <Truck className="h-20 w-20 text-blue-400/60" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-100">{vehicle.plateNumber}</h1>
                <p className="text-neutral-400 mt-1">
                  {vehicle.make} {vehicle.model} &middot; {vehicle.year}
                </p>
              </div>
              <Badge variant={statusConfig[vehicle.status].variant} size="md" dot>
                {statusConfig[vehicle.status].label}
              </Badge>
              {driverName && (
                <div className="text-sm text-neutral-400">
                  Driver: <span className="text-neutral-200">{driverName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="oklch(0.269 0 0)" strokeWidth="8" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={vehicle.healthScore >= 70 ? '#22c55e' : vehicle.healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - vehicle.healthScore / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-neutral-100">{vehicle.healthScore}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Engine</span>
                  <span className="text-neutral-200">{Math.min(100, vehicle.healthScore + 5)}%</span>
                </div>
                <ProgressBar value={Math.min(100, vehicle.healthScore + 5)} variant={vehicle.healthScore >= 65 ? 'success' : 'warning'} size="sm" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Transmission</span>
                  <span className="text-neutral-200">{Math.max(0, vehicle.healthScore - 3)}%</span>
                </div>
                <ProgressBar value={Math.max(0, vehicle.healthScore - 3)} variant={vehicle.healthScore >= 67 ? 'success' : 'warning'} size="sm" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Brakes</span>
                  <span className="text-neutral-200">{Math.max(0, vehicle.healthScore - 8)}%</span>
                </div>
                <ProgressBar value={Math.max(0, vehicle.healthScore - 8)} variant={vehicle.healthScore >= 62 ? 'success' : vehicle.healthScore >= 32 ? 'warning' : 'danger'} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div variants={staggerItem} className="rounded-xl bg-neutral-900 border border-neutral-800/50 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-wider mb-2">
            <Gauge className="h-3.5 w-3.5" />
            Mileage
          </div>
          <p className="text-lg font-semibold text-neutral-100">{formatNumber(vehicle.mileage)} mi</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-xl bg-neutral-900 border border-neutral-800/50 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5" />
            VIN
          </div>
          <p className="text-lg font-semibold text-neutral-100 font-mono text-sm">{vehicle.vin}</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-xl bg-neutral-900 border border-neutral-800/50 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-wider mb-2">
            <Fuel className="h-3.5 w-3.5" />
            Fuel Type
          </div>
          <p className="text-lg font-semibold text-neutral-100">{fuelTypeLabels[vehicle.fuelType] ?? vehicle.fuelType}</p>
        </motion.div>
        <motion.div variants={staggerItem} className="rounded-xl bg-neutral-900 border border-neutral-800/50 p-4">
          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-wider mb-2">
            <Wrench className="h-3.5 w-3.5" />
            Avg MPG
          </div>
          <p className="text-lg font-semibold text-neutral-100">{avgMpg}</p>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Department', vehicle.department],
                  ['Location', vehicle.location],
                  ['VIN', vehicle.vin],
                  ['Year', String(vehicle.year)],
                  ['Make', vehicle.make],
                  ['Model', vehicle.model],
                  ['Fuel Type', fuelTypeLabels[vehicle.fuelType] ?? vehicle.fuelType],
                  ['Mileage', `${formatNumber(vehicle.mileage)} mi`],
                  ['Health Score', `${vehicle.healthScore}%`],
                  ['Status', statusConfig[vehicle.status].label],
                  ['Driver', driverName ?? '\u2014'],
                  ['Created', formatDate(vehicle.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-neutral-500 uppercase tracking-wider">{label}</dt>
                    <dd className="text-sm text-neutral-200">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle>Service History ({vehicleMaintenance.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicleMaintenance.length === 0 ? (
                <p className="text-neutral-500 text-sm py-4 text-center">No maintenance records found.</p>
              ) : (
                <div className="divide-y divide-neutral-800/50">
                  {vehicleMaintenance.slice(0, 20).map((m) => (
                    <div key={m.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-100">{m.serviceType}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{m.workshop}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={m.status === 'completed' ? 'success' : m.status === 'in_progress' ? 'warning' : m.status === 'pending' ? 'secondary' : 'danger'} size="sm">
                          {m.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-neutral-500 mt-1">{formatDate(m.scheduledDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents ({vehicleDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicleDocuments.length === 0 ? (
                <p className="text-neutral-500 text-sm py-4 text-center">No documents found.</p>
              ) : (
                <div className="divide-y divide-neutral-800/50">
                  {vehicleDocuments.map((d) => (
                    <div key={d.id} className="py-3 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-neutral-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-100 truncate">{d.name}</p>
                        <p className="text-xs text-neutral-500">{d.category} &middot; {formatDate(d.uploadedAt)}</p>
                      </div>
                      <Badge variant="outline" size="sm">{d.fileType.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="pt-6">
              <VehicleTimeline vehicleId={vehicleId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}


