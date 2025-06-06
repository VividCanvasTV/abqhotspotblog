'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeftIcon,
  UserIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR'
  avatar: string | null
  createdAt: string
  postsCount: number
}

export default function EditUserPage() {
  const params = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'AUTHOR' as 'ADMIN' | 'EDITOR' | 'AUTHOR',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (params?.id) {
      fetchUser()
    }
  }, [params?.id])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      const userData = await response.json()
      setUser(userData)
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role,
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user data')
      router.push('/admin/users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Prevent non-admins from promoting themselves or others to admin
    if (session?.user?.role !== 'ADMIN' && formData.role === 'ADMIN') {
      toast.error('Only admins can assign admin roles')
      return
    }

    try {
      setIsSaving(true)
      
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update user')
      }

      toast.success('User updated successfully')
      router.push('/admin/users')
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return

    // Prevent self-deletion
    if (user.id === session?.user?.id) {
      toast.error('You cannot delete your own account')
      return
    }

    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      toast.success('User deleted successfully')
      router.push('/admin/users')
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || 'Failed to delete user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
        <Link
          href="/admin/users"
          className="text-red-600 hover:text-red-700"
        >
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mr-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Users
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit User
          </h1>
          <p className="text-gray-600 text-lg">
            Update user information and permissions
          </p>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={user.id === session?.user?.id}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={user.id === session?.user?.id ? "You cannot delete your own account" : "Delete user"}
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete User
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user.name?.[0] || user.email?.[0] || 'U'}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                {user.postsCount} posts
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-gray-800 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={session?.user?.role !== 'ADMIN' && formData.role === 'ADMIN'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white disabled:bg-gray-100"
              >
                <option value="AUTHOR">Author</option>
                <option value="EDITOR">Editor</option>
                {session?.user?.role === 'ADMIN' && (
                  <option value="ADMIN">Admin</option>
                )}
              </select>
              {session?.user?.role !== 'ADMIN' && (
                <p className="text-sm text-gray-500 mt-2">
                  Only admins can assign admin roles
                </p>
              )}
            </div>

            {/* Current Role Display */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Current Role
              </label>
              <div className="flex items-center px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-800 font-medium">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Change Password (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href="/admin/users"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 shadow-lg font-medium"
            >
              {isSaving ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 