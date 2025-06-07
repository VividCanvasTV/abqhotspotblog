import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST() {
  try {
    // Hash the password properly
    const hashedPassword = await hash('admin123', 12)
    
    console.log('Updating admin password...')
    console.log('New hash length:', hashedPassword.length)
    console.log('Hash starts with:', hashedPassword.substring(0, 10))
    
    // Update the admin user with properly hashed password
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@abqhotspot.news' },
      data: { password: hashedPassword }
    })
    
    console.log('Admin password updated successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin password updated with proper hash',
      debug: {
        userId: updatedUser.id,
        email: updatedUser.email,
        passwordHashLength: hashedPassword.length,
        passwordHashStart: hashedPassword.substring(0, 10)
      }
    })
    
  } catch (error) {
    console.error('Error updating admin password:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update password',
      debug: { error: error instanceof Error ? error.message : 'Unknown error' }
    }, { status: 500 })
  }
} 