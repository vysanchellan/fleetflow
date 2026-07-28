'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, User, Truck, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/toast'
import { staggerContainer, staggerItem } from '@/animations'
import { formatDate } from '@/lib/utils'

const defaultInspectionItems = [
  'Brakes', 'Tires', 'Lights', 'Engine', 'Transmission',
  'Suspension', 'Steering', 'Body', 'Fluids', 'Electrical',
]

interface InspectionItemState {
  name: string
  passed: boolean
}

export function InspectionForm() {
  const { addToast } = useToast()
  const [items, setItems] = useState<InspectionItemState[]>(
    defaultInspectionItems.map(name => ({ name, passed: true }))
  )
  const [inspector, setInspector] = useState('')
  const [notes, setNotes] = useState('')

  const today = formatDate(new Date())

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, passed: !item.passed } : item
    ))
  }

  const passedCount = items.filter(i => i.passed).length
  const failedCount = items.length - passedCount

  const handleSubmit = () => {
    addToast({
      type: 'success',
      title: 'Inspection Submitted',
      description: `${passedCount}/${items.length} items passed. Inspection recorded successfully.`,
    })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New Inspection</CardTitle>
              <CardDescription>Complete all inspection items below</CardDescription>
            </div>
            <Badge variant="primary" size="md">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {today}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 p-4 rounded-xl bg-neutral-800/30 border border-neutral-800/50 mb-6">
            <div className="flex items-center gap-2 text-neutral-400">
              <Truck className="h-4 w-4" />
              <span className="text-sm">Vehicle:</span>
              <span className="text-sm font-medium text-neutral-100">FL-1001</span>
            </div>
            <div className="w-px h-6 bg-neutral-800" />
            <div className="flex items-center gap-2 text-neutral-400">
              <User className="h-4 w-4" />
              <span className="text-sm">Driver:</span>
              <span className="text-sm font-medium text-neutral-100">James Smith</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
              Inspection Items ({passedCount}/{items.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  variants={staggerItem}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-800/20 border border-neutral-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-200">{item.name}</span>
                    {!item.passed && (
                      <Badge variant="danger" size="sm">Fail</Badge>
                    )}
                  </div>
                  <Switch
                    checked={item.passed}
                    onChange={() => toggleItem(idx)}
                    label={item.passed ? 'Pass' : 'Fail'}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                Inspector Name
              </label>
              <input
                type="text"
                value={inspector}
                onChange={e => setInspector(e.target.value)}
                placeholder="Enter inspector name..."
                className="h-10 w-full rounded-lg border border-neutral-800/50 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes or comments..."
                rows={3}
                className="w-full rounded-lg border border-neutral-800/50 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/20 border border-neutral-800/50 mb-6">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-neutral-400">
                Passed: <span className="text-emerald-400 font-medium">{passedCount}</span>
              </span>
              <span className="text-neutral-400">
                Failed: <span className="text-red-400 font-medium">{failedCount}</span>
              </span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full gap-2"
            size="lg"
          >
            <ClipboardCheck className="h-5 w-5" />
            Submit Inspection
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
