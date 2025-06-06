'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  RssIcon,
  CloudArrowDownIcon,
  PlusIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  NewspaperIcon,
  ClockIcon,
  PauseIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

interface RSSFeed {
  name: string
  url: string
  category: string
  status: string
  enabled: boolean
  maxItems?: number
  keywords?: string[]
  excludeKeywords?: string[]
}

interface ImportStatus {
  success: boolean
  message: string
  loading: boolean
}

interface SchedulerStats {
  lastRun: string
  totalImports: number
  successfulImports: number
  failedImports: number
  averageRunTime: number
}

interface ImportResult {
  feedName: string
  success: boolean
  imported: number
  skipped: number
  errors: string[]
  duration: number
}

export default function RSSManagementPage() {
  const { data: session, status } = useSession()
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [loading, setLoading] = useState(true)
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    success: false,
    message: '',
    loading: false,
  })
  const [customFeed, setCustomFeed] = useState({
    url: '',
    name: '',
  })
  const [schedulerRunning, setSchedulerRunning] = useState(false)
  const [schedulerStats, setSchedulerStats] = useState<SchedulerStats | null>(null)
  const [lastImportResults, setLastImportResults] = useState<ImportResult[]>([])
  const [feedCounts, setFeedCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchFeeds()
    fetchFeedCounts()
  }, [])

  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rss/import')
      const data = await response.json()
      
      if (response.ok) {
        setFeeds(data.feeds || [])
      } else {
        console.error('Error fetching feeds:', data.error)
      }
    } catch (error) {
      console.error('Error fetching feeds:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedCounts = async () => {
    try {
      const response = await fetch('/api/rss/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get_feed_counts' }),
      })
      const data = await response.json()
      
      if (response.ok) {
        setFeedCounts(data.counts || {})
      }
    } catch (error) {
      console.error('Error fetching feed counts:', error)
    }
  }

  const triggerImport = async (url?: string, feedName?: string) => {
    try {
      setImportStatus({ success: false, message: '', loading: true })
      
      const body = url && feedName ? { url, feedName } : {}
      
      const response = await fetch('/api/rss/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setImportStatus({
          success: true,
          message: data.message,
          loading: false,
        })
      } else {
        setImportStatus({
          success: false,
          message: data.error || 'Import failed',
          loading: false,
        })
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'Import failed',
        loading: false,
      })
    }
  }

  const handleCustomImport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customFeed.url || !customFeed.name) {
      setImportStatus({
        success: false,
        message: 'Please provide both URL and feed name',
        loading: false,
      })
      return
    }
    
    await triggerImport(customFeed.url, customFeed.name)
    setCustomFeed({ url: '', name: '' })
  }

  const clearFeedPosts = async (feedName: string) => {
    if (!confirm(`Are you sure you want to clear all posts from ${feedName}? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch('/api/rss/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear_feed', feedName }),
      })
      const data = await response.json()
      
      if (response.ok) {
        setImportStatus({
          success: true,
          message: data.message,
          loading: false,
        })
        fetchFeedCounts() // Refresh counts
      } else {
        setImportStatus({
          success: false,
          message: data.error || 'Failed to clear posts',
          loading: false,
        })
      }
    } catch (error) {
      setImportStatus({
        success: false,
        message: 'Failed to clear posts',
        loading: false,
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <Link
            href="/admin/login"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login to Admin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">AH</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <RssIcon className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">RSS Feed Management</h1>
          </div>
          <p className="text-gray-600">
            Import content from external RSS feeds to keep your blog updated with fresh content.
          </p>
        </div>

        {/* Import Status */}
        {importStatus.message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            importStatus.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {importStatus.success ? (
                <CheckCircleIcon className="w-5 h-5 mr-2" />
              ) : (
                <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              )}
              <span>{importStatus.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configured Feeds */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Configured RSS Feeds</h2>
              <button
                onClick={() => triggerImport()}
                disabled={importStatus.loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importStatus.loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CloudArrowDownIcon className="w-4 h-4 mr-2" />
                )}
                Import All
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : feeds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <RssIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No RSS feeds configured</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feeds.map((feed, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{feed.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{feed.url}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                            {feed.category}
                          </span>
                          {feedCounts[feed.name] && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                              {feedCounts[feed.name]} posts imported
                            </span>
                          )}
                        </div>
                        {feed.maxItems && (
                          <p className="text-xs text-gray-400">Max items: {feed.maxItems}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => triggerImport(feed.url, feed.name)}
                          disabled={importStatus.loading}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <PlayIcon className="w-3 h-3 mr-1" />
                          Import
                        </button>
                        {feedCounts[feed.name] > 0 && (
                          <button
                            onClick={() => clearFeedPosts(feed.name)}
                            disabled={importStatus.loading}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            🗑️ Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Feed Import */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <PlusIcon className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Import Custom Feed</h2>
            </div>

            <form onSubmit={handleCustomImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feed Name
                </label>
                <input
                  type="text"
                  value={customFeed.name}
                  onChange={(e) => setCustomFeed(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Local News Source"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RSS Feed URL
                </label>
                <input
                  type="url"
                  value={customFeed.url}
                  onChange={(e) => setCustomFeed(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/rss"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={importStatus.loading || !customFeed.url || !customFeed.name}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importStatus.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CloudArrowDownIcon className="w-4 h-4 mr-2" />
                    Import Feed
                  </div>
                )}
              </button>
            </form>

            {/* Smart Filtering Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🧠 Smart Filtering</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 📝 Posts saved as drafts for review & editing</li>
                <li>• 🚨 Priority keywords bypass filters (breaking, urgent, etc.)</li>
                <li>• 🔄 Allows same story from different sources</li>
                <li>• ⏰ Re-imports updates after 24 hours</li>
                <li>• 🎯 Smart content similarity detection</li>
                <li>• 📈 Increased limits: 20 items per major feed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Smart RSS Filtering System */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">📡 Smart RSS Filtering System</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <div>
              <strong>🎯 Active Filtering:</strong>
              <ul className="mt-1 ml-4 space-y-1">
                <li>• <strong>Local Keywords:</strong> albuquerque, new mexico, nm, santa fe, rio rancho, las cruces</li>
                <li>• <strong>Priority Keywords:</strong> breaking, alert, urgent, update, developing, live, emergency</li>
                <li>• <strong>Excluded Keywords:</strong> advertisement, sponsored, classifieds, obituaries, horoscope, lottery</li>
              </ul>
            </div>
            <div>
              <strong>🔍 Smart Duplicate Detection:</strong>
              <ul className="mt-1 ml-4 space-y-1">
                <li>• Different sources can cover the same story</li>
                <li>• Stories can be re-imported after 12 hours for updates</li>
                <li>• 65% similarity threshold for content matching</li>
                <li>• Enhanced phrase detection for breaking news</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RSS Feed Output */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <NewspaperIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Your RSS Feed</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Share your blog content with readers using your RSS feed:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-800">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/rss` : '/api/rss'}
              </code>
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' ? `${window.location.origin}/api/rss` : '/api/rss'
                  navigator.clipboard.writeText(url)
                  alert('RSS feed URL copied to clipboard!')
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 