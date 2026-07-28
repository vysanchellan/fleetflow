import { Metadata } from 'next'
import { DocumentsView } from './documents-view'

export const metadata: Metadata = {
  title: 'Documents - FleetFlow',
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Documents</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage fleet documents and records
        </p>
      </div>
      <DocumentsView />
    </div>
  )
}