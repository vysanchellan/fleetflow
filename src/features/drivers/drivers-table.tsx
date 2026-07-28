'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { drivers, vehicles } from '@/data'
import type { Driver } from '@/types'
import { DataTable } from '@/components/ui/data-table'
import type { Column } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Select } from '@/components/ui/select'
import { SearchInput } from '@/components/ui/search-input'
import { formatDate, getDaysUntil, getStatusFromDays, cn } from '@/lib/utils'
import { fadeInUp, staggerContainer, staggerItem } from '@/animations'
import { Card } from '@/components/ui/card'

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'on_trip', label: 'On Trip' },
  { value: 'off_duty', label: 'Off Duty' },
  { value: 'sick', label: 'Sick' },
  { value: 'vacation', label: 'Vacation' },
]

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

function getScoreVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score > 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

function generateLicenseExpiry(driver: Driver): string {
  const hire = new Date(driver.hireDate)
  const offset = (parseInt(driver.id.slice(3), 10) % 4) * 365
  const expiry = new Date(hire.getFullYear() + 4, hire.getMonth(), hire.getDate())
  expiry.setDate(expiry.getDate() + offset)
  return expiry.toISOString()
}

function getVehicleName(vehicleId?: string): string {
  if (!vehicleId) return '—'
  const vehicle = vehicles.find((v) => v.id === vehicleId)
  if (!vehicle) return '—'
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
}

interface DriverRow {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseClass: string
  status: string
  drivingScore: number
  totalTrips: number
  safetyIncidents: number
  assignedVehicle: string
  assignedVehicleId?: string
  licenseExpiry: string
  daysUntilExpiry: number
  driver: Driver
}

function buildRows(): DriverRow[] {
  return drivers.map((d) => {
    const expiry = generateLicenseExpiry(d)
    return {
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
      licenseClass: d.licenseClass,
      status: d.status,
      drivingScore: d.drivingScore,
      totalTrips: d.totalTrips,
      safetyIncidents: d.safetyIncidents,
      assignedVehicle: getVehicleName(d.assignedVehicleId),
      assignedVehicleId: d.assignedVehicleId,
      licenseExpiry: expiry,
      daysUntilExpiry: getDaysUntil(expiry),
      driver: d,
    }
  })
}

const allRows = buildRows()

export function DriversTable() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRows = useMemo(() => {
    let data = allRows

    if (statusFilter !== 'all') {
      data = data.filter((r) => r.status === statusFilter)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.licenseClass.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      )
    }

    return data
  }, [searchQuery, statusFilter])

  const columns: Column<DriverRow>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            <Avatar
              name={`${row.firstName} ${row.lastName}`}
              size="sm"
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-100 truncate">
                {row.firstName} {row.lastName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'licenseClass',
        label: 'License Class',
        sortable: true,
        render: (row) => (
          <span className="font-mono text-sm text-neutral-200">
            {row.licenseClass}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <Badge
            variant={statusBadgeVariant[row.status] ?? 'secondary'}
            dot
          >
            {statusLabels[row.status] ?? row.status}
          </Badge>
        ),
      },
      {
        key: 'drivingScore',
        label: 'Driving Score',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3 min-w-[140px]">
            <ProgressBar
              value={row.drivingScore}
              variant={getScoreVariant(row.drivingScore)}
              size="sm"
              showValue
              className="flex-1"
            />
          </div>
        ),
      },
      {
        key: 'totalTrips',
        label: 'Total Trips',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-neutral-200 font-mono">
            {row.totalTrips.toLocaleString()}
          </span>
        ),
      },
      {
        key: 'safetyIncidents',
        label: 'Safety Incidents',
        sortable: true,
        render: (row) => (
          <span
            className={cn(
              'text-sm font-mono',
              row.safetyIncidents === 0
                ? 'text-emerald-400'
                : row.safetyIncidents > 5
                  ? 'text-red-400'
                  : 'text-amber-400',
            )}
          >
            {row.safetyIncidents}
          </span>
        ),
      },
      {
        key: 'assignedVehicle',
        label: 'Assigned Vehicle',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-neutral-300 truncate max-w-[180px] block">
            {row.assignedVehicle}
          </span>
        ),
      },
      {
        key: 'licenseExpiry',
        label: 'License Expiry',
        sortable: true,
        render: (row) => {
          const variant = getStatusFromDays(row.daysUntilExpiry)
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-neutral-200">
                {formatDate(row.licenseExpiry)}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  variant === 'danger' && 'text-red-400',
                  variant === 'warning' && 'text-amber-400',
                  variant === 'success' && 'text-emerald-400',
                )}
              >
                {row.daysUntilExpiry > 0
                  ? `${row.daysUntilExpiry}d remaining`
                  : 'Expired'}
              </span>
            </div>
          )
        },
      },
    ],
    [],
  )

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, license, email..."
          className="max-w-xs"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <DataTable
          columns={columns}
          data={filteredRows}
          onRowClick={(row) =>
            router.push(`/drivers/${(row as DriverRow).id}`)
          }
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </motion.div>
    </motion.div>
  )
}
