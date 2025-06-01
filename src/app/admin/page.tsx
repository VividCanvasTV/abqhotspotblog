'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DocumentTextIcon,
  EyeIcon,
  UserGroupIcon,
  StarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  featuredPosts: number
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
  })
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch posts for stats
      const postsResponse = await fetch('/api/posts?limit=100')
      const postsData = await postsResponse.json()
      
      if (postsData.posts) {
        const posts = postsData.posts
        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: any) => p.status === 'PUBLISHED').length,
          draftPosts: posts.filter((p: any) => p.status === 'DRAFT').length,
          featuredPosts: posts.filter((p: any) => p.featured).length,
        })
        
        // Set recent posts (first 5)
        setRecentPosts(posts.slice(0, 5))
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
      color: 'bg-blue-500',
    },
    {
      name: 'Published',
      value: stats.publishedPosts,
      icon: EyeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Drafts',
      value: stats.draftPosts,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Featured',
      value: stats.featuredPosts,
      icon: StarIcon,
      color: 'bg-hotspot-red',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotspot-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-luckiest">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to ABQ Hotspot News Admin
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-hotspot-red text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Posts
            </h2>
            <Link
              href="/admin/posts"
              className="text-hotspot-red hover:text-red-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {post.status}
                    </span>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-hotspot-red hover:text-red-700 text-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No posts yet</p>
              <Link
                href="/admin/posts/new"
                className="text-hotspot-red hover:text-red-700 text-sm font-medium mt-2 inline-block"
              >
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-hotspot-red hover:bg-red-50 transition-colors"
          >
            <PlusIcon className="w-8 h-8 text-hotspot-red mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Create Post</h3>
              <p className="text-sm text-gray-500">Write a new article</p>
            </div>
          </Link>
          
          <Link
            href="/admin/media"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-hotspot-red hover:bg-red-50 transition-colors"
          >
            <DocumentTextIcon className="w-8 h-8 text-hotspot-red mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Media</h3>
              <p className="text-sm text-gray-500">Upload images</p>
            </div>
          </Link>
          
          <Link
            href="/admin/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-hotspot-red hover:bg-red-50 transition-colors"
          >
            <UserGroupIcon className="w-8 h-8 text-hotspot-red mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Site Settings</h3>
              <p className="text-sm text-gray-500">Configure your site</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 