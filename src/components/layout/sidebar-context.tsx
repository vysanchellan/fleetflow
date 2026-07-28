'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useMediaQuery } from '@/hooks'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMobile: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isOpen, setIsOpen] = useState(!isMobile)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextType {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    return { isOpen: true, setIsOpen: () => {}, isMobile: false, toggle: () => {} }
  }
  return ctx
}
