import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional().transform(val => val === '' ? undefined : val),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  publishedAt: z.string().optional().transform(val => val === '' ? undefined : val),
  featuredImage: z.string().optional().transform(val => val === '' ? undefined : val),
  seoTitle: z.string().optional().transform(val => val === '' ? undefined : val),
  seoDescription: z.string().optional().transform(val => val === '' ? undefined : val),
  authorId: z.string(),
  categoryId: z.string().optional().transform(val => val === '' ? undefined : val),
  tags: z.array(z.string()).optional(),
})

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (status) where.status = status
    if (featured) where.featured = featured === 'true'

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = createPostSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Handle publishedAt
    const publishedAt = validatedData.publishedAt 
      ? new Date(validatedData.publishedAt)
      : validatedData.status === 'PUBLISHED' 
        ? new Date() 
        : null

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        featured: validatedData.featured,
        status: validatedData.status,
        publishedAt,
        featuredImage: validatedData.featuredImage,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
        authorId: validatedData.authorId,
        categoryId: validatedData.categoryId,
        tags: validatedData.tags && validatedData.tags.length > 0 ? {
          connectOrCreate: validatedData.tags.map(tagName => ({
            where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-')
            }
          }))
        } : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 