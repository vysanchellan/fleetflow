'use client'

import { useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { inspections, vehicles, drivers } from '@/data'
import { formatDate } from '@/lib/utils'

interface EnhancedRow {
  id: string
  date: string
  vehicle: string
  driverName: string
  type: string
  result: 'pass' | 'conditional' | 'fail'
  inspector: string
  itemsPassed: string
  vehicleId: string
}

const resultBadgeVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  conditional: 'warning',
  fail: 'danger',
}

const resultLabels: Record<string, string> = {
  pass: 'Pass',
  conditional: 'Conditional',
  fail: 'Fail',
}

const typeLabels: Record<string, string> = {
  pre_trip: 'Pre-Trip',
  post_trip: 'Post-Trip',
  scheduled: 'Scheduled',
  random: 'Random',
}

const resultOptions = [
  { value: '', label: 'All Results' },
  { value: 'pass', label: 'Pass' },
  { value: 'conditional', label: 'Conditional' },
  { value: 'fail', label: 'Fail' },
]

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'pre_trip', label: 'Pre-Trip' },
  { value: 'post_trip', label: 'Post-Trip' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'random', label: 'Random' },
]

export function InspectionsTable() {
  const [resultFilter, setResultFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const vehicleMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const v of vehicles) map.set(v.id, v.plateNumber)
    return map
  }, [])

  const driverMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of drivers) map.set(d.id, `${d.firstName} ${d.lastName}`)
    return map
  }, [])

  const tableData: EnhancedRow[] = useMemo(() => {
    return inspections.map(ins => {
      const passed = ins.items.filter(i => i.status === 'pass').length
      const total = ins.items.length
      return {
        id: ins.id,
        date: ins.date,
        vehicle: vehicleMap.get(ins.vehicleId) ?? ins.vehicleId,
        driverName: ins.driverId ? (driverMap.get(ins.driverId) ?? '-') : '-',
        type: typeLabels[ins.type] ?? ins.type,
        result: ins.result,
        inspector: ins.inspector,
        itemsPassed: `${passed}/${total}`,
        vehicleId: ins.vehicleId,
      }
    })
  }, [vehicleMap, driverMap])

  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      if (resultFilter && row.result !== resultFilter) return false
      if (typeFilter) {
        const typeKey = Object.entries(typeLabels).find(([, v]) => v === row.type)?.[0]
        if (typeKey !== typeFilter) return false
      }
      return true
    })
  }, [tableData, resultFilter, typeFilter])

  const columns: Column<EnhancedRow>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{formatDate(row.date)}</span>,
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-neutral-100">{row.vehicle}</span>
      ),
    },
    {
      key: 'driverName',
      label: 'Driver',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.driverName}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.type}</span>,
    },
    {
      key: 'result',
      label: 'Result',
      sortable: true,
      render: (row) => (
        <Badge variant={resultBadgeVariant[row.result]} size="sm" dot>
          {resultLabels[row.result]}
        </Badge>
      ),
    },
    {
      key: 'inspector',
      label: 'Inspector',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.inspector}</span>,
    },
    {
      key: 'itemsPassed',
      label: 'Items Passed',
      sortable: true,
      render: (row) => <span className="font-mono text-neutral-200">{row.itemsPassed}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-44">
          <Select
            options={resultOptions}
            value={resultFilter}
            onChange={setResultFilter}
            placeholder="All Results"
          />
        </div>
        <div className="w-44">
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Types"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-6 w-6" />}
          title="No inspections found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchable
          searchPlaceholder="Search by plate, driver, or inspector..."
          pageSize={15}
        />
      )}
    </div>
  )
}
