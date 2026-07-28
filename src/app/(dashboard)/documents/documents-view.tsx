'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DocumentGrid } from '@/features/documents/document-grid'
import { DocumentUpload } from '@/features/documents/document-upload'
import { DocumentStats } from '@/features/documents/document-stats'
import { Grid3X3, Upload, BarChart3 } from 'lucide-react'

export function DocumentsView() {
  const [view, setView] = useState('grid')

  return (
    <Tabs value={view} onValueChange={setView}>
      <TabsList className="mb-6">
        <TabsTrigger value="grid">
          <Grid3X3 className="w-4 h-4 mr-2" />
          All Documents
        </TabsTrigger>
        <TabsTrigger value="upload">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="stats">
          <BarChart3 className="w-4 h-4 mr-2" />
          Statistics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="grid">
        <DocumentGrid />
      </TabsContent>
      <TabsContent value="upload">
        <DocumentUpload />
      </TabsContent>
      <TabsContent value="stats">
        <DocumentStats />
      </TabsContent>
    </Tabs>
  )
}