import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Debug Homepage: Starting database queries...')
    
    // Test the exact same query as homepage
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
    
    const featuredRestaurants = await prisma.restaurant.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
    
    // Test basic queries
    const allPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      take: 3
    })
    
    const allRestaurants = await prisma.restaurant.findMany({
      take: 3
    })
    
    return NextResponse.json({
      success: true,
      debug: {
        featuredPosts: {
          count: featuredPosts.length,
          posts: featuredPosts.map(p => ({ 
            id: p.id, 
            title: p.title, 
            featured: p.featured, 
            status: p.status 
          }))
        },
        featuredRestaurants: {
          count: featuredRestaurants.length,
          restaurants: featuredRestaurants.map(r => ({ 
            id: r.id, 
            name: r.name, 
            featured: r.featured 
          }))
        },
        allPosts: {
          count: allPosts.length,
          posts: allPosts.map(p => ({ 
            id: p.id, 
            title: p.title, 
            featured: p.featured, 
            status: p.status 
          }))
        },
        allRestaurants: {
          count: allRestaurants.length,
          restaurants: allRestaurants.map(r => ({ 
            id: r.id, 
            name: r.name, 
            featured: r.featured 
          }))
        }
      }
    })
  } catch (error) {
    console.error('❌ Debug Homepage: Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 