'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  FireIcon,
  TicketIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  location: string
  category: string
  price?: string
  image?: string
  organizer?: string
  capacity?: number
  attendees: number
  featured: boolean
  tags: string[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Events')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events || [])
        setFilteredEvents(data.events || [])
      } else {
        console.error('Error fetching events:', data.error)
        setEvents([])
        setFilteredEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
      setFilteredEvents([])
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'All Categories',
    'Arts & Culture',
    'Festival',
    'Food & Drink',
    'Holiday',
    'Music',
    'Sports',
    'Business',
    'Education',
  ]

  const timeframes = [
    'All Events',
    'This Week',
    'This Month',
    'Upcoming',
  ]

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Filter by time
    const now = new Date()
    if (timeFilter === 'today') {
      const today = now.toISOString().split('T')[0]
      filtered = filtered.filter(event =>
        event.startDate === today || (event.startDate <= today && event.endDate && event.endDate >= today)
      )
    } else if (timeFilter === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(event => 
        new Date(event.startDate) <= weekFromNow && (!event.endDate || new Date(event.endDate) >= now)
      )
    } else if (timeFilter === 'month') {
      const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(event => 
        new Date(event.startDate) <= monthFromNow && (!event.endDate || new Date(event.endDate) >= now)
      )
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedCategory, timeFilter])

  const featuredEvents = events.filter(event => event.featured)
  const upcomingEvents = filteredEvents.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-luckiest">
                    Albuquerque Hotspot
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">Your Local News Source</p>
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/news" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  News
                </Link>
                <Link href="/events" className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
                  Events
                </Link>
                <Link href="/food" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Food & Dining
                </Link>
                <Link href="/admin" className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-orange-700 transition-all shadow-md">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CalendarDaysIcon className="w-12 h-12 text-white mr-4" />
              <h1 className="text-5xl font-bold text-white font-luckiest">
                Events & Activities
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover exciting events happening in and around Albuquerque
            </p>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <StarIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Featured Events</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredEvents.slice(0, 3).map((event) => (
                <article key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                  {event.image && (
                    <div className="aspect-video relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          FEATURED
                        </span>
                      </div>
                      {event.price === 'Free' && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-purple-100 text-purple-600 rounded-full mr-2">
                        {event.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} 
                          {event.endDate && event.startDate !== event.endDate && 
                            ` - ${new Date(event.endDate).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {event.capacity && event.attendees && (
                        <div className="flex items-center text-sm text-gray-500">
                          <UserGroupIcon className="w-4 h-4 mr-1" />
                          <span>{event.attendees}/{event.capacity} attending</span>
                        </div>
                      )}
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Learn More
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 placeholder:text-gray-500 bg-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-purple-600 shadow' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-purple-600 shadow' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Upcoming Events</h2>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>{filteredEvents.length} events</span>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms or filters' : 'No events available at the moment'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <article key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                  {event.image && (
                    <div className="aspect-video relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.price === 'Free' && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-purple-100 text-purple-600 rounded-full mr-2">
                        {event.category}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {event.price}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} 
                          {event.endDate && event.startDate !== event.endDate && 
                            ` - ${new Date(event.endDate).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      View Details
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <article key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex flex-col md:flex-row">
                    {event.image && (
                      <div className="md:w-48 md:h-32 w-full h-48 flex-shrink-0 relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {event.price === 'Free' && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              FREE
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-bold bg-purple-100 text-purple-600 rounded-full mr-2">
                              {event.category}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                              {event.price}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center md:justify-end mb-1">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center md:justify-end">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                          {event.capacity && event.attendees && (
                            <>
                              <span className="mx-2">•</span>
                              <UserGroupIcon className="w-4 h-4 mr-1" />
                              <span>{event.attendees} attending</span>
                            </>
                          )}
                        </div>
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Details
                          <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <span className="text-2xl font-bold font-luckiest">Albuquerque Hotspot</span>
                  <p className="text-gray-400 text-sm">Your Local News Source</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connecting Albuquerque through local news, community stories, and events that matter to our city.
              </p>
              <div className="flex items-center text-gray-400">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>Albuquerque, New Mexico</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/news" className="block text-gray-400 hover:text-white transition-colors">Latest News</Link>
                <Link href="/events" className="block text-gray-400 hover:text-white transition-colors">Events</Link>
                <Link href="/food" className="block text-gray-400 hover:text-white transition-colors">Food & Dining</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>events@abqhotspot.com</p>
                <p>(505) 555-EVENT</p>
                <p>Follow us for updates</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 Albuquerque Hotspot. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 