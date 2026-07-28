'use client'

import { useMemo } from 'react'
import { FileText, Upload, AlertTriangle, FileCheck2 } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { documents } from '@/data'
import { formatNumber, isExpiringSoon } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations'
import { motion } from 'framer-motion'

export function DocumentStats() {
  const stats = useMemo(() => {
    const total = documents.length

    const byCategory = documents.reduce<Record<string, number>>((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1
      return acc
    }, {})

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentUploads = documents.filter(
      (d) => new Date(d.uploadedAt) >= sevenDaysAgo,
    ).length

    const expiring = documents.filter(
      (d) => d.expiresAt && isExpiringSoon(d.expiresAt, 30),
    ).length

    return { total, byCategory, recentUploads, expiring }
  }, [])

  const cards = [
    {
      icon: <FileText />,
      label: 'Total Documents',
      value: formatNumber(stats.total),
    },
    {
      icon: <FileCheck2 />,
      label: 'By Category',
      value: Object.entries(stats.byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, count]) => `${cat}: ${count}`)
        .join(', '),
    },
    {
      icon: <Upload />,
      label: 'Recent Uploads',
      value: `${stats.recentUploads} this week`,
      trend: 'up' as const,
      trendValue: 'last 7 days',
    },
    {
      icon: <AlertTriangle />,
      label: 'Expiring Documents',
      value: formatNumber(stats.expiring),
      trend: stats.expiring > 0 ? 'up' as const : undefined,
      trendValue: stats.expiring > 0 ? 'needs attention' : undefined,
    },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, idx) => (
        <motion.div key={idx} variants={staggerItem}>
          <StatCard
            icon={card.icon}
            label={card.label}
            value={card.value}
            trend={card.trend}
            trendValue={card.trendValue}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
