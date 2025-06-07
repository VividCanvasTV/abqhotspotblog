import { NextResponse } from 'next/server'
import { seed } from '@/lib/seed'

export async function POST() {
  try {
    console.log('🌱 Starting database seed...')
    await seed()
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully!' 
    })
  } catch (error) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 