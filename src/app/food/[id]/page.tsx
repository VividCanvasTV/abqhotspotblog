'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ShareIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string
  priceRange: string
  rating: number
  reviewCount: number
  address: string
  phone?: string
  hours?: string
  website?: string
  image?: string
  featured: boolean
  delivery: boolean
  takeout: boolean
  dineIn: boolean
  tags: string[]
  specialties: string[]
  createdAt: string
  updatedAt: string
}

interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user: {
    name: string
  }
}

export default function RestaurantPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  })

  const restaurantId = params?.id as string

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant()
      fetchReviews()
    }
  }, [restaurantId])

  const fetchRestaurant = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/restaurants/${restaurantId}`)
      
      if (response.ok) {
        const data = await response.json()
        setRestaurant(data)
      } else if (response.status === 404) {
        notFound()
      } else {
        console.error('Error fetching restaurant')
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`)
      
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setUserReview(data.userReview || null)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      alert('Please log in to leave a review')
      return
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: userReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      })

      if (response.ok) {
        setShowReviewForm(false)
        setReviewForm({ rating: 5, comment: '' })
        fetchReviews()
        fetchRestaurant() // Refresh to get updated rating
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    }
  }

  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    const stars = []
    
    for (let i = 1; i <= 5; i++) {
      const StarComponent = i <= rating ? StarIconSolid : StarIcon
      stars.push(
        <StarComponent
          key={i}
          className={`w-5 h-5 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
          onClick={() => interactive && onClick && onClick(i)}
        />
      )
    }
    
    return <div className="flex items-center space-x-1">{stars}</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!restaurant) {
    notFound()
  }

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
                <Link href="/events" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Events
                </Link>
                <Link href="/food" className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
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
            href="/food"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Restaurants
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Restaurant Image */}
            {restaurant.image && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg mb-8">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Restaurant Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-center mb-4">
                <span className="inline-block px-4 py-2 text-sm font-bold bg-orange-100 text-orange-600 rounded-full mr-4">
                  {restaurant.cuisine}
                </span>
                <span className="text-2xl font-bold text-gray-700">
                  {restaurant.priceRange}
                </span>
                {restaurant.featured && (
                  <span className="ml-4 inline-block px-4 py-2 text-sm font-bold bg-yellow-100 text-yellow-600 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-luckiest leading-tight">
                {restaurant.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {renderStars(restaurant.rating)}
                <span className="ml-3 text-lg font-medium text-gray-800">
                  {restaurant.rating} ({restaurant.reviewCount} {restaurant.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-800 text-lg leading-relaxed mb-8">
                {restaurant.description}
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-800">
                    <MapPinIcon className="w-5 h-5 mr-3 text-orange-600" />
                    <span>{restaurant.address}</span>
                  </div>

                  {restaurant.phone && (
                    <div className="flex items-center text-gray-800">
                      <PhoneIcon className="w-5 h-5 mr-3 text-orange-600" />
                      <a 
                        href={`tel:${restaurant.phone}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {restaurant.phone}
                      </a>
                    </div>
                  )}

                  {restaurant.hours && (
                    <div className="flex items-center text-gray-800">
                      <ClockIcon className="w-5 h-5 mr-3 text-orange-600" />
                      <span>{restaurant.hours}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {restaurant.website && (
                    <div className="flex items-center text-gray-800">
                      <GlobeAltIcon className="w-5 h-5 mr-3 text-orange-600" />
                      <a 
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-600 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    {restaurant.dineIn && (
                      <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                        <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                        Dine-In
                      </span>
                    )}
                    {restaurant.takeout && (
                      <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                        <ShoppingBagIcon className="w-4 h-4 mr-1" />
                        Takeout
                      </span>
                    )}
                    {restaurant.delivery && (
                      <span className="inline-flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                        <TruckIcon className="w-4 h-4 mr-1" />
                        Delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specialties */}
              {restaurant.specialties.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-block px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg border border-orange-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {restaurant.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
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

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                {session && !userReview && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={submitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {userReview ? 'Update Your Review' : 'Write a Review'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      {renderStars(reviewForm.rating, true, (rating) => 
                        setReviewForm(prev => ({ ...prev, rating }))
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment (optional)
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Share your experience..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        {userReview ? 'Update Review' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* User's Review */}
              {userReview && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">Your Review</h5>
                    <button
                      onClick={() => {
                        setReviewForm({
                          rating: userReview.rating,
                          comment: userReview.comment || '',
                        })
                        setShowReviewForm(true)
                      }}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center mb-2">
                    {renderStars(userReview.rating)}
                    <span className="ml-2 text-sm text-gray-700">
                      {new Date(userReview.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {userReview.comment && (
                    <p className="text-gray-800">{userReview.comment}</p>
                  )}
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {review.user.name[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{review.user.name}</span>
                        </div>
                        <span className="text-sm text-gray-700">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                      </div>
                      {review.comment && (
                        <p className="text-gray-800">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <StarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cuisine</span>
                  <span className="font-semibold text-gray-900">{restaurant.cuisine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold text-gray-900">{restaurant.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-orange-600">{restaurant.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold text-gray-900">{restaurant.reviewCount}</span>
                </div>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share Restaurant</h3>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: restaurant.name,
                      text: restaurant.description,
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
                Share this restaurant
              </button>
            </div>

            {/* Review CTA */}
            {session && !userReview && !showReviewForm && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <StarIcon className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Share Your Experience</h3>
                <p className="text-gray-700 mb-4">
                  Help others by sharing your dining experience at {restaurant.name}.
                </p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 