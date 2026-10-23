'use client'

import { useState } from 'react'
import Image from 'next/image'

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

  if (src && !hasError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain transition-transform ${className}`}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <span className={`inline-flex items-center justify-center select-none ${className}`} aria-hidden="true">
      {fallbackEmoji}
    </span>
  )
}
