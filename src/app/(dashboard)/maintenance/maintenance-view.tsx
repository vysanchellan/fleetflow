'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MaintenanceTable } from '@/features/maintenance/maintenance-table'
import { MaintenanceKanban } from '@/features/maintenance/maintenance-kanban'
import { MaintenanceCalendar } from '@/features/maintenance/maintenance-calendar'
import { Table, Columns, CalendarDays } from 'lucide-react'

export function MaintenanceView() {
  const [view, setView] = useState('table')

  return (
    <Tabs value={view} onValueChange={setView}>
      <TabsList className="mb-6">
        <TabsTrigger value="table">
          <Table className="w-4 h-4 mr-2" />
          Table
        </TabsTrigger>
        <TabsTrigger value="kanban">
          <Columns className="w-4 h-4 mr-2" />
          Kanban
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarDays className="w-4 h-4 mr-2" />
          Calendar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <MaintenanceTable />
      </TabsContent>
      <TabsContent value="kanban">
        <MaintenanceKanban />
      </TabsContent>
      <TabsContent value="calendar">
        <MaintenanceCalendar />
      </TabsContent>
    </Tabs>
  )
}
