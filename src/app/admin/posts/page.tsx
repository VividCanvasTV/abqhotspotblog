'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
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
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')

  const userRole = session?.user?.role
  const userId = session?.user?.id
  const isAdmin = userRole === 'ADMIN'
  const isEditor = userRole === 'EDITOR'
  const isAuthor = userRole === 'AUTHOR'

  useEffect(() => {
    fetchPosts()
  }, [statusFilter, featuredFilter, session])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (featuredFilter !== 'all') params.append('featured', featuredFilter)
      params.append('limit', '50')

      // Authors should only see their own posts
      if (isAuthor && userId) {
        params.append('authorId', userId)
      }

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

  const canEditPost = (post: Post) => {
    if (isAdmin || isEditor) return true
    if (isAuthor && post.author.id === userId) return true
    return false
  }

  const canDeletePost = (post: Post) => {
    if (isAdmin || isEditor) return true
    if (isAuthor && post.author.id === userId && post.status === 'DRAFT') return true
    return false
  }

  const canToggleFeatured = () => {
    return isAdmin || isEditor
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
        const error = await response.json()
        toast.error(error.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const toggleFeatured = async (postId: string, currentFeatured: boolean) => {
    if (!canToggleFeatured()) {
      toast.error('You do not have permission to feature posts')
      return
    }

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
        const error = await response.json()
        toast.error(error.error || 'Failed to update post')
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isAuthor ? 'My Posts' : 'Posts'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isAuthor 
              ? 'Manage your blog posts' 
              : isEditor 
                ? 'Manage all blog posts and content' 
                : 'Full blog post management and administration'
            }
          </p>
          {isAuthor && (
            <div className="mt-2 flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              As an author, you can only see and edit your own posts. Published posts require editor approval to modify.
            </div>
          )}
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
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
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
          >
            <option value="all">All Posts</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-lg px-4 py-3">
            <span className="text-sm font-semibold text-gray-800">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  {!isAuthor && (
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Author
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-base font-semibold text-gray-900">
                              {post.title}
                            </h3>
                            {post.featured && (
                              <StarIcon className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center mt-1 space-x-2">
                            {post.category && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                                {post.category.name}
                              </span>
                            )}
                            {post.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full border border-gray-300"
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
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : post.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    {!isAuthor && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {post.author.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {canToggleFeatured() && (
                          <button
                            onClick={() => toggleFeatured(post.id, post.featured)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              post.featured
                                ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={post.featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>
                        )}
                        
                        {canEditPost(post) && (
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Edit post"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                        )}
                        
                        {post.status === 'PUBLISHED' && (
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                            title="View post"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                        )}
                        
                        {canDeletePost(post) && (
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Delete post"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}

                        {/* Show info icon for authors if they can't perform certain actions */}
                        {isAuthor && (!canEditPost(post) || !canDeletePost(post)) && (
                          <div className="text-gray-400" title="Limited permissions for this post">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || featuredFilter !== 'all'
                ? 'Try adjusting your search or filters to find the posts you\'re looking for.'
                : isAuthor
                  ? 'Get started by creating your first post and sharing your stories with the world.'
                  : 'No posts have been created yet. Encourage your team to start writing!'}
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {isAuthor ? 'Create Your First Post' : 'Create New Post'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 