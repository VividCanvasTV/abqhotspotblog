const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('Creating admin user...')
    
    // Get input from environment or use defaults
    const email = process.env.ADMIN_EMAIL || 'admin@abqhotspot.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin User'
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ User with this email already exists!')
    } else {
      console.error('❌ Error creating admin user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 