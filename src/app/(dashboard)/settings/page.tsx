import { Metadata } from 'next'
import { SettingsContent } from './settings-wrapper'

export const metadata: Metadata = {
  title: 'Settings - FleetFlow',
}

export default function SettingsPage() {
  return <SettingsContent />
}
