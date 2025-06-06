import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional().transform(val => val === '' ? undefined : val),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  publishedAt: z.string().optional().transform(val => val === '' ? undefined : val),
  featuredImage: z.string().optional().transform(val => val === '' ? undefined : val),
  seoTitle: z.string().optional().transform(val => val === '' ? undefined : val),
  seoDescription: z.string().optional().transform(val => val === '' ? undefined : val),
  categoryId: z.string().optional().transform(val => val === '' ? undefined : val),
  tags: z.array(z.string()).optional(),
})

// Helper function to check permissions
async function checkPostPermissions(postId: string, session: any) {
  if (!session?.user?.id) {
    return { hasPermission: false, error: 'Unauthorized' }
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  })

  if (!post) {
    return { hasPermission: false, error: 'Post not found' }
  }

  const userRole = session.user.role
  const isAuthor = post.authorId === session.user.id
  const canEdit = userRole === 'ADMIN' || userRole === 'EDITOR' || isAuthor

  return { 
    hasPermission: canEdit, 
    error: canEdit ? null : 'Insufficient permissions',
    post 
  }
}

// Helper function to check publishing permissions
function canPublish(userRole: string, isAuthor: boolean) {
  // Only ADMINs and EDITORs can publish directly
  // AUTHORs can only save as draft
  return userRole === 'ADMIN' || userRole === 'EDITOR'
}

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Check permissions
    const { hasPermission, error } = await checkPostPermissions(id, session)
    if (!hasPermission) {
      return NextResponse.json(
        { error },
        { status: error === 'Unauthorized' ? 401 : 403 }
      )
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check publishing permissions
    const userRole = session?.user?.role
    const isAuthor = existingPost.authorId === session?.user?.id
    
    if (validatedData.status === 'PUBLISHED' && !canPublish(userRole || '', isAuthor)) {
      // Authors can't publish directly - force to draft
      validatedData.status = 'DRAFT'
      
      // Note: In a real app, you might want to set a "pending approval" status
      // and notify editors/admins of the submission
    }

    // Generate new slug if title is being updated
    const slug = validatedData.title
      ? validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : undefined

    // Handle publishedAt
    let publishedAt = undefined
    if (validatedData.publishedAt) {
      publishedAt = new Date(validatedData.publishedAt)
    } else if (validatedData.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      publishedAt = new Date()
    }

    const updateData: any = {
      ...validatedData,
      slug,
      publishedAt,
    }

    // Handle tags update
    if (validatedData.tags) {
      updateData.tags = {
        set: [], // Clear existing tags
        connectOrCreate: validatedData.tags.map(tagName => ({
          where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
          create: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }
        }))
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    // Check permissions
    const { hasPermission, error } = await checkPostPermissions(id, session)
    if (!hasPermission) {
      return NextResponse.json(
        { error },
        { status: error === 'Unauthorized' ? 401 : 403 }
      )
    }

    // Additional check: Only ADMINs and EDITORs can delete posts
    // AUTHORs can only delete their own drafts
    const userRole = session?.user?.role
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, status: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const isAuthor = existingPost.authorId === session?.user?.id
    
    if (userRole === 'AUTHOR' && (!isAuthor || existingPost.status === 'PUBLISHED')) {
      return NextResponse.json(
        { error: 'Authors can only delete their own draft posts' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 