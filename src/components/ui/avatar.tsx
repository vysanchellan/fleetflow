'use client'

import { useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusSizeStyles = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
}

type StatusType = 'online' | 'offline' | 'away' | 'busy'

const statusColors: Record<StatusType, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-neutral-500',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
}

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  name?: string
  size?: keyof typeof sizeStyles
  status?: StatusType
  className?: string
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showInitials = !src || imgError

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-neutral-800 overflow-hidden',
          sizeStyles[size],
        )}
        aria-label={alt || name || 'Avatar'}
      >
        {!showInitials ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
            {...props}
          />
        ) : (
          <span className="font-medium text-neutral-400 select-none">
            {getInitials(name)}
          </span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-neutral-950',
            statusSizeStyles[size],
            statusColors[status],
          )}
          aria-label={status}
        />
      )}
    </div>
  )
}
