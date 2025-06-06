'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DocumentTextIcon,
  EyeIcon,
  UserGroupIcon,
  StarIcon,
  PlusIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  featuredPosts: number
  totalEvents: number
  upcomingEvents: number
  totalRestaurants: number
  featuredRestaurants: number
  averageRestaurantRating: number
}

interface RecentPost {
  id: string
  title: string
  status: string
  createdAt: string
  author: {
    name: string
  }
}

interface RecentEvent {
  id: string
  title: string
  startDate: string
  location: string
  category: string
}

interface RecentRestaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  featured: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalRestaurants: 0,
    featuredRestaurants: 0,
    averageRestaurantRating: 0,
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([])
  const [recentRestaurants, setRecentRestaurants] = useState<RecentRestaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch posts for stats
      const postsResponse = await fetch('/api/posts?limit=100')
      const postsData = await postsResponse.json()
      
      // Fetch events data
      const eventsResponse = await fetch('/api/events?limit=100')
      const eventsData = await eventsResponse.json()
      
      // Fetch restaurants data
      const restaurantsResponse = await fetch('/api/restaurants?limit=100')
      const restaurantsData = await restaurantsResponse.json()
      
      if (postsData.posts) {
        const posts = postsData.posts
        const events = eventsData.events || []
        const restaurants = restaurantsData.restaurants || []
        
        const upcomingEvents = events.filter((e: any) => new Date(e.startDate) > new Date()).length
        const avgRating = restaurants.length > 0 
          ? restaurants.reduce((sum: number, r: any) => sum + r.rating, 0) / restaurants.length 
          : 0

        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: any) => p.status === 'PUBLISHED').length,
          draftPosts: posts.filter((p: any) => p.status === 'DRAFT').length,
          featuredPosts: posts.filter((p: any) => p.featured).length,
          totalEvents: events.length,
          upcomingEvents,
          totalRestaurants: restaurants.length,
          featuredRestaurants: restaurants.filter((r: any) => r.featured).length,
          averageRestaurantRating: Number(avgRating.toFixed(1)),
        })
        
        // Set recent data
        setRecentPosts(posts.slice(0, 5))
        setRecentEvents(events.slice(0, 3))
        setRecentRestaurants(restaurants.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Posts',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      href: '/admin/posts',
    },
    {
      name: 'Published',
      value: stats.publishedPosts,
      icon: EyeIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      href: '/admin/posts',
    },
    {
      name: 'Events',
      value: stats.totalEvents,
      icon: CalendarDaysIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      href: '/admin/events',
    },
    {
      name: 'Restaurants',
      value: stats.totalRestaurants,
      icon: BuildingStorefrontIcon,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
      href: '/admin/restaurants',
    },
    {
      name: 'Drafts',
      value: stats.draftPosts,
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
      href: '/admin/posts',
    },
    {
      name: 'Featured Posts',
      value: stats.featuredPosts,
      icon: StarIcon,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
      href: '/admin/posts',
    },
    {
      name: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: CalendarDaysIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      href: '/admin/events',
    },
    {
      name: 'Avg Rating',
      value: stats.averageRestaurantRating,
      icon: StarIcon,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      textColor: 'text-pink-600',
      bgLight: 'bg-pink-50',
      href: '/admin/restaurants',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-luckiest">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to ABQ Hotspot Admin - Manage your content, events, and restaurants
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Post
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Event
          </Link>
          <Link
            href="/admin/restaurants/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-md text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Restaurant
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className={`${stat.bgLight} rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group`}
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-4 rounded-lg shadow-md group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.name}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                Recent Posts
              </h2>
              <Link
                href="/admin/posts"
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        by <span className="font-medium">{post.author.name}</span> • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No posts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-600" />
                Recent Events
              </h2>
              <Link
                href="/admin/events"
                className="text-purple-600 hover:text-purple-700 text-sm font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {new Date(event.startDate).toLocaleDateString()} • {event.location}
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <CalendarDaysIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No events yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Restaurants */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-orange-600" />
                Top Restaurants
              </h2>
              <Link
                href="/admin/restaurants"
                className="text-orange-600 hover:text-orange-700 text-sm font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRestaurants.length > 0 ? (
              recentRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                          {restaurant.name}
                        </h3>
                        {restaurant.featured && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {restaurant.cuisine} • ⭐ {restaurant.rating}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <BuildingStorefrontIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No restaurants yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-2 text-gray-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Write Article</span>
          </Link>
          <Link
            href="/admin/events/new"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
          >
            <CalendarDaysIcon className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Add Event</span>
          </Link>
          <Link
            href="/admin/restaurants/new"
            className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
          >
            <BuildingStorefrontIcon className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Add Restaurant</span>
          </Link>
          <Link
            href="/admin/settings/ticker"
            className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
          >
            <StarIcon className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-red-900">Breaking News</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 