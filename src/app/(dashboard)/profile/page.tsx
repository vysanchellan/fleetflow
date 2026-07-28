import { Metadata } from 'next'
import { ProfileForm } from '@/features/settings/profile-form'

export const metadata: Metadata = {
  title: 'Profile - FleetFlow',
}

export default function ProfilePage() {
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
