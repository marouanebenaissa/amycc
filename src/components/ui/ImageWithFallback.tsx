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
  const [imgSrc, setImgSrc] = useState(src)
  const [failed, setFailed] = useState(false)

  const isExternal = typeof imgSrc === 'string' && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://'))
  const isKnownDomain = typeof imgSrc === 'string' && (
    imgSrc.includes('images.unsplash.com') ||
    imgSrc.includes('.supabase.co') ||
    imgSrc.includes('placehold.co')
  )
  const shouldUnoptimize = props.unoptimized ?? (isExternal && !isKnownDomain)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized={shouldUnoptimize}
      onError={() => {
        if (!failed && fallbackSrc && imgSrc !== fallbackSrc) {
          setFailed(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
