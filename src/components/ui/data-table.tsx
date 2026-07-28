'use client'

import { useState, useMemo, type ReactNode } from 'react'
import {
  Table,
  type Column,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table'
import { SearchInput } from './search-input'
import { Select } from './select'
import { Pagination } from './pagination'
import { cn } from '@/lib/utils'

export interface DataTableProps<T = unknown> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
  onRowClick?: (item: T) => void
  pageSizeOptions?: number[]
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search...',
  pageSize: defaultPageSize = 10,
  onRowClick,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const searchableColumns = useMemo(
    () => columns.filter((col) => col.sortable !== false),
    [columns],
  )

  const filteredData = useMemo(() => {
    if (!searchQuery || !searchable) return data
    const query = searchQuery.toLowerCase()
    return data.filter((item) =>
      searchableColumns.some((col) => {
        const val = (item as Record<string, unknown>)[col.key]
        return val != null && String(val).toLowerCase().includes(query)
      }),
    )
  }, [data, searchQuery, searchable, searchableColumns])

  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy]
      const bVal = (b as Record<string, unknown>)[sortBy]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp =
        typeof aVal === 'number'
          ? aVal - (bVal as number)
          : String(aVal).localeCompare(String(bVal))
      return sortOrder === 'asc' ? cmp : -cmp
    })
  }, [filteredData, sortBy, sortOrder])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, safePage, pageSize])

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size))
    setCurrentPage(1)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(searchable || pageSizeOptions) && (
        <div className="flex items-center gap-3">
          {searchable && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={searchPlaceholder}
              className="max-w-xs"
            />
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-neutral-500">Rows:</span>
            <Select
              options={pageSizeOptions.map((n) => ({
                value: String(n),
                label: String(n),
              }))}
              value={String(pageSize)}
              onChange={handlePageSizeChange}
              className="w-20"
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-neutral-800/50 overflow-hidden">
        <Table
          columns={columns}
          data={pagedData}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          Showing {sortedData.length > 0 ? (safePage - 1) * pageSize + 1 : 0}
          {' – '}
          {Math.min(safePage * pageSize, sortedData.length)} of{' '}
          {sortedData.length} results
        </span>
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export type { Column } from './table'
