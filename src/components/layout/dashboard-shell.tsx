'use client'

import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { useSidebar } from './sidebar-context'
import { pageTransition } from '@/animations'

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 antialiased">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <div className={cn('p-6', isMobile ? 'p-4' : 'p-6 lg:p-8')}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                variants={pageTransition}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
