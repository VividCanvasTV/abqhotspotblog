'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  CogIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  BellIcon,
  UserIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

interface Settings {
  // General Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  timezone: string
  language: string
  
  // SEO Settings
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  googleAnalytics: string
  facebookPixel: string
  
  // Appearance Settings
  theme: string
  primaryColor: string
  postsPerPage: number
  showFeaturedPosts: boolean
  showAuthorInfo: boolean
  
  // Security Settings
  requireApproval: boolean
  allowRegistration: boolean
  passwordMinLength: number
  twoFactorAuth: boolean
  
  // Email Settings
  emailProvider: string
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  
  // Notification Settings
  emailNotifications: boolean
  commentNotifications: boolean
  userRegistrationNotifications: boolean
  systemUpdateNotifications: boolean
}

const defaultSettings: Settings = {
  // General Settings
  siteName: 'ABQ Hotspot News',
  siteDescription: 'Your trusted source for Albuquerque news and events',
  siteUrl: 'https://abqhotspot.news',
  adminEmail: 'admin@abqhotspot.news',
  timezone: 'America/Denver',
  language: 'en',
  
  // SEO Settings
  seoTitle: 'ABQ Hotspot News - Albuquerque News & Events',
  seoDescription: 'Stay updated with the latest news, events, and happenings in Albuquerque, New Mexico',
  seoKeywords: 'Albuquerque, New Mexico, news, events, local',
  googleAnalytics: '',
  facebookPixel: '',
  
  // Appearance Settings
  theme: 'light',
  primaryColor: '#dc2626',
  postsPerPage: 10,
  showFeaturedPosts: true,
  showAuthorInfo: true,
  
  // Security Settings
  requireApproval: false,
  allowRegistration: false,
  passwordMinLength: 8,
  twoFactorAuth: false,
  
  // Email Settings
  emailProvider: 'smtp',
  smtpHost: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  
  // Notification Settings
  emailNotifications: true,
  commentNotifications: true,
  userRegistrationNotifications: true,
  systemUpdateNotifications: true,
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('abq-hotspot-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'seo', name: 'SEO', icon: GlobeAltIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ]

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('abq-hotspot-settings', JSON.stringify(settings))
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Site Name *
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange('siteName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Site URL *
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Admin Email *
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
          >
            <option value="America/Denver">Mountain Time (Denver)</option>
            <option value="America/New_York">Eastern Time (New York)</option>
            <option value="America/Chicago">Central Time (Chicago)</option>
            <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          SEO Title
        </label>
        <input
          type="text"
          value={settings.seoTitle}
          onChange={(e) => handleSettingChange('seoTitle', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          SEO Description
        </label>
        <textarea
          value={settings.seoDescription}
          onChange={(e) => handleSettingChange('seoDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          SEO Keywords
        </label>
        <input
          type="text"
          value={settings.seoKeywords}
          onChange={(e) => handleSettingChange('seoKeywords', e.target.value)}
          placeholder="Separate keywords with commas"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={settings.googleAnalytics}
            onChange={(e) => handleSettingChange('googleAnalytics', e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            value={settings.facebookPixel}
            onChange={(e) => handleSettingChange('facebookPixel', e.target.value)}
            placeholder="123456789012345"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            Posts Per Page
          </label>
          <input
            type="number"
            value={settings.postsPerPage}
            onChange={(e) => handleSettingChange('postsPerPage', parseInt(e.target.value))}
            min="1"
            max="50"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="showFeaturedPosts"
            checked={settings.showFeaturedPosts}
            onChange={(e) => handleSettingChange('showFeaturedPosts', e.target.checked)}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="showFeaturedPosts" className="ml-3 block text-sm font-bold text-gray-800">
            Show featured posts section on homepage
          </label>
        </div>
        <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="showAuthorInfo"
            checked={settings.showAuthorInfo}
            onChange={(e) => handleSettingChange('showAuthorInfo', e.target.checked)}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="showAuthorInfo" className="ml-3 block text-sm font-bold text-gray-800">
            Show author information on posts
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Minimum Password Length
        </label>
        <input
          type="number"
          value={settings.passwordMinLength}
          onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
          min="6"
          max="20"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="requireApproval"
            checked={settings.requireApproval}
            onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="requireApproval" className="ml-3 block text-sm font-bold text-gray-800">
            Require admin approval for new posts
          </label>
        </div>
        <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="allowRegistration"
            checked={settings.allowRegistration}
            onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="allowRegistration" className="ml-3 block text-sm font-bold text-gray-800">
            Allow user registration
          </label>
        </div>
        <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorAuth" className="ml-3 block text-sm font-bold text-gray-800">
            Enable two-factor authentication
          </label>
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Email Provider
        </label>
        <select
          value={settings.emailProvider}
          onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 bg-white"
        >
          <option value="smtp">SMTP</option>
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
          <option value="ses">Amazon SES</option>
        </select>
      </div>
      {settings.emailProvider === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              SMTP Host
            </label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
              placeholder="587"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUsername}
              onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="emailNotifications"
          checked={settings.emailNotifications}
          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="emailNotifications" className="ml-3 block text-sm font-bold text-gray-800">
          Enable email notifications
        </label>
      </div>
      <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="commentNotifications"
          checked={settings.commentNotifications}
          onChange={(e) => handleSettingChange('commentNotifications', e.target.checked)}
          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="commentNotifications" className="ml-3 block text-sm font-bold text-gray-800">
          Notify on new comments
        </label>
      </div>
      <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="userRegistrationNotifications"
          checked={settings.userRegistrationNotifications}
          onChange={(e) => handleSettingChange('userRegistrationNotifications', e.target.checked)}
          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="userRegistrationNotifications" className="ml-3 block text-sm font-bold text-gray-800">
          Notify on new user registrations
        </label>
      </div>
      <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <input
          type="checkbox"
          id="systemUpdateNotifications"
          checked={settings.systemUpdateNotifications}
          onChange={(e) => handleSettingChange('systemUpdateNotifications', e.target.checked)}
          className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="systemUpdateNotifications" className="ml-3 block text-sm font-bold text-gray-800">
          Notify on system updates
        </label>
      </div>
    </div>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'seo':
        return renderSEOSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'security':
        return renderSecuritySettings()
      case 'email':
        return renderEmailSettings()
      case 'notifications':
        return renderNotificationSettings()
      default:
        return renderGeneralSettings()
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
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
          Settings
        </h1>
        <p className="text-gray-600 text-lg">
          Configure your site settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? 'bg-red-50 text-red-700 border-2 border-red-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-red-700 border-2 border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name} Settings
              </h2>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Save Changes
              </button>
            </div>

            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  )
} 