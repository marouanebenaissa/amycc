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

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!failed && fallbackSrc && imgSrc !== fallbackSrc) {
          setFailed(true)
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
