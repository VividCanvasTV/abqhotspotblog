import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test basic database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`
    
    // Try to count restaurants
    const restaurantCount = await prisma.restaurant.count()
    
    // Check if Restaurant table exists by trying to describe it
    const tableInfo = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'restaurants'
    `
    
    return NextResponse.json({
      success: true,
      dbConnection: 'OK',
      dbTest,
      restaurantCount,
      tableExists: Array.isArray(tableInfo) && tableInfo.length > 0,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      databaseProvider: process.env.DATABASE_URL?.startsWith('postgres') ? 'PostgreSQL' : 'Other'
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      databaseProvider: process.env.DATABASE_URL?.startsWith('postgres') ? 'PostgreSQL' : 'Other'
    }, { status: 500 })
  }
} 