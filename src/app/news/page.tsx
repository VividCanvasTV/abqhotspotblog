'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  FireIcon,
  MapPinIcon,
  ChevronRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string | null
  publishedAt: string
  author: {
    name: string
  }
  category: {
    name: string
    id: string
  } | null
  featured: boolean
  priority?: 'BREAKING' | 'URGENT' | 'FEATURED' | null
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [selectedCategory, sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('limit', '50')
      if (selectedCategory !== 'all') {
        params.append('categoryId', selectedCategory)
      }
      if (sortBy === 'featured') {
        params.append('featured', 'true')
      }

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // For now, we'll use mock categories since we don't have a categories API
      setCategories([
        { id: '1', name: 'Breaking News', slug: 'breaking-news' },
        { id: '2', name: 'Local Politics', slug: 'politics' },
        { id: '3', name: 'Business', slug: 'business' },
        { id: '4', name: 'Crime & Safety', slug: 'crime' },
        { id: '5', name: 'Education', slug: 'education' },
        { id: '6', name: 'Weather', slug: 'weather' },
        { id: '7', name: 'Transportation', slug: 'transportation' },
      ])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const featuredPosts = posts.filter(post => post.featured).slice(0, 3)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-luckiest">
                    Albuquerque Hotspot
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">Your Local News Source</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/news" className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <NewspaperIcon className="w-12 h-12 text-white mr-4" />
              <h1 className="text-5xl font-bold text-white font-luckiest">
                Latest News
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Stay informed with the latest news and updates from around Albuquerque
            </p>
          </div>
        </div>
      </div>

      {/* Featured News Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <FireIcon className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Breaking News</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  {post.featuredImage && (
                    <div className={`aspect-video ${index === 0 ? 'lg:aspect-[2/1]' : ''}`}>
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {post.priority && (
                        <span className={`text-white px-3 py-1 rounded-full text-xs font-bold mr-3 ${
                          post.priority === 'BREAKING' ? 'bg-red-600' :
                          post.priority === 'URGENT' ? 'bg-orange-600' :
                          post.priority === 'FEATURED' ? 'bg-blue-600' :
                          'bg-gray-600'
                        }`}>
                          {post.priority}
                        </span>
                      )}
                      {post.category && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                      <Link href={`/posts/${post.slug}`} className="hover:text-red-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-700">
                      <UserIcon className="w-4 h-4 mr-1" />
                      <span>{post.author.name}</span>
                      <span className="mx-2">•</span>
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500 bg-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="latest">Latest First</option>
                  <option value="featured">Featured Only</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-luckiest">All News</h2>
            <div className="flex items-center text-gray-600">
              <FunnelIcon className="w-5 h-5 mr-2" />
              <span>{filteredPosts.length} articles</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <NewspaperIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms or filters' : 'No articles available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
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
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-600 rounded-full mb-3">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-700">
                        <UserIcon className="w-4 h-4 mr-1" />
                        <span>{post.author.name}</span>
                        <span className="mx-2">•</span>
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Read More
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
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