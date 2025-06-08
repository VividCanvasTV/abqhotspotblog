import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Debug Homepage - Fetching data...')

    // Test each data source that the homepage uses
    const featuredPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    })

    const recentPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    })

    const featuredRestaurants = await prisma.restaurant.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })

    const allPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, status: true, featured: true }
    })

    const allRestaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, featured: true }
    })

    return NextResponse.json({
      success: true,
      debug: {
        featuredPosts: {
          count: featuredPosts.length,
          data: featuredPosts.map(p => ({
            id: p.id,
            title: p.title,
            featured: p.featured,
            status: p.status,
            publishedAt: p.publishedAt,
            category: p.category?.name
          }))
        },
        recentPosts: {
          count: recentPosts.length,
          data: recentPosts.map(p => ({
            id: p.id,
            title: p.title,
            status: p.status,
            publishedAt: p.publishedAt
          }))
        },
        featuredRestaurants: {
          count: featuredRestaurants.length,
          data: featuredRestaurants.map(r => ({
            id: r.id,
            name: r.name,
            featured: r.featured,
            cuisine: r.cuisine
          }))
        },
        summary: {
          totalPublishedPosts: allPosts.length,
          featuredPostsCount: allPosts.filter(p => p.featured).length,
          totalRestaurants: allRestaurants.length,
          featuredRestaurantsCount: allRestaurants.filter(r => r.featured).length
        }
      }
    })

  } catch (error) {
    console.error('Debug homepage error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: null
    }, { status: 500 })
  }
} 