'use client'

import dynamic from 'next/dynamic'

const SettingsForm = dynamic(() => import('@/features/settings/settings-form').then(m => ({ default: m.SettingsForm })), { ssr: false })

export function SettingsContent() {
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
