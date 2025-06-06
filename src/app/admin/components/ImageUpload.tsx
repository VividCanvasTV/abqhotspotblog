'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  initialImageUrl?: string | null
}

export default function ImageUpload({ onUploadSuccess, initialImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) {
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.')
        return
      }

      setPreview(URL.createObjectURL(file))
      setIsUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const uploadedFile = await response.json()
        onUploadSuccess(uploadedFile.url)
        toast.success('Image uploaded successfully!')
      } catch (error: any) {
        console.error('Upload error:', error)
        toast.error(`Upload failed: ${error.message}`)
        setPreview(initialImageUrl || null) // Revert preview if upload fails
      } finally {
        setIsUploading(false)
      }
    },
    [onUploadSuccess, initialImageUrl]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  })

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent dropzone activation
    setPreview(null)
    onUploadSuccess('') // Notify parent that image is removed
  }

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ease-in-out
      ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400'}
      ${preview ? 'border-solid' : ''}`}
    >
      <input {...getInputProps()} />

      {preview ? (
        <>
          <img src={preview} alt="Image preview" className="mx-auto h-48 w-auto rounded-lg object-cover" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
          {isUploading && (
             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
               <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
             </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-600">
          <PhotoIcon className="w-12 h-12 text-gray-400" />
          <div className="flex text-sm">
            <p className="font-semibold text-red-600">
              {isDragActive ? 'Drop the file here...' : 'Upload a file'}
            </p>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
          {isUploading && (
            <div className="flex items-center space-x-2 pt-4">
              <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-red-500"></div>
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 