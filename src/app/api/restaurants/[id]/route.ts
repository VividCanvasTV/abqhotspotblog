import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const updateRestaurantSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  cuisine: z.string().min(1).optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().optional(),
  hours: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  delivery: z.boolean().optional(),
  takeout: z.boolean().optional(),
  dineIn: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
})

// GET /api/restaurants/[id] - Get a single restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const restaurant = await prisma.restaurant.findUnique({
      where: { id }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Parse JSON strings back to arrays
    const restaurantWithParsedFields = {
      ...restaurant,
      tags: restaurant.tags ? JSON.parse(restaurant.tags) : [],
      specialties: restaurant.specialties ? JSON.parse(restaurant.specialties) : [],
    }

    return NextResponse.json(restaurantWithParsedFields)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}

// PUT /api/restaurants/[id] - Update a restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    // Check permissions
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
    const validatedData = updateRestaurantSchema.parse(body)

    // Check if restaurant exists
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id }
    })

    if (!existingRestaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Convert arrays to JSON strings for storage
    const updateData: any = { ...validatedData }
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags)
    }
    if (updateData.specialties) {
      updateData.specialties = JSON.stringify(updateData.specialties)
    }
    if (updateData.website === '') {
      updateData.website = null
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData
    })

    // Parse JSON strings back to arrays for response
    const restaurantWithParsedFields = {
      ...restaurant,
      tags: restaurant.tags ? JSON.parse(restaurant.tags) : [],
      specialties: restaurant.specialties ? JSON.parse(restaurant.specialties) : [],
    }

    return NextResponse.json(restaurantWithParsedFields)
  } catch (error) {
    console.error('Error updating restaurant:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}

// DELETE /api/restaurants/[id] - Delete a restaurant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    // Check permissions - only admins can delete restaurants
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can delete restaurants' },
        { status: 403 }
      )
    }

    // Check if restaurant exists
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id }
    })

    if (!existingRestaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    await prisma.restaurant.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Restaurant deleted successfully' })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
} 