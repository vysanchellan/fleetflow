'use client'

import { useMemo, useState } from 'react'
import { Wrench } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { maintenanceRecords, vehicles } from '@/data'
import { formatCurrency, formatDate } from '@/lib/utils'

type DisplayStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'

const statusBadgeVariant: Record<DisplayStatus, 'primary' | 'warning' | 'success' | 'danger' | 'secondary'> = {
  scheduled: 'primary',
  in_progress: 'warning',
  completed: 'success',
  overdue: 'danger',
  cancelled: 'secondary',
}

const statusLabels: Record<DisplayStatus, string> = {
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

const priorityBadgeVariant: Record<string, 'primary' | 'warning' | 'danger' | 'secondary'> = {
  low: 'secondary',
  medium: 'primary',
  high: 'warning',
  critical: 'danger',
}

function getDisplayStatus(status: string, scheduledDate: string): DisplayStatus {
  if (status === 'pending' && new Date(scheduledDate) < new Date()) return 'overdue'
  if (status === 'pending') return 'scheduled'
  return status as DisplayStatus
}

interface EnhancedRow {
  id: string
  vehicleId: string
  vehicle: string
  serviceType: string
  status: DisplayStatus
  priority: string
  scheduledDate: string
  cost: number
  workshop: string
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export function MaintenanceTable() {
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const vehicleMap = useMemo(() => {
    const map = new Map<string, { plateNumber: string; make: string; model: string }>()
    for (const v of vehicles) {
      map.set(v.id, v)
    }
    return map
  }, [])

  const tableData: EnhancedRow[] = useMemo(() => {
    return maintenanceRecords.map((r) => {
      const vehicle = vehicleMap.get(r.vehicleId)
      return {
        id: r.id,
        vehicleId: r.vehicleId,
        vehicle: vehicle ? `${vehicle.plateNumber} | ${vehicle.make} ${vehicle.model}` : r.vehicleId,
        serviceType: r.serviceType,
        status: getDisplayStatus(r.status, r.scheduledDate),
        priority: r.priority,
        scheduledDate: r.scheduledDate,
        cost: r.cost,
        workshop: r.workshop,
      }
    })
  }, [vehicleMap])

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false
      if (priorityFilter && row.priority !== priorityFilter) return false
      return true
    })
  }, [tableData, statusFilter, priorityFilter])

  const columns: Column<EnhancedRow>[] = [
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-100">{row.vehicle.split(' | ')[0]}</span>
          <span className="text-xs text-neutral-500">{row.vehicle.split(' | ')[1]}</span>
        </div>
      ),
    },
    {
      key: 'serviceType',
      label: 'Service Type',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.serviceType}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={statusBadgeVariant[row.status]} size="sm" dot>
          {statusLabels[row.status]}
        </Badge>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (row) => (
        <Badge variant={priorityBadgeVariant[row.priority] || 'secondary'} size="sm">
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Scheduled Date',
      sortable: true,
      render: (row) => (
        <span className="text-neutral-200">{formatDate(row.scheduledDate)}</span>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      sortable: true,
      render: (row) => <span className="font-mono text-neutral-200">{formatCurrency(row.cost)}</span>,
    },
    {
      key: 'workshop',
      label: 'Workshop',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.workshop}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-44">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
          />
        </div>
        <div className="w-44">
          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="All Priorities"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-6 w-6" />}
          title="No maintenance records found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchable
          searchPlaceholder="Search by vehicle or service type..."
          pageSize={15}
        />
      )}
    </div>
  )
}
