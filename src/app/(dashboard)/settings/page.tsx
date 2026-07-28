import { Metadata } from 'next'
import { SettingsForm } from '@/features/settings/settings-form'

export const metadata: Metadata = {
  title: 'Settings - FleetFlow',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your workspace settings
        </p>
      </div>
      <SettingsForm />
    </div>
  )
}
