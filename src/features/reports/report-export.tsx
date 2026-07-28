'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  FileText,
  FileSpreadsheet,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui/search-input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { formatDate, formatNumber, cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'

interface Report {
  id: string
  name: string
  type: string
  period: string
  generatedAt: string
  format: 'pdf' | 'csv'
}

const initialReports: Report[] = [
  { id: 'RPT-001', name: 'Monthly Fleet Summary', type: 'fleet', period: 'Monthly', generatedAt: '2026-06-01T00:00:00Z', format: 'pdf' },
  { id: 'RPT-002', name: 'Fuel Consumption Report', type: 'fuel', period: 'Monthly', generatedAt: '2026-06-01T00:00:00Z', format: 'csv' },
  { id: 'RPT-003', name: 'Maintenance Cost Analysis', type: 'maintenance', period: 'Quarterly', generatedAt: '2026-04-01T00:00:00Z', format: 'pdf' },
  { id: 'RPT-004', name: 'Driver Performance Review', type: 'driver', period: 'Quarterly', generatedAt: '2026-04-01T00:00:00Z', format: 'csv' },
  { id: 'RPT-005', name: 'Annual Compliance Report', type: 'compliance', period: 'Yearly', generatedAt: '2026-01-01T00:00:00Z', format: 'pdf' },
  { id: 'RPT-006', name: 'Vehicle Utilization', type: 'fleet', period: 'Monthly', generatedAt: '2026-06-15T00:00:00Z', format: 'pdf' },
  { id: 'RPT-007', name: 'Insurance Coverage Report', type: 'insurance', period: 'Yearly', generatedAt: '2026-01-15T00:00:00Z', format: 'pdf' },
  { id: 'RPT-008', name: 'Trip Cost Breakdown', type: 'fuel', period: 'Monthly', generatedAt: '2026-06-10T00:00:00Z', format: 'csv' },
]

const reportTypes = [
  { value: 'fleet', label: 'Fleet Summary' },
  { value: 'fuel', label: 'Fuel Consumption' },
  { value: 'maintenance', label: 'Maintenance Cost' },
  { value: 'driver', label: 'Driver Performance' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'insurance', label: 'Insurance' },
]

const periods = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

const formats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' },
]

export function ReportExport() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newReportType, setNewReportType] = useState('fleet')
  const [newPeriod, setNewPeriod] = useState('monthly')
  const [newFormat, setNewFormat] = useState('pdf')
  const [reports, setReports] = useState<Report[]>(initialReports)
  const { addToast } = useToast()

  const filtered = useMemo(() => {
    if (!search) return reports
    const q = search.toLowerCase()
    return reports.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q),
    )
  }, [search, reports])

  const handleDownload = (report: Report) => {
    addToast({
      type: 'success',
      title: 'Report downloaded',
      description: `${report.name} (${report.format.toUpperCase()}) has been downloaded.`,
    })
  }

  const handleGenerate = () => {
    const id = `RPT-${String(reports.length + 1).padStart(3, '0')}`
    const typeLabel = reportTypes.find((t) => t.value === newReportType)?.label || newReportType
    const periodLabel = periods.find((p) => p.value === newPeriod)?.label || newPeriod
    const newReport: Report = {
      id,
      name: `${typeLabel} Report`,
      type: newReportType,
      period: periodLabel,
      generatedAt: new Date().toISOString(),
      format: newFormat as 'pdf' | 'csv',
    }
    setReports((prev) => [newReport, ...prev])
    setShowModal(false)
    addToast({
      type: 'success',
      title: 'Report generated',
      description: `${newReport.name} has been created.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search reports..."
          className="w-full sm:w-72"
        />
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-800/30">
            <AnimatePresence mode="popLayout">
              {filtered.map((report, idx) => (
                <motion.div
                  key={report.id}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    {report.format === 'pdf' ? (
                      <FileText className="h-4 w-4 text-red-400" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-neutral-500 capitalize">{report.type}</span>
                      <span className="text-neutral-700">·</span>
                      <span className="text-xs text-neutral-500">{report.period}</span>
                      <span className="text-neutral-700">·</span>
                      <span className="text-xs text-neutral-500">{formatDate(report.generatedAt)}</span>
                    </div>
                  </div>

                  <Badge
                    variant={report.format === 'pdf' ? 'danger' : 'success'}
                    size="sm"
                  >
                    {report.format.toUpperCase()}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(report)}
                    className="shrink-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center">
                <FileText className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm text-neutral-400">No reports found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Generate New Report"
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={() => setShowModal(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleGenerate} fullWidth>
              Generate
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Report Type
            </label>
            <Select
              options={reportTypes}
              value={newReportType}
              onChange={setNewReportType}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Period
            </label>
            <Select
              options={periods}
              value={newPeriod}
              onChange={setNewPeriod}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Format
            </label>
            <div className="flex gap-2">
              {formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setNewFormat(f.value)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200',
                    newFormat === f.value
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                      : 'border-neutral-800/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
                  )}
                >
                  {f.value === 'pdf' ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
