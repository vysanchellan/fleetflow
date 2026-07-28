'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import type { Driver } from '@/types'
import { drivers, vehicles, fuelLogs } from '@/data'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatCard } from '@/components/ui/stat-card'
import { formatDate, formatNumber, cn } from '@/lib/utils'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations'

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'secondary'> = {
  available: 'success',
  on_trip: 'info',
  off_duty: 'secondary',
  sick: 'warning',
  vacation: 'secondary',
}

const statusLabels: Record<string, string> = {
  available: 'Available',
  on_trip: 'On Trip',
  off_duty: 'Off Duty',
  sick: 'Sick',
  vacation: 'Vacation',
}

function getDriverMiles(driverId: string): number {
  const logs = fuelLogs.filter((l) => l.driverId === driverId)
  return logs.reduce((sum, l) => sum + l.tripMiles, 0)
}

function getDriverFuelEfficiency(driverId: string): number {
  const logs = fuelLogs.filter((l) => l.driverId === driverId && l.mpg > 0)
  if (logs.length === 0) return 0
  return Math.round((logs.reduce((sum, l) => sum + l.mpg, 0) / logs.length) * 10) / 10
}

export interface DriverDetailProps {
  driverId?: string
  driver?: Driver
}

export function DriverDetail({ driverId, driver: driverProp }: DriverDetailProps) {
  const router = useRouter()

  const driver = useMemo(() => {
    if (driverProp) return driverProp
    if (driverId) return drivers.find((d) => d.id === driverId) ?? null
    return null
  }, [driverId, driverProp])

  const vehicleName = useMemo(() => {
    if (!driver?.assignedVehicleId) return null
    const v = vehicles.find((veh) => veh.id === driver.assignedVehicleId)
    return v ? `${v.year} ${v.make} ${v.model}` : null
  }, [driver])

  const totalMiles = useMemo(
    () => (driver ? getDriverMiles(driver.id) : 0),
    [driver],
  )

  const fuelEfficiency = useMemo(
    () => (driver ? getDriverFuelEfficiency(driver.id) : 0),
    [driver],
  )

  if (!driver) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-500">Driver not found</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card variant="glass" className="overflow-hidden">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                <Avatar
                  name={`${driver.firstName} ${driver.lastName}`}
                  size="xl"
                  className="ring-4 ring-neutral-950"
                />
                <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-neutral-100">
                      {driver.firstName} {driver.lastName}
                    </h1>
                    <Badge
                      variant={statusBadgeVariant[driver.status] ?? 'secondary'}
                      dot
                      size="sm"
                    >
                      {statusLabels[driver.status] ?? driver.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {driver.licenseClass} License &middot; {driver.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span className="text-neutral-300 truncate">{driver.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span className="text-neutral-300">{driver.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span className="text-neutral-300">
                    Hired {formatDate(driver.hireDate)}
                  </span>
                </div>
                {vehicleName && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
                    <span className="text-neutral-300 truncate">{vehicleName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Trips"
            value={formatNumber(driver.totalTrips)}
            trend={driver.totalTrips > 500 ? 'up' : 'neutral'}
          />
          <StatCard
            label="Total Miles"
            value={formatNumber(totalMiles)}
            trend={totalMiles > 10000 ? 'up' : 'neutral'}
          />
          <StatCard
            label="Safety Incidents"
            value={String(driver.safetyIncidents)}
            trend={driver.safetyIncidents === 0 ? 'up' : driver.safetyIncidents > 5 ? 'down' : 'neutral'}
          />
          <StatCard
            label="Fuel Efficiency"
            value={fuelEfficiency > 0 ? `${fuelEfficiency} MPG` : '—'}
            trend={fuelEfficiency > 8 ? 'up' : fuelEfficiency > 0 ? 'down' : 'neutral'}
          />
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Card>
          <Tabs defaultValue="overview">
            <TabsList className="mx-6 mt-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <CardContent>
              <TabsContent value="overview" className="mt-0 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-neutral-300">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Full Name</span>
                        <span className="text-neutral-200">{driver.firstName} {driver.lastName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Email</span>
                        <span className="text-neutral-200">{driver.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Phone</span>
                        <span className="text-neutral-200">{driver.phone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Department</span>
                        <span className="text-neutral-200">{driver.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-neutral-300">License Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">License Number</span>
                        <span className="text-neutral-200 font-mono">{driver.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">License Class</span>
                        <span className="text-neutral-200">{driver.licenseClass}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Hire Date</span>
                        <span className="text-neutral-200">{formatDate(driver.hireDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Assigned Vehicle</span>
                        <span className="text-neutral-200">{vehicleName ?? 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0 pt-4">
                <p className="text-sm text-neutral-500">
                  Performance data will be rendered by the DriverPerformance component.
                </p>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 pt-4">
                <p className="text-sm text-neutral-500">No documents available.</p>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0 pt-4">
                <p className="text-sm text-neutral-500">No timeline events available.</p>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  )
}
