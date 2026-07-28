'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InspectionsTable } from '@/features/inspections/inspections-table'
import { InspectionForm } from '@/features/inspections/inspection-form'
import { InspectionStats } from '@/features/inspections/inspection-stats'
import { ClipboardList, Plus, BarChart3 } from 'lucide-react'

export function InspectionsView() {
  const [view, setView] = useState('records')

  return (
    <Tabs value={view} onValueChange={setView}>
      <TabsList className="mb-6">
        <TabsTrigger value="records">
          <ClipboardList className="w-4 h-4 mr-2" />
          Records
        </TabsTrigger>
        <TabsTrigger value="new">
          <Plus className="w-4 h-4 mr-2" />
          New Inspection
        </TabsTrigger>
        <TabsTrigger value="stats">
          <BarChart3 className="w-4 h-4 mr-2" />
          Statistics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="records">
        <InspectionsTable />
      </TabsContent>
      <TabsContent value="new">
        <InspectionForm />
      </TabsContent>
      <TabsContent value="stats">
        <InspectionStats />
      </TabsContent>
    </Tabs>
  )
}
