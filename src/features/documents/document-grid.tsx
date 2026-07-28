'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, File, Clock, AlertCircle, Truck, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui/search-input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { documents, vehicles, drivers } from '@/data'
import { formatDate, formatNumber, isExpiringSoon, getDaysUntil } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'
import type { Document } from '@/types'

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'registration', label: 'Registration' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'driver', label: 'Driver' },
]

const categoryVariants: Record<Document['category'], 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default'> = {
  insurance: 'primary',
  registration: 'success',
  inspection: 'warning',
  maintenance: 'info',
  driver: 'secondary',
  other: 'default',
}

const vehicleMap = new Map(vehicles.map(v => [v.id, `${v.year} ${v.make} ${v.model}`]))
const driverMap = new Map(drivers.map(d => [d.id, `${d.firstName} ${d.lastName}`]))

function getFileIcon(fileType: Document['fileType']) {
  if (fileType === 'pdf') return <FileText className="h-5 w-5" />
  if (fileType === 'jpg' || fileType === 'png') return <Image className="h-5 w-5" />
  return <File className="h-5 w-5" />
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

function DocumentCard({ doc, index }: { doc: Document; index: number }) {
  const vehicleName = doc.vehicleId ? vehicleMap.get(doc.vehicleId) : undefined
  const driverName = doc.driverId ? driverMap.get(doc.driverId) : undefined
  const expiring = doc.expiresAt ? isExpiringSoon(doc.expiresAt, 30) : false
  const daysUntilExpiry = doc.expiresAt ? getDaysUntil(doc.expiresAt) : null

  return (
    <motion.div variants={staggerItem} custom={index}>
      <Card hoverable className="h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <span className="text-neutral-400">{getFileIcon(doc.fileType)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-neutral-100 truncate">{doc.name}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">{doc.fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant={categoryVariants[doc.category]} size="sm">
              {doc.category}
            </Badge>
            <span className="text-xs text-neutral-500">{formatFileSize(doc.fileSize)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
            <Clock className="h-3 w-3" />
            <span>{formatDate(doc.uploadedAt)}</span>
          </div>

          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {doc.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto space-y-1">
            {vehicleName && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Truck className="h-3 w-3" />
                <span className="truncate">{vehicleName}</span>
              </div>
            )}
            {driverName && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <User className="h-3 w-3" />
                <span className="truncate">{driverName}</span>
              </div>
            )}
            {expiring && daysUntilExpiry !== null && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                <AlertCircle className="h-3 w-3" />
                <span>Expires in {daysUntilExpiry} days</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function DocumentGrid() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = useMemo(() => {
    let result = documents
    if (activeCategory !== 'all') {
      result = result.filter((d) => d.category === activeCategory)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((d) => d.name.toLowerCase().includes(q))
    }
    return result
  }, [search, activeCategory])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search documents..."
          className="flex-1"
        />
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((doc, idx) => (
              <DocumentCard key={doc.id} doc={doc} index={idx} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">No documents found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
