'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  MegaphoneIcon,
  PlusIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'

interface TickerItem {
  id: string
  text: string
  priority: 'BREAKING' | 'URGENT' | 'UPDATE' | 'NEWS'
  isActive: boolean
  createdAt: string
}

export default function TickerSettingsPage() {
  const { data: session } = useSession()
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [newItemText, setNewItemText] = useState('')
  const [newItemPriority, setNewItemPriority] = useState<'BREAKING' | 'URGENT' | 'UPDATE' | 'NEWS'>('NEWS')
  const [tickerSettings, setTickerSettings] = useState({
    enabled: true,
    speed: 'normal',
    backgroundColor: 'red',
    textColor: 'white',
  })
  const [previewText, setPreviewText] = useState('')

  useEffect(() => {
    fetchTickerItems()
    generatePreview()
  }, [tickerItems])

  const fetchTickerItems = async () => {
    try {
      // Mock data - replace with actual API call
      const mockItems: TickerItem[] = [
        {
          id: '1',
          text: '🚨 BREAKING: City Council approves new downtown development project',
          priority: 'BREAKING',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: '⚡ URGENT: Traffic alert on I-25 northbound near Montgomery',
          priority: 'URGENT',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          text: '🌟 NEW: Local restaurant wins national culinary award',
          priority: 'UPDATE',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ]
      setTickerItems(mockItems)
    } catch (error) {
      console.error('Error fetching ticker items:', error)
    }
  }

  const generatePreview = () => {
    const activeItems = tickerItems.filter(item => item.isActive)
    setPreviewText(activeItems.map(item => item.text).join(' • '))
  }

  const handleAddItem = async () => {
    if (!newItemText.trim()) return

    const newItem: TickerItem = {
      id: Date.now().toString(),
      text: newItemText,
      priority: newItemPriority,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    try {
      // Replace with actual API call
      setTickerItems([...tickerItems, newItem])
      setNewItemText('')
      setNewItemPriority('NEWS')
    } catch (error) {
      console.error('Error adding ticker item:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this ticker item?')) {
      try {
        // Replace with actual API call
        setTickerItems(tickerItems.filter(item => item.id !== id))
      } catch (error) {
        console.error('Error deleting ticker item:', error)
      }
    }
  }

  const handleToggleItem = async (id: string) => {
    try {
      // Replace with actual API call
      setTickerItems(tickerItems.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ))
    } catch (error) {
      console.error('Error toggling ticker item:', error)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'BREAKING': return '🚨'
      case 'URGENT': return '⚡'
      case 'UPDATE': return '📈'
      case 'NEWS': return '📰'
      default: return '📰'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'BREAKING': return 'bg-red-100 text-red-800 border-red-200'
      case 'URGENT': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'NEWS': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-luckiest">Breaking News Ticker</h1>
          <p className="text-gray-600 mt-2">Manage scrolling news ticker settings and content</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            tickerSettings.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {tickerSettings.enabled ? (
              <PlayIcon className="w-4 h-4 mr-2" />
            ) : (
              <PauseIcon className="w-4 h-4 mr-2" />
            )}
            <span className="font-medium">
              {tickerSettings.enabled ? 'LIVE' : 'DISABLED'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MegaphoneIcon className="w-5 h-5 mr-2" />
            Live Preview
          </h3>
        </div>
        <div className="p-6">
          <div className={`${
            tickerSettings.backgroundColor === 'red' ? 'bg-gradient-to-r from-red-600 to-red-700' :
            tickerSettings.backgroundColor === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
            'bg-gradient-to-r from-gray-600 to-gray-700'
          } text-white py-3 overflow-hidden relative rounded-lg`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-50"></div>
            <div className="px-4 relative z-10">
              <div className="flex items-center">
                <div className="flex items-center bg-black/20 px-4 py-1 rounded-full mr-4 shadow-lg">
                  <MegaphoneIcon className="w-4 h-4 mr-2 animate-pulse" />
                  <span className="font-bold text-sm">BREAKING</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className={`whitespace-nowrap font-medium ${
                    tickerSettings.speed === 'fast' ? 'animate-marquee-fast' :
                    tickerSettings.speed === 'slow' ? 'animate-marquee-slow' :
                    'animate-marquee'
                  }`}>
                    {previewText || 'No active ticker items'}
                  </div>
                </div>
                <div className="ml-4 text-gray-200 text-sm">
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            Ticker Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={tickerSettings.enabled}
                    onChange={() => setTickerSettings(prev => ({ ...prev, enabled: true }))}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enabled</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!tickerSettings.enabled}
                    onChange={() => setTickerSettings(prev => ({ ...prev, enabled: false }))}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disabled</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed</label>
              <select
                value={tickerSettings.speed}
                onChange={(e) => setTickerSettings(prev => ({ ...prev, speed: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="slow">Slow (40s)</option>
                <option value="normal">Normal (30s)</option>
                <option value="fast">Fast (20s)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <select
                value={tickerSettings.backgroundColor}
                onChange={(e) => setTickerSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="red">Red (Breaking News)</option>
                <option value="blue">Blue (General News)</option>
                <option value="gray">Gray (Updates)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add New Item */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Ticker Item
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newItemPriority}
                onChange={(e) => setNewItemPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="BREAKING">🚨 Breaking News</option>
                <option value="URGENT">⚡ Urgent</option>
                <option value="UPDATE">📈 Update</option>
                <option value="NEWS">📰 News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ticker Text</label>
              <textarea
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Enter breaking news text..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>

            <button
              onClick={handleAddItem}
              disabled={!newItemText.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Ticker
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Items List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ticker Items</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage all ticker items. Only active items will appear in the ticker.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tickerItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <MegaphoneIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ticker items</h3>
                    <p className="text-gray-500">Add your first ticker item to get started</p>
                  </td>
                </tr>
              ) : (
                tickerItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.isActive ? (
                          <PlayIcon className="w-3 h-3 mr-1" />
                        ) : (
                          <PauseIcon className="w-3 h-3 mr-1" />
                        )}
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {getPriorityIcon(item.priority)} {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {item.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete Item"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 