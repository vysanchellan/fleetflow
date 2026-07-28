'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Select } from '@/components/ui/select'
import { vehicles, drivers, maintenanceRecords } from '@/data'
import { formatNumber, formatDateRelative, cn } from '@/lib/utils'
import { fadeInUp } from '@/animations'
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

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'in_maintenance', label: 'In Maintenance' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'out_of_service', label: 'Out of Service' },
]

interface VehicleRow {
  id: string
  plateNumber: string
  makeModel: string
  year: number
  status: Vehicle['status']
  fuelType: Vehicle['fuelType']
  mileage: number
  driverName: string
  healthScore: number
  nextServiceDateLabel: string
  [key: string]: unknown
}

export function VehiclesTable() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('all')

  const tableData: VehicleRow[] = useMemo(() => {
    const driverMap = new Map(drivers.map((d) => [d.id, `${d.firstName} ${d.lastName}`]))

    const nextServiceMap = new Map<string, string>()
    for (const m of maintenanceRecords) {
      if (m.status === 'pending' || m.status === 'in_progress') {
        const existing = nextServiceMap.get(m.vehicleId)
        if (!existing || m.scheduledDate < existing) {
          nextServiceMap.set(m.vehicleId, m.scheduledDate)
        }
      }
    }

    return vehicles.map((v) => ({
      ...v,
      makeModel: `${v.make} ${v.model}`,
      driverName: v.assignedDriverId ? driverMap.get(v.assignedDriverId) ?? '\u2014' : '\u2014',
      nextServiceDateLabel: nextServiceMap.has(v.id) ? formatDateRelative(nextServiceMap.get(v.id)!) : 'None',
    }))
  }, [])

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return tableData
    return tableData.filter((v) => v.status === statusFilter)
  }, [tableData, statusFilter])

  const columns: Column<VehicleRow>[] = [
    {
      key: 'plateNumber',
      label: 'Plate',
      sortable: true,
    },
    {
      key: 'makeModel',
      label: 'Make/Model',
      sortable: true,
      render: (item) => <span className="font-medium text-neutral-100">{item.makeModel}</span>,
    },
    {
      key: 'year',
      label: 'Year',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item) => {
        const config = statusConfig[item.status]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      sortable: true,
      render: (item) => fuelTypeLabels[item.fuelType] ?? item.fuelType,
    },
    {
      key: 'mileage',
      label: 'Mileage',
      sortable: true,
      render: (item) => formatNumber(item.mileage),
    },
    {
      key: 'driverName',
      label: 'Driver',
      sortable: true,
    },
    {
      key: 'healthScore',
      label: 'Health',
      sortable: true,
      render: (item) => (
        <ProgressBar
          value={item.healthScore}
          variant={item.healthScore >= 70 ? 'success' : item.healthScore >= 40 ? 'warning' : 'danger'}
          size="sm"
          showValue
        />
      ),
    },
    {
      key: 'nextServiceDateLabel',
      label: 'Next Service',
      sortable: false,
      render: (item) => (
        <span className={cn('text-sm', item.nextServiceDateLabel === 'None' ? 'text-neutral-500' : 'text-neutral-300')}>
          {item.nextServiceDateLabel}
        </span>
      ),
    },
  ]

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        searchable
        searchPlaceholder="Search by plate, make, model..."
        pageSize={10}
        onRowClick={(item) => router.push(`/vehicles/${item.id}`)}
      />
    </motion.div>
  )
}
