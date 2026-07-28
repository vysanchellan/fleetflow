'use client'

import dynamic from 'next/dynamic'

const DocumentsView = dynamic(() => import('./documents-view').then(m => ({ default: m.DocumentsView })), { ssr: false })

export function DocumentsContent() {
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
