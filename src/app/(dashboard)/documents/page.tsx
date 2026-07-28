import { Metadata } from 'next'
import { DocumentsContent } from './documents-wrapper'

export const metadata: Metadata = {
  title: 'Documents - FleetFlow',
}

export default function DocumentsPage() {
  return <DocumentsContent />
}