'use client'

import dynamic from 'next/dynamic'

const ProfileForm = dynamic(() => import('@/features/settings/profile-form').then(m => ({ default: m.ProfileForm })), { ssr: false })

export function ProfileContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">Profile</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your personal information
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
