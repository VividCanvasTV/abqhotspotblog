import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Debug auth attempt for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({ 
        success: false, 
        error: 'User not found',
        debug: { email, userExists: false }
      }, { status: 401 })
    }
    
    console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password })
    
    if (!user.password) {
      console.log('User has no password')
      return NextResponse.json({ 
        success: false, 
        error: 'User has no password',
        debug: { email, userExists: true, hasPassword: false }
      }, { status: 401 })
    }
    
    // Test password
    const isPasswordValid = await compare(password, user.password)
    console.log('Password comparison result:', isPasswordValid)
    
    return NextResponse.json({ 
      success: true, 
      passwordValid: isPasswordValid,
      debug: { 
        email, 
        userExists: true, 
        hasPassword: true,
        passwordLength: user.password?.length || 0,
        passwordStartsWith: user.password?.substring(0, 7) || 'none'
      }
    })
    
  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      debug: { error: error instanceof Error ? error.message : 'Unknown error' }
    }, { status: 500 })
  }
} 