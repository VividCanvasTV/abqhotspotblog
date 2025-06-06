'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShieldExclamationIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function UnauthorizedPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleGoBack = () => {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <ShieldExclamationIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Your Role:</strong> {session?.user?.role || 'Unknown'}
          </p>
          <p className="text-sm text-gray-600">
            Contact an administrator if you believe you should have access to this area.
          </p>
        </div>

        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
} 