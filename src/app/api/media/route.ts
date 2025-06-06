import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { stat, mkdir } from 'fs/promises'

// GET /api/media - Get all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const mediaFiles = await prisma.media.findMany({
      where,
      orderBy: { uploadedAt: 'desc' }
    })

    // Transform data to match frontend expectations
    const transformedFiles = mediaFiles.map(file => ({
      id: file.id,
      name: file.originalName,
      type: getFileType(file.mimeType),
      size: formatFileSize(file.size),
      url: file.url,
      uploadedAt: file.uploadedAt.toISOString(),
      dimensions: getImageDimensions(file.mimeType) // Mock dimensions for now
    }))

    // Filter by type if specified
    const filteredFiles = type && type !== 'all' 
      ? transformedFiles.filter(file => file.type === type)
      : transformedFiles

    return NextResponse.json(filteredFiles)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}

// POST /api/media - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    try {
      await stat(uploadDir)
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        await mkdir(uploadDir, { recursive: true })
      } else {
        console.error('Error creating upload directory:', e)
        return NextResponse.json({ error: 'Could not create upload directory' }, { status: 500 })
      }
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, '_')}`
    const filepath = join(uploadDir, filename)
    const fileUrl = `/uploads/${filename}`

    await writeFile(filepath, buffer)

    const newMedia = await prisma.media.create({
      data: {
        filename: filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: fileUrl,
      },
    })
    
    // Transform data to match frontend expectations
    const transformedFile = {
      id: newMedia.id,
      name: newMedia.originalName,
      type: getFileType(newMedia.mimeType),
      size: formatFileSize(newMedia.size),
      url: newMedia.url,
      uploadedAt: newMedia.uploadedAt.toISOString(),
      dimensions: getImageDimensions(newMedia.mimeType) // Mock dimensions for now
    }

    return NextResponse.json(transformedFile, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media file' },
      { status: 500 }
    )
  }
}

// Helper functions
function getFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
  return 'other'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getImageDimensions(mimeType: string): string | null {
  // Mock dimensions for now - in a real app you'd store actual dimensions
  if (mimeType.startsWith('image/')) {
    const mockDimensions = ['1920x1080', '1200x630', '800x600', '1024x768']
    return mockDimensions[Math.floor(Math.random() * mockDimensions.length)]
  }
  return null
} 