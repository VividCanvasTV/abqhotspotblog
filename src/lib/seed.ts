import { prisma } from './db'

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Create default admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@abqhotspot.news' },
      update: {},
      create: {
        email: 'admin@abqhotspot.news',
        name: 'Admin User',
        role: 'ADMIN',
      },
    })

    console.log('✅ Created admin user:', adminUser.email)

    // Create categories
    const newsCategory = await prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        description: 'Latest news from Albuquerque',
        color: '#EF4444',
      },
    })

    const eventsCategory = await prisma.category.upsert({
      where: { slug: 'events' },
      update: {},
      create: {
        name: 'Events',
        slug: 'events',
        description: 'Upcoming events in ABQ',
        color: '#F59E0B',
      },
    })

    const foodCategory = await prisma.category.upsert({
      where: { slug: 'food' },
      update: {},
      create: {
        name: 'Food & Dining',
        slug: 'food',
        description: 'Restaurant reviews and food news',
        color: '#10B981',
      },
    })

    console.log('✅ Created categories')

    // Create tags
    const tags = [
      { name: 'Breaking News', slug: 'breaking-news' },
      { name: 'Local Business', slug: 'local-business' },
      { name: 'Community', slug: 'community' },
      { name: 'Arts & Culture', slug: 'arts-culture' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Weather', slug: 'weather' },
    ]

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    }

    console.log('✅ Created tags')

    // Create sample posts
    const samplePosts = [
      {
        title: 'Welcome to ABQ Hotspot News',
        slug: 'welcome-to-abq-hotspot-news',
        content: `# Welcome to ABQ Hotspot News!

We're excited to launch Albuquerque's newest source for local news, events, and community stories.

## What You'll Find Here

- **Breaking News**: Stay updated with the latest happenings in our city
- **Local Events**: Discover what's happening around town
- **Food & Dining**: Reviews of the best restaurants and eateries
- **Community Stories**: Highlighting the people who make ABQ special

## Our Mission

Our mission is to keep the Albuquerque community informed, connected, and engaged. We believe in the power of local journalism to bring people together and strengthen our neighborhoods.

Stay tuned for more exciting content coming your way!`,
        excerpt: 'Welcome to ABQ Hotspot News - your new source for local Albuquerque news, events, and community stories.',
        featured: true,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(),
        featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        seoTitle: 'Welcome to ABQ Hotspot News - Albuquerque Local News',
        seoDescription: 'Discover ABQ Hotspot News, your premier source for Albuquerque local news, events, food reviews, and community stories.',
        authorId: adminUser.id,
        categoryId: newsCategory.id,
      },
      {
        title: 'Top 10 Green Chile Restaurants in Albuquerque',
        slug: 'top-10-green-chile-restaurants-albuquerque',
        content: `# Top 10 Green Chile Restaurants in Albuquerque

Green chile is the heart and soul of New Mexican cuisine, and Albuquerque has some of the best green chile dishes in the world. Here are our top 10 picks:

## 1. Sadie's of New Mexico
Known for their legendary sopapillas and authentic New Mexican dishes.

## 2. El Pinto Restaurant
A local institution serving traditional New Mexican cuisine since 1962.

## 3. Frontier Restaurant
Famous for their green chile cheeseburgers and sweet rolls.

## 4. Los Cuates
Family-owned restaurant with amazing green chile enchiladas.

## 5. Garcia's Kitchen
Multiple locations serving consistent, delicious New Mexican food.

## 6. Monroe's Restaurant
Home of the original green chile cheeseburger.

## 7. Cocina Azul
Upscale New Mexican cuisine with a modern twist.

## 8. Duran Central Pharmacy
Historic pharmacy with a lunch counter serving amazing green chile.

## 9. Golden Pride
Local chain known for their green chile breakfast burritos.

## 10. Twisters
Fast-casual spot with great green chile burgers and burritos.

Each of these restaurants brings something special to the table. What's your favorite green chile spot in ABQ?`,
        excerpt: 'Discover the best green chile restaurants in Albuquerque, from traditional family spots to modern interpretations of New Mexican cuisine.',
        featured: true,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        featuredImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
        seoTitle: 'Top 10 Green Chile Restaurants in Albuquerque - ABQ Food Guide',
        seoDescription: 'Discover the best green chile restaurants in Albuquerque with our comprehensive guide to authentic New Mexican cuisine.',
        authorId: adminUser.id,
        categoryId: foodCategory.id,
      },
      {
        title: 'Balloon Fiesta 2024: Everything You Need to Know',
        slug: 'balloon-fiesta-2024-everything-you-need-to-know',
        content: `# Balloon Fiesta 2024: Everything You Need to Know

The Albuquerque International Balloon Fiesta is just around the corner! Here's your complete guide to the world's largest hot air balloon festival.

## When and Where
- **Dates**: October 5-13, 2024
- **Location**: Balloon Fiesta Park
- **Address**: 5000 Balloon Fiesta Pkwy NE, Albuquerque, NM

## Key Events

### Mass Ascension
Watch hundreds of balloons take to the sky in waves during the iconic Mass Ascension events.

### Special Shape Rodeo
See unique and whimsical balloon shapes that will delight visitors of all ages.

### Balloon Glow
Experience the magic of balloons lighting up the evening sky.

## Tips for Visitors

1. **Arrive Early**: Gates open at 4:30 AM for morning events
2. **Dress Warmly**: October mornings can be chilly
3. **Bring Cash**: Many vendors prefer cash payments
4. **Park Smart**: Consider shuttle services to avoid parking hassles
5. **Stay Hydrated**: Bring water bottles

## Parking and Transportation
- On-site parking available for $20
- Free shuttle service from various locations around the city
- Ride-sharing services available

Don't miss this incredible celebration of flight and community spirit!`,
        excerpt: 'Your complete guide to the 2024 Albuquerque International Balloon Fiesta - dates, events, tips, and everything you need to know.',
        featured: false,
        status: 'PUBLISHED' as const,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        seoTitle: 'Balloon Fiesta 2024 Guide - Albuquerque International Balloon Fiesta',
        seoDescription: 'Complete guide to the 2024 Albuquerque International Balloon Fiesta including dates, events, parking, and visitor tips.',
        authorId: adminUser.id,
        categoryId: eventsCategory.id,
      },
    ]

    for (const post of samplePosts) {
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      })
    }

    console.log('✅ Created sample posts')

    // Create homepage settings
    await prisma.homepageSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        heroTitle: 'Stories & Ideas',
        heroSubtitle: 'Discover what\'s happening in Albuquerque',
      },
    })

    console.log('✅ Created homepage settings')
    console.log('🎉 Database seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export { seed } 