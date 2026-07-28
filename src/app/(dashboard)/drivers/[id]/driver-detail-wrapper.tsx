'use client'

import dynamic from 'next/dynamic'
import type { Driver } from '@/types'

const DriverDetail = dynamic(() => import('@/features/drivers/driver-detail').then(m => ({ default: m.DriverDetail })), { ssr: false })
const DriverPerformance = dynamic(() => import('@/features/drivers/driver-performance').then(m => ({ default: m.DriverPerformance })), { ssr: false })

export function DriverDetailContent({ driver }: { driver: Driver }) {
  return (
    <div className="space-y-6">
      <DriverDetail driver={driver} />
      <DriverPerformance driver={driver} />
    </div>
  )
}
