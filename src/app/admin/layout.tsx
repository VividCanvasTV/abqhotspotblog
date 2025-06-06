'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  UsersIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
  MegaphoneIcon,
  RssIcon,
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: string
  href: string
  icon: typeof HomeIcon
  roles: string[]
}

const allNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
  { name: 'Media', href: '/admin/media', icon: PhotoIcon, roles: ['ADMIN', 'EDITOR'] },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, roles: ['ADMIN'] },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon, roles: ['ADMIN'] },
]

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'EDITOR':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'AUTHOR':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Filter navigation based on user role
  const navigation = useMemo(() => {
    if (!session?.user?.role) return []
    
    return allNavigation.filter(item => 
      item.roles.includes(session.user.role as string)
    )
  }, [session?.user?.role])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    // Check if user has admin access
    if (!session.user?.role || !['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'AUTHOR'].includes(session.user.role)) {
      router.push('/admin/unauthorized')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-red-600 to-red-700">
            <h1 className="text-xl font-bold text-white">
              ABQ Hotspot Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="space-y-1">
              <Link
                href="/admin"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/admin'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/admin/posts')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="w-5 h-5 mr-3" />
                Posts
              </Link>
              <Link
                href="/admin/events"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/admin/events')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <CalendarDaysIcon className="w-5 h-5 mr-3" />
                Events
              </Link>
              <Link
                href="/admin/restaurants"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/admin/restaurants')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BuildingStorefrontIcon className="w-5 h-5 mr-3" />
                Restaurants
              </Link>
              <Link
                href="/admin/media"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/admin/media')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <PhotoIcon className="w-5 h-5 mr-3" />
                Media
              </Link>
              <Link
                href="/admin/rss"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname.startsWith('/admin/rss')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <RssIcon className="w-5 h-5 mr-3" />
                RSS Feeds
              </Link>
              {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin/users"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.startsWith('/admin/users')
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  Users
                </Link>
              )}
              {session.user?.role === 'SUPER_ADMIN' && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Settings
                  </p>
                  <Link
                    href="/admin/settings/ticker"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname.startsWith('/admin/settings/ticker')
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <MegaphoneIcon className="w-5 h-5 mr-3" />
                    Breaking News
                  </Link>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pathname === '/admin/settings'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <CogIcon className="w-5 h-5 mr-3" />
                    General Settings
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'A'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {session.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 mb-1">{session.user?.email}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(session.user?.role as string)}`}>
                  {(session.user?.role as string)?.toLowerCase() || 'user'}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
} 