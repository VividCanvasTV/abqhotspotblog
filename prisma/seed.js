const { PrismaClient } = require('../src/generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.eventAttendance.deleteMany()
  await prisma.restaurantReview.deleteMany()
  await prisma.post.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.event.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@abqhotspot.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Local News',
        slug: 'local-news',
        description: 'Latest news from around Albuquerque',
        color: '#3B82F6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Community',
        slug: 'community',
        description: 'Community events and stories',
        color: '#10B981',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        slug: 'business',
        description: 'Local business news and updates',
        color: '#F59E0B',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Culture',
        slug: 'culture',
        description: 'Arts, culture, and entertainment',
        color: '#8B5CF6',
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Breaking News', slug: 'breaking-news' } }),
    prisma.tag.create({ data: { name: 'Downtown', slug: 'downtown' } }),
    prisma.tag.create({ data: { name: 'Old Town', slug: 'old-town' } }),
    prisma.tag.create({ data: { name: 'Westside', slug: 'westside' } }),
    prisma.tag.create({ data: { name: 'Northeast Heights', slug: 'northeast-heights' } }),
  ])

  // Create sample posts
  const posts = [
    {
      title: 'New Downtown Development Project Approved by City Council',
      slug: 'new-downtown-development-approved',
      content: `The Albuquerque City Council has unanimously approved a major downtown development project that promises to revitalize the urban core. The $50 million mixed-use development will include residential units, retail space, and office buildings.

The project, located at the intersection of Central Avenue and 3rd Street, will bring 200 new residential units to downtown, along with 15,000 square feet of retail space and modern office facilities.

"This development represents a significant investment in our downtown core," said Mayor Tim Keller. "It will bring new residents, businesses, and energy to the heart of our city."

Construction is expected to begin in early 2025 and be completed by late 2026. The project is expected to create over 300 construction jobs and 150 permanent positions.`,
      excerpt: 'City Council approves $50 million mixed-use development for downtown Albuquerque.',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-12-01'),
      featuredImage: '/images/downtown-development.jpg',
      authorId: adminUser.id,
      categoryId: categories[0].id,
    },
    {
      title: 'Balloon Fiesta Sets New Attendance Record',
      slug: 'balloon-fiesta-attendance-record',
      content: `The 2024 Albuquerque International Balloon Fiesta has set a new attendance record, welcoming over 900,000 visitors during the nine-day event. This marks a 15% increase from last year's attendance.

The festival, which ran from October 5-13, featured 550 hot air balloons from around the world, making it the largest ballooning event globally. Perfect weather conditions contributed to the success of the event.

"We're thrilled with this year's turnout," said Balloon Fiesta Executive Director Paul Smith. "The economic impact on our community is tremendous, generating an estimated $186 million in direct spending."

Special events this year included the inaugural Night Glow Spectacular and the addition of 50 international balloons from 15 countries.`,
      excerpt: 'The 2024 Balloon Fiesta welcomes record-breaking 900,000+ visitors.',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-11-28'),
      featuredImage: '/images/balloon-fiesta.jpg',
      authorId: adminUser.id,
      categoryId: categories[1].id,
    },
    {
      title: 'Local Restaurant Wins National Culinary Award',
      slug: 'local-restaurant-national-award',
      content: `Sadie's of New Mexico has been awarded the prestigious James Beard America's Classics Award, recognizing the restaurant as a beloved regional establishment with timeless appeal and quality food.

The award honors locally owned restaurants that have a timeless appeal and are cherished for quality food that reflects the character of their community. Sadie's, known for its authentic New Mexican cuisine, has been serving Albuquerque for over 40 years.

"This recognition is incredible," said owner Fernando Salazar. "It validates our commitment to authentic New Mexican flavors and our community."

The restaurant is famous for its sopaipillas, green chile stew, and traditional enchiladas. The James Beard Foundation will present the award at a ceremony in Chicago next month.`,
      excerpt: "Sadie's of New Mexico receives James Beard America's Classics Award.",
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-11-25'),
      featuredImage: '/images/sadies-restaurant.jpg',
      authorId: adminUser.id,
      categoryId: categories[2].id,
    },
    {
      title: 'ABQ BioPark Welcomes New Penguin Exhibit',
      slug: 'biopark-penguin-exhibit',
      content: `The ABQ BioPark Zoo has opened its newest attraction: a state-of-the-art penguin exhibit featuring Humboldt penguins. The $3.2 million exhibit includes a 45,000-gallon pool and climate-controlled environment.

The exhibit houses 12 Humboldt penguins, including two breeding pairs. The facility features underwater viewing areas, allowing visitors to watch the penguins swim and dive.

"These penguins are incredible ambassadors for their species," said Zoo Director Rick Janser. "The exhibit provides an immersive experience while supporting conservation efforts."

The penguins arrived from accredited zoos across the country as part of the Species Survival Plan, a cooperative breeding program designed to maintain genetic diversity.`,
      excerpt: 'ABQ BioPark unveils new $3.2 million Humboldt penguin exhibit.',
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-11-22'),
      featuredImage: '/images/penguin-exhibit.jpg',
      authorId: adminUser.id,
      categoryId: categories[3].id,
    },
  ]

  for (const postData of posts) {
    await prisma.post.create({
      data: {
        ...postData,
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[1].id }],
        },
      },
    })
  }

  // Create sample restaurants
  const restaurants = [
    {
      name: "Sadie's of New Mexico",
      description: "Authentic New Mexican cuisine featuring traditional sopaipillas, green chile stew, and enchiladas. A local favorite for over 40 years.",
      cuisine: "New Mexican",
      priceRange: "$$",
      rating: 4.5,
      reviewCount: 1250,
      address: "6230 4th St NW, Albuquerque, NM 87107",
      phone: "(505) 345-5339",
      hours: "Mon-Thu 11am-9pm, Fri-Sat 11am-10pm, Sun 11am-9pm",
      website: "https://www.sadiesofnewmexico.com",
      image: "/images/restaurants/sadies.jpg",
      featured: true,
      delivery: true,
      takeout: true,
      dineIn: true,
      tags: JSON.stringify(["Family Friendly", "Local Favorite", "Green Chile"]),
      specialties: JSON.stringify(["Green Chile Stew", "Sopaipillas", "Enchiladas", "Carne Adovada"]),
    },
    {
      name: "The Range Cafe",
      description: "Contemporary American cuisine with a New Mexican twist. Known for creative dishes and locally sourced ingredients.",
      cuisine: "Contemporary American",
      priceRange: "$$$",
      rating: 4.3,
      reviewCount: 890,
      address: "925 Camino de los Marquez, Bernalillo, NM 87004",
      phone: "(505) 867-1700",
      hours: "Daily 7:30am-10pm",
      website: "https://www.rangecafe.com",
      image: "/images/restaurants/range-cafe.jpg",
      featured: true,
      delivery: false,
      takeout: true,
      dineIn: true,
      tags: JSON.stringify(["Farm-to-Table", "Brunch", "Local Ingredients"]),
      specialties: JSON.stringify(["Death by Lemon", "Green Chile Mac & Cheese", "Salmon Teriyaki", "Breakfast Burrito"]),
    },
    {
      name: "Frontier Restaurant",
      description: "An Albuquerque institution since 1971, famous for its sweet rolls and green chile cheeseburgers.",
      cuisine: "American",
      priceRange: "$",
      rating: 4.2,
      reviewCount: 2100,
      address: "2400 Central Ave SE, Albuquerque, NM 87106",
      phone: "(505) 266-0550",
      hours: "24/7",
      website: "https://www.frontierrestaurant.com",
      image: "/images/restaurants/frontier.jpg",
      featured: false,
      delivery: false,
      takeout: true,
      dineIn: true,
      tags: JSON.stringify(["24 Hour", "UNM Area", "Institution"]),
      specialties: JSON.stringify(["Sweet Rolls", "Green Chile Cheeseburger", "Breakfast Burritos", "Coffee"]),
    },
  ]

  for (const restaurantData of restaurants) {
    await prisma.restaurant.create({ data: restaurantData })
  }

  // Create sample events
  const events = [
    {
      title: "Old Town Holiday Stroll",
      description: "Join us for a magical evening stroll through historic Old Town Albuquerque. Enjoy luminarias, live music, and hot chocolate while exploring local shops and galleries.",
      startDate: "2024-12-15",
      endDate: "2024-12-15",
      startTime: "5:00 PM",
      endTime: "9:00 PM",
      location: "Old Town Plaza, Albuquerque, NM",
      category: "Community",
      price: "Free",
      image: "/images/events/holiday-stroll.jpg",
      organizer: "Old Town Merchants Association",
      capacity: 500,
      attendees: 45,
      featured: true,
      tags: JSON.stringify(["Holiday", "Family Friendly", "Free", "Historic"]),
    },
    {
      title: "ABQ Food Truck Festival",
      description: "Sample the best food trucks Albuquerque has to offer! Over 30 vendors will be serving everything from traditional New Mexican cuisine to international fusion.",
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      startTime: "11:00 AM",
      endTime: "8:00 PM",
      location: "Balloon Fiesta Park, Albuquerque, NM",
      category: "Food & Dining",
      price: "Free entry, food for purchase",
      image: "/images/events/food-truck-festival.jpg",
      organizer: "Albuquerque Food Truck Association",
      capacity: 2000,
      attendees: 234,
      featured: true,
      tags: JSON.stringify(["Food", "Family Friendly", "Outdoor", "Weekend"]),
    },
    {
      title: "First Friday Art Walk",
      description: "Explore downtown galleries, meet local artists, and enjoy complimentary refreshments during this monthly art celebration.",
      startDate: "2025-01-03",
      endDate: "2025-01-03",
      startTime: "5:00 PM",
      endTime: "9:00 PM",
      location: "Downtown Arts District, Albuquerque, NM",
      category: "Arts & Culture",
      price: "Free",
      image: "/images/events/art-walk.jpg",
      organizer: "Downtown Action Team",
      capacity: 300,
      attendees: 0,
      featured: false,
      tags: JSON.stringify(["Art", "Monthly", "Free", "Downtown"]),
    },
  ]

  for (const eventData of events) {
    await prisma.event.create({ data: eventData })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 1 admin user (admin@abqhotspot.com / admin123)`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${tags.length} tags`)
  console.log(`   - ${posts.length} posts`)
  console.log(`   - ${restaurants.length} restaurants`)
  console.log(`   - ${events.length} events`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 