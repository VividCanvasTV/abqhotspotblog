import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(1),
  category: z.string().min(1),
  price: z.string().optional(),
  image: z.string().optional(),
  organizer: z.string().optional(),
  capacity: z.number().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const upcoming = searchParams.get('upcoming') === 'true'

    const where: any = {}
    
    if (featured) {
      where.featured = true
    }
    
    if (category && category !== 'all') {
      where.category = category
    }

    if (upcoming) {
      const today = new Date().toISOString().split('T')[0]
      where.startDate = {
        gte: today
      }
    }

    const events = await prisma.event.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { startDate: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Parse JSON strings back to arrays
    const eventsWithParsedFields = events.map(event => ({
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
    }))

    return NextResponse.json({
      events: eventsWithParsedFields,
      total: events.length
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has permission
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    // Convert arrays to JSON strings for storage
    const eventData = {
      ...validatedData,
      tags: JSON.stringify(validatedData.tags),
    }

    const event = await prisma.event.create({
      data: eventData
    })

    // Parse JSON strings back to arrays for response
    const eventWithParsedFields = {
      ...event,
      tags: JSON.parse(event.tags),
    }

    return NextResponse.json(eventWithParsedFields, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
} 