import { prisma } from '@/lib/db'
import Link from 'next/link'

async function getFeaturedPosts() {
  try {
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
      take: 3,
    })
    return posts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        featured: false,
      },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    })
    return posts
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}

export default async function HomePage() {
  const [featuredPosts, recentPosts] = await Promise.all([
    getFeaturedPosts(),
    getRecentPosts(),
  ])

  const mainFeaturedPost = featuredPosts[0]
  const sidebarFeaturedPosts = featuredPosts.slice(1, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-hotspot-red rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AH</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 font-luckiest">
                  Albuquerque Hotspot
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/news" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  News
                </Link>
                <Link href="/events" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Events
                </Link>
                <Link href="/food" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Food
                </Link>
                <Link href="/admin" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-hotspot-red via-hotspot-orange to-hotspot-yellow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-luckiest">
            Stories & Ideas
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover what's happening in Albuquerque - from breaking news to local events and community stories
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          {mainFeaturedPost && (
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                {mainFeaturedPost.featuredImage && (
                  <div className="aspect-video">
                    <img
                      src={mainFeaturedPost.featuredImage}
                      alt={mainFeaturedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {mainFeaturedPost.category && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-hotspot-red text-white rounded-full mb-3">
                      {mainFeaturedPost.category.name}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-luckiest">
                    <Link href={`/posts/${mainFeaturedPost.slug}`} className="hover:text-hotspot-red">
                      {mainFeaturedPost.title}
                    </Link>
                  </h2>
                  {mainFeaturedPost.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {mainFeaturedPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium">
                          {mainFeaturedPost.author.name?.[0] || 'A'}
                        </span>
                      </div>
                      <span>{mainFeaturedPost.author.name}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{new Date(mainFeaturedPost.publishedAt!).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Posts Sidebar */}
            {sidebarFeaturedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-luckiest">
                  Featured Stories
                </h3>
                <div className="space-y-4">
                  {sidebarFeaturedPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                      {post.featuredImage && (
                        <div className="aspect-video">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {post.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-hotspot-orange text-white rounded-full mb-2">
                            {post.category.name}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                          <Link href={`/posts/${post.slug}`} className="hover:text-hotspot-red">
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{post.author.name}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-luckiest">
                  Latest News
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <article key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex space-x-3">
                        {post.featuredImage && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {post.category && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-hotspot-yellow text-gray-800 rounded-full mb-1">
                              {post.category.name}
                            </span>
                          )}
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            <Link href={`/posts/${post.slug}`} className="hover:text-hotspot-red">
                              {post.title}
                            </Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{post.author.name}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-hotspot-red rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <span className="text-xl font-bold font-luckiest">Albuquerque Hotspot</span>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            <p>&copy; 2024 Albuquerque Hotspot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
