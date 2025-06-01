'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  featured: boolean
  publishedAt: string | null
  createdAt: string
  author: {
    id: string
    name: string
    email: string
  }
  category: {
    id: string
    name: string
  } | null
  tags: Array<{
    id: string
    name: string
  }>
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [statusFilter, featuredFilter])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (featuredFilter !== 'all') params.append('featured', featuredFilter)
      params.append('limit', '50')

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const toggleFeatured = async (postId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured,
        }),
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map(post => 
          post.id === postId ? updatedPost : post
        ))
        toast.success(`Post ${!currentFeatured ? 'featured' : 'unfeatured'}`)
      } else {
        toast.error('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotspot-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-luckiest">
            Posts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your blog posts
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hotspot-red focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hotspot-red focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hotspot-red focus:border-transparent"
          >
            <option value="all">All Posts</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">
                              {post.title}
                            </h3>
                            {post.featured && (
                              <StarIcon className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center mt-1 space-x-2">
                            {post.category && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {post.category.name}
                              </span>
                            )}
                            {post.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.author.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFeatured(post.id, post.featured)}
                          className={`p-1 rounded ${
                            post.featured
                              ? 'text-yellow-600 hover:text-yellow-700'
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={post.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>
                        
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-hotspot-red hover:text-red-700 p-1 rounded"
                          title="Edit post"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        
                        {post.status === 'PUBLISHED' && (
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 p-1 rounded"
                            title="View post"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                          title="Delete post"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' || featuredFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first post'}
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 bg-hotspot-red text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 