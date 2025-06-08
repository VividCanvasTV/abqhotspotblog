import { prisma } from '@/lib/db'
import Link from 'next/link'
import {
  ChevronRightIcon,
  FireIcon,
  ClockIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
  NewspaperIcon,
  MegaphoneIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  priceRange: string
  rating: number
  reviewCount: number
  address: string
  phone: string | null
  hours: string | null
  image: string | null
  featured: boolean
  delivery: boolean
  takeout: boolean
  dineIn: boolean
  tags: string
  specialties: string
  website: string | null
  createdAt: Date
  updatedAt: Date
}

async function getFeaturedPosts() {
  try {
    console.log('🔍 HomePage: Fetching featured posts...')
    const posts = await prisma.post.findMany({
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
    console.log(`✅ HomePage: Found ${posts.length} featured posts`)
    return posts
  } catch (error) {
    console.error('❌ HomePage: Error fetching featured posts:', error)
    return []
  }
}

async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
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
      take: 8,
    })
    return posts
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

async function getTrendingPosts() {
  try {
    const posts = await prisma.post.findMany({
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
    return posts
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
}

async function getBreakingNews() {
  try {
    // In a real app, this would come from the database
    const breakingNews = [
      "🚨 BREAKING: City Council approves new downtown development project",
      "⚡ URGENT: Traffic alert on I-25 northbound near Montgomery",
      "🌟 NEW: Local restaurant wins national culinary award",
      "📈 UPDATE: ABQ unemployment rate drops to historic low",
      "🎉 LIVE: Balloon Fiesta sets new attendance record",
    ]
    return breakingNews
  } catch (error) {
    console.error('Error fetching breaking news:', error)
    return ["Stay tuned for the latest updates from Albuquerque"]
  }
}

async function getFeaturedRestaurants() {
  try {
    console.log('🔍 HomePage: Fetching featured restaurants...')
    const restaurants = await prisma.restaurant.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
    console.log(`✅ HomePage: Found ${restaurants.length} featured restaurants`)
    return restaurants
  } catch (error) {
    console.error('❌ HomePage: Error fetching featured restaurants:', error)
    return []
  }
}

export default async function HomePage() {
  console.log('🏠 HomePage: Starting data fetch...')
  
  const [featuredPosts, recentPosts, trendingPosts, breakingNews, featuredRestaurants] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
    getTrendingPosts(),
    getBreakingNews(),
    getFeaturedRestaurants(),
  ])

  console.log('🏠 HomePage: Data fetch complete:', {
    featuredPosts: featuredPosts.length,
    recentPosts: recentPosts.length,
    trendingPosts: trendingPosts.length,
    breakingNews: breakingNews.length,
    featuredRestaurants: featuredRestaurants.length
  })

  const heroPost = featuredPosts[0]
  const secondaryFeatured = featuredPosts.slice(1, 3)
  const tertiaryFeatured = featuredPosts.slice(3, 6)

  console.log('🏠 HomePage: Hero post:', heroPost ? heroPost.title : 'None')
  console.log('🏠 HomePage: Secondary featured:', secondaryFeatured.length)
  console.log('🏠 HomePage: Tertiary featured:', tertiaryFeatured.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-luckiest">
                  Albuquerque Hotspot
                </h1>
                  <p className="text-xs text-gray-600 font-medium">Your Local News Source</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Home
                </Link>
                <Link href="/news" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  News
                </Link>
                <Link href="/events" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Events
                </Link>
                <Link href="/food" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Food & Dining
                </Link>
                <Link href="/admin" className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-orange-700 transition-all shadow-md">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <MapPinIcon className="w-6 h-6 text-yellow-300 mr-2" />
                <span className="text-yellow-300 font-medium">Albuquerque, New Mexico</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-luckiest leading-tight">
                Your City's
                <span className="block text-yellow-300">Pulse</span>
          </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
                Stay connected with what matters most in Albuquerque. From breaking news to community events, 
                we bring you the stories that shape our city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#latest-news"
                  className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <NewspaperIcon className="w-5 h-5 mr-2" />
                  Read Latest News
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="#trending"
                  className="inline-flex items-center px-8 py-4 bg-black/20 text-white rounded-xl font-bold hover:bg-black/30 transition-all duration-200 border-2 border-white/20 hover:border-white/40"
                >
                  <FireIcon className="w-5 h-5 mr-2" />
                  What's Trending
                </Link>
              </div>
            </div>
            
            {/* Hero Post Card */}
            {heroPost ? (
              <div className="lg:block hidden">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  {heroPost.featuredImage && (
                    <div className="aspect-video">
                      <img
                        src={heroPost.featuredImage}
                        alt={heroPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {heroPost.category && (
                      <span className="inline-block px-3 py-1 text-sm font-bold bg-red-100 text-red-600 rounded-full mb-3">
                        {heroPost.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {heroPost.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-700">
                      <UserIcon className="w-4 h-4 mr-1" />
                      <span>{heroPost.author.name}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(heroPost.publishedAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:block hidden">
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 p-6 rounded-2xl">
                  <strong>Debug:</strong> No hero post found. Featured posts: {featuredPosts.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Breaking News Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center">
            <div className="flex items-center bg-red-800 px-4 py-1 rounded-full mr-4 shadow-lg">
              <MegaphoneIcon className="w-4 h-4 mr-2 animate-pulse" />
              <span className="font-bold text-sm">BREAKING</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap font-medium">
                {breakingNews.join(' • ')}
              </div>
            </div>
            <div className="ml-4 text-red-200 text-sm hidden md:block">
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <StarIcon className="w-8 h-8 text-yellow-500 mr-2" />
              <h2 className="text-4xl font-bold text-gray-900 font-luckiest">Featured Stories</h2>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover the most important stories shaping our community
            </p>
          </div>

          {/* Main Featured Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Primary Featured */}
            {heroPost && (
            <div className="lg:col-span-2">
                <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {heroPost.featuredImage && (
                    <div className="aspect-video relative">
                      <img
                        src={heroPost.featuredImage}
                        alt={heroPost.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          FEATURED
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    {heroPost.category && (
                      <span className="inline-block px-4 py-2 text-sm font-bold bg-gradient-to-r from-red-100 to-orange-100 text-red-600 rounded-full mb-4">
                        {heroPost.category.name}
                      </span>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 font-luckiest leading-tight">
                      <Link href={`/posts/${heroPost.slug}`} className="hover:text-red-600 transition-colors">
                        {heroPost.title}
                      </Link>
                    </h2>
                    {heroPost.excerpt && (
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed line-clamp-3">
                        {heroPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-700">
                        <div className="flex items-center bg-gray-100 rounded-full p-2 mr-3">
                          <UserIcon className="w-4 h-4 mr-1" />
                          <span className="font-medium">{heroPost.author.name}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{new Date(heroPost.publishedAt!).toLocaleDateString()}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <span>5 min read</span>
                      </div>
                      <Link
                        href={`/posts/${heroPost.slug}`}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-bold"
                      >
                        Read More
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Secondary Featured Posts */}
            <div className="space-y-6">
              {secondaryFeatured.map((post, index) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex">
                    {post.featuredImage && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      {post.category && (
                        <span className="inline-block px-2 py-1 text-xs font-bold bg-orange-100 text-orange-600 rounded-full mb-2">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                        <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-700">
                        <span>{post.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Tertiary Featured Posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tertiaryFeatured.map((post) => (
              <article key={post.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                {post.featuredImage && (
                  <div className="aspect-video">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full mb-3">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-700">
                    <span>{post.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
            </div>
      </section>

      {/* Trending Section */}
      <section id="trending" className="py-16 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl mr-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Trending Now</h2>
                <p className="text-gray-600">What Albuquerque is talking about</p>
              </div>
            </div>
            <Link
              href="/trending"
              className="hidden md:inline-flex items-center text-red-600 hover:text-red-700 font-bold"
            >
              View All
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingPosts.map((post, index) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="relative">
                      {post.featuredImage && (
                    <div className="aspect-square">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                      <div className="p-4">
                        {post.category && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full mb-2">
                            {post.category.name}
                          </span>
                        )}
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-3 mb-2">
                    <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
                            {post.title}
                          </Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-700">
                    <ClockIcon className="w-3 h-3 mr-1" />
                          <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
      </section>

      {/* Latest News Section */}
      <section id="latest-news" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                <NewspaperIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Latest News</h2>
                <p className="text-gray-600">Stay up to date with the newest stories</p>
              </div>
            </div>
            <Link
              href="/news"
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-bold"
            >
              View All News
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPosts.slice(0, 8).map((post) => (
              <article key={post.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
                        {post.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                <div className="p-5">
                          {post.category && (
                    <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-600 rounded-full mb-3">
                              {post.category.name}
                            </span>
                          )}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/posts/${post.slug}`}>
                              {post.title}
                            </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center">
                      <UserIcon className="w-3 h-3 mr-1" />
                            <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl mr-4">
                <BuildingStorefrontIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Featured Restaurants</h2>
                <p className="text-gray-600">Discover Albuquerque's finest dining experiences</p>
              </div>
            </div>
            <Link
              href="/food"
              className="hidden md:inline-flex items-center text-orange-600 hover:text-orange-700 font-bold"
            >
              View All Restaurants
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRestaurants.length === 0 ? (
              <div className="col-span-3 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                <strong>Debug:</strong> No featured restaurants found. Check database seeding.
              </div>
            ) : (
              featuredRestaurants.map((restaurant: Restaurant) => (
              <article key={restaurant.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-300">
                {restaurant.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
              </div>
            )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-bold bg-orange-100 text-orange-600 rounded-full">
                      {restaurant.cuisine}
                    </span>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(restaurant.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{restaurant.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    <Link href={`/food/${restaurant.id}`}>
                      {restaurant.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(() => {
                      try {
                        const specialties = JSON.parse(restaurant.specialties || '[]')
                        return specialties.slice(0, 2).map((specialty: string) => (
                          <span
                            key={specialty}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))
                      } catch {
                        return null
                      }
                    })()}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="text-lg font-bold text-gray-700 mr-2">{restaurant.priceRange}</span>
                      <span>• {restaurant.reviewCount} reviews</span>
                    </div>
                    <Link
                      href={`/food/${restaurant.id}`}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      View Menu
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            )))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4 font-luckiest">
              Stay in the Loop
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest Albuquerque news, events, and stories delivered straight to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-500"
              />
              <button className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-white/70 text-sm mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
        </div>
      </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <span className="text-2xl font-bold font-luckiest">Albuquerque Hotspot</span>
                  <p className="text-gray-400 text-sm">Your Local News Source</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connecting Albuquerque through local news, community stories, and events that matter to our city.
              </p>
              <div className="flex items-center text-gray-400">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>Albuquerque, New Mexico</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/news" className="block text-gray-400 hover:text-white transition-colors">Latest News</Link>
                <Link href="/events" className="block text-gray-400 hover:text-white transition-colors">Events</Link>
                <Link href="/food" className="block text-gray-400 hover:text-white transition-colors">Food & Dining</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>news@abqhotspot.com</p>
                <p>(505) 555-NEWS</p>
                <p>Follow us for updates</p>
                <Link href="/api/rss" className="flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                  📡 RSS Feed
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 Albuquerque Hotspot. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
