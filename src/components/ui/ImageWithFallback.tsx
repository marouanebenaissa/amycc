'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  // Adjust state during render when prop changes (recommended React pattern)
  if (src !== prevSrc) {
    setPrevSrc(src)
    setFailed(false)
  }

  const effectiveSrc = failed && fallbackSrc ? fallbackSrc : src
  const isUpload = typeof effectiveSrc === 'string' && effectiveSrc.startsWith('/uploads/')
  const isExternal = typeof effectiveSrc === 'string' && (effectiveSrc.startsWith('http://') || effectiveSrc.startsWith('https://'))
  const isKnownDomain = typeof effectiveSrc === 'string' && (
    effectiveSrc.includes('images.unsplash.com') ||
    effectiveSrc.includes('.supabase.co') ||
    effectiveSrc.includes('placehold.co')
  )
  const shouldUnoptimize = props.unoptimized ?? (isUpload || (isExternal && !isKnownDomain))

  return (
    <Image
      {...props}
      src={effectiveSrc}
      alt={alt}
      unoptimized={shouldUnoptimize}
      onError={() => {
        if (!failed && fallbackSrc) {
          setFailed(true)
        }
      }}
    />
  )
}
