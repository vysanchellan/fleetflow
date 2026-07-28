'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let toastCounter = 0

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toasts: [],
      addToast: (_toast: Omit<Toast, 'id'>) => {},
      removeToast: (_id: string) => {},
    } as ToastContextType
  }
  return ctx
}

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
  info: <Info className="h-5 w-5 text-blue-400" />,
}

const borderMap: Record<ToastType, string> = {
  success: 'border-emerald-500/25',
  error: 'border-red-500/25',
  warning: 'border-amber-500/25',
  info: 'border-blue-500/25',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${++toastCounter}`
      const newToast: Toast = { ...toast, id }
      setToasts((prev) => [...prev, newToast])
      setTimeout(() => {
        removeToast(id)
      }, toast.duration ?? 4000)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastViewportProps {
  toasts: Toast[]
  removeToast: (id: string) => void
}

function ToastViewport({ toasts, removeToast }: ToastViewportProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'pointer-events-auto rounded-xl border bg-neutral-900 shadow-lg shadow-neutral-900/50 p-4',
              borderMap[toast.type],
            )}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">{iconMap[toast.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-100">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 rounded text-neutral-500 hover:text-neutral-100 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  type?: ToastType
  title: string
  description?: string
}

export function Toast({
  type = 'info',
  title,
  description,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-neutral-900 p-4',
        borderMap[type],
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{iconMap[type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-100">{title}</p>
          {description && (
            <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
