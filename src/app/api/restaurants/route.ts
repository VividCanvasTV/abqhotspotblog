import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const createRestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  cuisine: z.string().min(1),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']),
  address: z.string().min(1),
  phone: z.string().optional(),
  hours: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  delivery: z.boolean().default(false),
  takeout: z.boolean().default(false),
  dineIn: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
})

// GET /api/restaurants - Get all restaurants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const featured = searchParams.get('featured') === 'true'
    const cuisine = searchParams.get('cuisine')
    const priceRange = searchParams.get('priceRange')

    const where: any = {}
    
    if (featured) {
      where.featured = true
    }
    
    if (cuisine && cuisine !== 'all') {
      where.cuisine = cuisine
    }
    
    if (priceRange && priceRange !== 'all') {
      where.priceRange = priceRange
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Parse JSON strings back to arrays
    const restaurantsWithParsedFields = restaurants.map(restaurant => ({
      ...restaurant,
      tags: restaurant.tags ? JSON.parse(restaurant.tags) : [],
      specialties: restaurant.specialties ? JSON.parse(restaurant.specialties) : [],
    }))

    return NextResponse.json({
      restaurants: restaurantsWithParsedFields,
      total: restaurants.length
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants - Create a new restaurant
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
    const validatedData = createRestaurantSchema.parse(body)

    // Convert arrays to JSON strings for storage
    const restaurantData = {
      ...validatedData,
      website: validatedData.website || undefined,
      tags: JSON.stringify(validatedData.tags),
      specialties: JSON.stringify(validatedData.specialties),
    }

    const restaurant = await prisma.restaurant.create({
      data: restaurantData
    })

    // Parse JSON strings back to arrays for response
    const restaurantWithParsedFields = {
      ...restaurant,
      tags: JSON.parse(restaurant.tags),
      specialties: JSON.parse(restaurant.specialties),
    }

    return NextResponse.json(restaurantWithParsedFields, { status: 201 })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
} 