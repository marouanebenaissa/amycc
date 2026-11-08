'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProIcon } from './ProIcon'

interface IconWithFallbackProps {
  src?: string
  fallbackEmoji: string
  alt: string
  className?: string
  size?: number
}

export function IconWithFallback({
  src,
  fallbackEmoji,
  alt,
  className = '',
  size = 32,
}: IconWithFallbackProps) {
  const [hasError, setHasError] = useState(false)

  // Auto-resolve SVG version if PNG was referenced
  const resolvedSrc = src && src.endsWith('.png') ? src.replace(/\.png$/, '.svg') : src

  if (resolvedSrc && !hasError) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain transition-transform ${className}`}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <ProIcon
      icon={fallbackEmoji}
      size={size}
      className={`inline-block shrink-0 ${className}`}
      aria-label={alt}
    />
  )
}
