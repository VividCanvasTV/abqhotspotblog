'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PhotoIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import ImageUpload from '@/app/admin/components/ImageUpload'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  featured: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  publishedAt: string | null
  featuredImage: string | null
  seoTitle: string | null
  seoDescription: string | null
  categoryId: string | null
  tags: Array<{ id: string; name: string }>
  author: { id: string; name: string; email: string }
}

export default function EditPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured: false,
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
    publishedAt: '',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    categoryId: '',
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || '',
          featured: postData.featured,
          status: postData.status,
          publishedAt: postData.publishedAt ? new Date(postData.publishedAt).toISOString().slice(0, 16) : '',
          featuredImage: postData.featuredImage || '',
          seoTitle: postData.seoTitle || '',
          seoDescription: postData.seoDescription || '',
          categoryId: postData.categoryId || '',
          tags: postData.tags.map((tag: any) => tag.name),
        })
      } else if (response.status === 404) {
        toast.error('Post not found')
        router.push('/admin/posts')
      } else {
        toast.error('Failed to load post')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('You must be logged in to edit a post')
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedPost = await response.json()
        toast.success('Post updated successfully!')
        router.push('/admin/posts')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAsDraft = () => {
    setFormData(prev => ({ ...prev, status: 'DRAFT' }))
    setTimeout(() => {
      document.getElementById('submit-form')?.click()
    }, 0)
  }

  const handlePublish = () => {
    setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))
    setTimeout(() => {
      document.getElementById('submit-form')?.click()
    }, 0)
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, featuredImage: url }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link
          href="/admin/posts"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/posts"
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Posts
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Edit Post
            </h1>
            <p className="text-gray-600 text-lg">
              Update your post content and settings
            </p>
          </div>
        </div>
        {post.status === 'PUBLISHED' && (
          <Link
            href={`/posts/${post.id}`}
            target="_blank"
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Live
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-3">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg text-gray-900 placeholder-gray-500"
                placeholder="Enter your post title..."
                required
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <label htmlFor="content" className="block text-sm font-bold text-gray-800 mb-3">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={24}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-mono text-sm text-gray-900 placeholder-gray-500"
                placeholder="Write your post content here..."
                required
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-700 font-medium">
                  You can use Markdown formatting in your content.
                </p>
                <span className="text-xs text-gray-600 font-medium">
                  {formData.content.length} characters
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <label htmlFor="excerpt" className="block text-sm font-bold text-gray-800 mb-3">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                placeholder="Brief description of the post..."
              />
              <p className="text-sm text-gray-700 mt-2 font-medium">
                This will be shown in post previews and search results.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Publish</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-bold text-gray-800 mb-3">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>

                {formData.status === 'SCHEDULED' && (
                  <div>
                    <label htmlFor="publishedAt" className="block text-sm font-bold text-gray-800 mb-3">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      id="publishedAt"
                      name="publishedAt"
                      value={formData.publishedAt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                    />
                  </div>
                )}

                <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-3 block text-sm font-bold text-gray-800">
                    Featured post
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mt-8">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  disabled={isSaving}
                  className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200 font-medium"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSaving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {isSaving ? 'Saving...' : 'Update & Publish'}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Featured Image
              </label>
              <ImageUpload 
                onUploadSuccess={handleImageUpload} 
                initialImageUrl={formData.featuredImage}
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tags</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-bold text-gray-800 mb-3">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="SEO optimized title..."
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-bold text-gray-800 mb-3">
                    SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="SEO meta description..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden submit button */}
        <button
          id="submit-form"
          type="submit"
          className="hidden"
        >
          Submit
        </button>
      </form>
    </div>
  )
} 