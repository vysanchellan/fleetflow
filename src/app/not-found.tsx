'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-48 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xl font-bold text-neutral-100">FleetFlow</span>
        </div>

        <h1 className="text-8xl font-bold text-neutral-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-200 mb-2">
          Page not found
        </h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}
