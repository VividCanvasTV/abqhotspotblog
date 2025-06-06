'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'

interface MediaFile {
  id: string
  name: string
  type: string
  size: string
  url: string
  uploadedAt: string
  dimensions: string | null
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [selectedType, searchTerm])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.append('type', selectedType)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/media?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch media')
      
      const mediaData = await response.json()
      setMediaFiles(mediaData)
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to load media files')
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)

    const uploadPromises = files.map(async file => {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Upload failed for ${file.name}`)
        }
        toast.success(`${file.name} uploaded successfully!`)
        return true
      } catch (error: any) {
        console.error(`Upload error for ${file.name}:`, error)
        toast.error(`Upload failed for ${file.name}: ${error.message}`)
        return false
      }
    })

    await Promise.all(uploadPromises)
    setIsUploading(false)
    fetchMedia() // Refresh the media list
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFileUpload(files)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-8 h-8 text-blue-500" />
      case 'video':
        return <VideoCameraIcon className="w-8 h-8 text-purple-500" />
      case 'document':
        return <DocumentIcon className="w-8 h-8 text-red-500" />
      default:
        return <FolderIcon className="w-8 h-8 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading media files...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Media Library
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your files, images, and media content
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
        </h3>
        <p className="text-gray-600 mb-4">
          Support for images, videos, documents and more
        </p>
        <label className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose Files'}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx"
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-red-600 h-2.5 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-bold text-gray-800">Filter:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white font-medium"
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        {mediaFiles.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No files found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 group"
              >
                {/* File Preview */}
                <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center border border-gray-200 overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent && !parent.querySelector('.fallback-icon')) {
                          const fallbackDiv = document.createElement('div')
                          fallbackDiv.className = 'flex items-center justify-center w-full h-full fallback-icon'
                          fallbackDiv.innerHTML = `<svg class="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>`
                          parent.appendChild(fallbackDiv)
                        }
                      }}
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-sm truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Size: {file.size}</p>
                    {file.dimensions && <p>Dimensions: {file.dimensions}</p>}
                    <p>Uploaded: {formatDate(file.uploadedAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                      onClick={() => toast.success('Delete functionality coming soon')}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
                    onClick={() => {
                      navigator.clipboard.writeText(file.url)
                      toast.success('URL copied to clipboard!')
                    }}
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'image').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <VideoCameraIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'video').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {mediaFiles.filter(f => f.type === 'document').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 