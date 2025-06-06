import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// GET /api/restaurants/[id]/reviews - Get restaurant reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    // Get all reviews for the restaurant
    const reviews = await prisma.restaurantReview.findMany({
      where: {
        restaurantId: id
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get user's review if authenticated
    let userReview = null
    if (session?.user) {
      userReview = await prisma.restaurantReview.findUnique({
        where: {
          userId_restaurantId: {
            userId: session.user.id,
            restaurantId: id,
          }
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
    }

    // Filter out user's review from general reviews to avoid duplication
    const otherReviews = reviews.filter(review => 
      !userReview || review.id !== userReview.id
    )

    return NextResponse.json({
      reviews: otherReviews,
      userReview
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/restaurants/[id]/reviews - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Check if user already has a review
    const existingReview = await prisma.restaurantReview.findUnique({
      where: {
        userId_restaurantId: {
          userId: session.user.id,
          restaurantId: id,
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this restaurant' },
        { status: 400 }
      )
    }

    // Create review and update restaurant rating
    await prisma.$transaction(async (tx) => {
      // Create the review
      await tx.restaurantReview.create({
        data: {
          userId: session.user.id,
          restaurantId: id,
          rating: validatedData.rating,
          comment: validatedData.comment,
        }
      })

      // Recalculate restaurant rating
      const reviews = await tx.restaurantReview.findMany({
        where: { restaurantId: id }
      })

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await tx.restaurant.update({
        where: { id },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: reviews.length
        }
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// PUT /api/restaurants/[id]/reviews - Update existing review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if user's review exists
    const existingReview = await prisma.restaurantReview.findUnique({
      where: {
        userId_restaurantId: {
          userId: session.user.id,
          restaurantId: id,
        }
      }
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Update review and recalculate restaurant rating
    await prisma.$transaction(async (tx) => {
      // Update the review
      await tx.restaurantReview.update({
        where: {
          userId_restaurantId: {
            userId: session.user.id,
            restaurantId: id,
          }
        },
        data: {
          rating: validatedData.rating,
          comment: validatedData.comment,
          updatedAt: new Date(),
        }
      })

      // Recalculate restaurant rating
      const reviews = await tx.restaurantReview.findMany({
        where: { restaurantId: id }
      })

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await tx.restaurant.update({
        where: { id },
        data: {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviewCount: reviews.length
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
} 