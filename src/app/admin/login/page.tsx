'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the proper login page which will handle authentication
    // and redirect back to admin dashboard on success
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  )
} 