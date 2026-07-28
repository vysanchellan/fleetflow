'use client'

import { ThemeProvider } from './theme-provider'
import { SidebarProvider } from './sidebar-context'
import { ToastProvider } from '@/components/ui/toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
