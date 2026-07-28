'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudUpload, FileText, X, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/animations'
import { formatNumber } from '@/lib/utils'

interface UploadItem {
  id: string
  name: string
  size: number
  category: string
  status: 'uploading' | 'done' | 'error'
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

const categoryOptions = [
  { value: 'insurance', label: 'Insurance' },
  { value: 'registration', label: 'Registration' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'driver', label: 'Driver' },
  { value: 'other', label: 'Other' },
]

export function DocumentUpload() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])

  const handleDrop = () => {
    setIsDragOver(false)
    const newItem: UploadItem = {
      id: `upload-${Date.now()}`,
      name: `document_${(uploads.length + 1).toString().padStart(2, '0')}.pdf`,
      size: Math.floor(Math.random() * 5000000) + 50000,
      category: 'other',
      status: 'uploading',
    }
    setUploads((prev) => [newItem, ...prev])
    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === newItem.id ? { ...u, status: 'done' as const } : u,
        ),
      )
    }, 1500)
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }

  const statusVariant: Record<string, 'primary' | 'success'> = {
    uploading: 'primary',
    done: 'success',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); handleDrop() }}
          onClick={handleDrop}
          className={`
            relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer
            transition-colors duration-200
            ${isDragOver ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-700/50 hover:border-neutral-600 hover:bg-neutral-800/30'}
          `}
        >
          <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
            <CloudUpload className="h-7 w-7 text-neutral-400" />
          </div>
          <p className="text-sm font-medium text-neutral-300 mb-1">
            Drag and drop files or click to browse
          </p>
          <p className="text-xs text-neutral-500">PDF, JPG, PNG, DOCX up to 10MB</p>
        </div>

        {uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-neutral-300">Recent Uploads</h4>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <AnimatePresence>
                {uploads.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={staggerItem}
                    layout
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 rounded-lg border border-neutral-800/50 bg-neutral-900 px-3 py-2.5"
                  >
                    <FileText className="h-4 w-4 text-neutral-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-200 truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500">{formatFileSize(item.size)}</p>
                    </div>
                    <Select
                      value={item.category}
                      onChange={(val) =>
                        setUploads((prev) =>
                          prev.map((u) => (u.id === item.id ? { ...u, category: val } : u)),
                        )
                      }
                      options={categoryOptions}
                      className="w-32"
                    />
                    {item.status === 'uploading' ? (
                      <div className="flex items-center gap-1.5 text-xs text-blue-400">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Done
                      </Badge>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeUpload(item.id) }}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
