import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']).default('AUTHOR'),
})

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (role && role !== 'all') {
      // Convert lowercase to uppercase for enum
      const roleMap: any = {
        'admin': 'ADMIN',
        'editor': 'EDITOR', 
        'author': 'AUTHOR'
      }
      where.role = roleMap[role] || 'AUTHOR'
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get post counts separately
    const userIds = users.map(user => user.id)
    const postCounts = await prisma.post.groupBy({
      by: ['authorId'],
      where: {
        authorId: { in: userIds }
      },
      _count: { authorId: true }
    })

    // Transform data to match the frontend expectations
    const transformedUsers = users.map(user => {
      const postCount = postCounts.find(pc => pc.authorId === user.id)?._count.authorId || 0
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        status: 'active', // Default to active since we don't have a status field
        avatar: user.avatar,
        lastLogin: user.updatedAt.toISOString(),
        createdAt: user.createdAt.toISOString(),
        postsCount: postCount
      }
    })

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform data to match frontend expectations
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      status: 'active',
      avatar: user.avatar,
      lastLogin: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
      postsCount: 0
    }

    return NextResponse.json(transformedUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 