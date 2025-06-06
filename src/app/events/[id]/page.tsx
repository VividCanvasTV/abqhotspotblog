'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  ShareIcon,
  HeartIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

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
  createdAt: string
  updatedAt: string
}

export default function EventPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAttending, setIsAttending] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  const eventId = params?.id as string

  useEffect(() => {
    if (eventId) {
      fetchEvent()
      if (session) {
        checkAttendance()
      }
    }
  }, [eventId, session])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${eventId}`)
      
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else if (response.status === 404) {
        notFound()
      } else {
        console.error('Error fetching event')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAttendance = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/attendance`)
      if (response.ok) {
        const data = await response.json()
        setIsAttending(data.isAttending)
      }
    } catch (error) {
      console.error('Error checking attendance:', error)
    }
  }

  const toggleAttendance = async () => {
    if (!session) {
      alert('Please log in to mark attendance')
      return
    }

    setAttendanceLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/attendance`, {
        method: isAttending ? 'DELETE' : 'POST',
      })

      if (response.ok) {
        setIsAttending(!isAttending)
        // Refresh event data to get updated attendance count
        fetchEvent()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update attendance')
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      alert('Failed to update attendance')
    } finally {
      setAttendanceLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const isEventPast = new Date(event.startDate) < new Date()
  const isFull = Boolean(event.capacity && event.attendees >= event.capacity)

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.image && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg mb-8">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-center mb-4">
                <span className="inline-block px-4 py-2 text-sm font-bold bg-purple-100 text-purple-600 rounded-full mr-4">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="inline-block px-4 py-2 text-sm font-bold bg-yellow-100 text-yellow-600 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6 font-luckiest leading-tight">
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-800">
                    <CalendarIcon className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <p className="font-medium">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {event.endDate && event.startDate !== event.endDate && (
                        <p className="text-sm text-gray-700">
                          to {new Date(event.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-800">
                    <ClockIcon className="w-5 h-5 mr-3 text-purple-600" />
                    <span>
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-800">
                    <MapPinIcon className="w-5 h-5 mr-3 text-purple-600" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {event.price && (
                    <div className="flex items-center text-gray-800">
                      <CurrencyDollarIcon className="w-5 h-5 mr-3 text-purple-600" />
                      <span className="font-medium">{event.price}</span>
                    </div>
                  )}

                  {event.organizer && (
                    <div className="flex items-center text-gray-800">
                      <BuildingOfficeIcon className="w-5 h-5 mr-3 text-purple-600" />
                      <span>{event.organizer}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-800">
                    <UserGroupIcon className="w-5 h-5 mr-3 text-purple-600" />
                    <span>
                      {event.attendees} attending
                      {event.capacity && ` of ${event.capacity}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attendance Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance</h3>
              
              {session ? (
                <div className="space-y-4">
                  <button
                    onClick={toggleAttendance}
                    disabled={attendanceLoading || isEventPast || isFull}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      isAttending
                        ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    } ${
                      (isEventPast || isFull) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-lg'
                    }`}
                  >
                    {attendanceLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    ) : isAttending ? (
                      <HeartIconSolid className="w-5 h-5 mr-2" />
                    ) : (
                      <HeartIcon className="w-5 h-5 mr-2" />
                    )}
                    {isEventPast
                      ? 'Event has ended'
                      : isFull
                      ? 'Event is full'
                      : isAttending
                      ? 'You\'re attending!'
                      : 'Mark as attending'
                    }
                  </button>
                  
                  <div className="text-center text-sm text-gray-800">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-800">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                  </div>
                  <Link
                    href="/login"
                    className="block w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
                  >
                    Log in to attend
                  </Link>
                </div>
              )}
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Event</h3>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share this event
              </button>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-800">Created</span>
                  <span className="font-medium">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Category</span>
                  <span className="font-medium">{event.category}</span>
                </div>
                {event.capacity && (
                  <div className="flex justify-between">
                    <span className="text-gray-800">Capacity</span>
                    <span className="font-medium">{event.capacity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 