'use client'

import { useMemo, useState } from 'react'
import { Fuel } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { fuelLogs, vehicles, drivers } from '@/data'
import { formatCurrency, formatDate } from '@/lib/utils'

interface EnhancedRow {
  id: string
  date: string
  vehicle: string
  driverName: string
  gallons: number
  pricePerGallon: number
  totalCost: number
  mpg: number
  station: string
  fuelType: string
}

const fuelTypeOptions = [
  { value: '', label: 'All Fuel Types' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'electric', label: 'Electric' },
]

export function FuelTable() {
  const [fuelTypeFilter, setFuelTypeFilter] = useState('')

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
    return fuelLogs.map(f => ({
      id: f.id,
      date: f.date,
      vehicle: vehicleMap.get(f.vehicleId) ?? f.vehicleId,
      driverName: f.driverId ? (driverMap.get(f.driverId) ?? '-') : '-',
      gallons: f.gallons,
      pricePerGallon: f.pricePerGallon,
      totalCost: f.totalCost,
      mpg: f.mpg,
      station: f.station,
      fuelType: f.fuelType,
    }))
  }, [vehicleMap, driverMap])

  const filteredData = useMemo(() => {
    if (!fuelTypeFilter) return tableData
    return tableData.filter(r => r.fuelType === fuelTypeFilter)
  }, [tableData, fuelTypeFilter])

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
      label: 'Driver Name',
      sortable: true,
      render: (row) => <span className="text-neutral-200">{row.driverName}</span>,
    },
    {
      key: 'gallons',
      label: 'Gallons',
      sortable: true,
      render: (row) => <span className="font-mono text-neutral-200">{row.gallons.toFixed(2)}</span>,
    },
    {
      key: 'pricePerGallon',
      label: 'Price/Gal',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-neutral-200">{formatCurrency(row.pricePerGallon)}</span>
      ),
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-neutral-200">{formatCurrency(row.totalCost)}</span>
      ),
    },
    {
      key: 'mpg',
      label: 'MPG',
      sortable: true,
      render: (row) => <span className="font-mono text-neutral-200">{row.mpg.toFixed(1)}</span>,
    },
    {
      key: 'station',
      label: 'Station',
      sortable: true,
      render: (row) => <span className="text-neutral-200 text-xs">{row.station}</span>,
      className: 'max-w-[200px] truncate',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-44">
          <Select
            options={fuelTypeOptions}
            value={fuelTypeFilter}
            onChange={setFuelTypeFilter}
            placeholder="All Fuel Types"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyState
          icon={<Fuel className="h-6 w-6" />}
          title="No fuel logs found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          searchable
          searchPlaceholder="Search by plate, driver, or station..."
          pageSize={15}
        />
      )}
    </div>
  )
}
