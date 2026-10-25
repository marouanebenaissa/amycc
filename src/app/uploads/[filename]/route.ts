import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  props: { params: Promise<{ filename: string }> }
) {
  const { filename } = await props.params

  // Sanitize filename to prevent path traversal
  const safeFilename = path.basename(filename)
  const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename)

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await fs.promises.readFile(filePath)
    const ext = safeFilename.split('.').pop()?.toLowerCase() || 'jpeg'

    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      avif: 'image/avif',
      svg: 'image/svg+xml',
    }

    const contentType = mimeTypes[ext] || 'application/octet-stream'

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Error reading file', { status: 500 })
  }
}
