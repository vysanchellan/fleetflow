import { Metadata } from 'next'
import { ProfileContent } from './profile-wrapper'

export const metadata: Metadata = {
  title: 'Profile - FleetFlow',
}

export default function ProfilePage() {
  return <ProfileContent />
}
