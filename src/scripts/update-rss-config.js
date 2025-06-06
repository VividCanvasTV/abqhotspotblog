const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
    }
  }
})

async function updateRSSConfig() {
  try {
    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@abqhotspot.com'
      }
    })

    if (!adminUser) {
      console.error('❌ Admin user not found. Please make sure the admin user exists.')
      console.log('💡 You can create an admin user by running the seed script first.')
      return
    }

    console.log('✅ Found admin user:', adminUser.email)
    console.log('📋 Admin User ID:', adminUser.id)
    console.log('')
    console.log('🔧 To configure RSS imports, update the following in src/lib/rss-importer.ts:')
    console.log(`   Replace 'your-admin-user-id' with: '${adminUser.id}'`)
    console.log('')
    console.log('📡 Your RSS feed is available at: /api/rss')
    console.log('🎛️  RSS management interface: /admin/rss')

  } catch (error) {
    console.error('Error updating RSS config:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateRSSConfig() 