'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ReportCharts } from '@/features/reports/report-charts'
import { ReportExport } from '@/features/reports/report-export'
import { BarChart3, Download } from 'lucide-react'

export function ReportsView() {
  const [view, setView] = useState('analytics')

  return (
    <Tabs value={view} onValueChange={setView}>
      <TabsList className="mb-6">
        <TabsTrigger value="analytics">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="exports">
          <Download className="w-4 h-4 mr-2" />
          Export Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value="analytics">
        <ReportCharts />
      </TabsContent>
      <TabsContent value="exports">
        <ReportExport />
      </TabsContent>
    </Tabs>
  )
}
