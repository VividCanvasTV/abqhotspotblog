'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ChevronRightIcon,
  FireIcon,
  HeartIcon,
  TruckIcon,
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
  image?: string
  featured: boolean
  delivery: boolean
  takeout: boolean
  dineIn: boolean
  tags: string[]
  specialties: string[]
  website?: string
}

export default function FoodPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('rating')
  const [filterOptions, setFilterOptions] = useState({
    delivery: false,
    takeout: false,
    dineIn: false,
    featured: false,
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/restaurants?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setRestaurants(data.restaurants || [])
        setFilteredRestaurants(data.restaurants || [])
      } else {
        console.error('Error fetching restaurants:', data.error)
        setRestaurants([])
        setFilteredRestaurants([])
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      setRestaurants([])
      setFilteredRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  const cuisineTypes = [
    'All Cuisines',
    'New Mexican',
    'American',
    'Contemporary American',
    'New Mexican Fusion',
    'Mexican',
    'Italian',
    'Asian',
    'Mediterranean',
    'BBQ',
    'Steakhouse',
  ]

  const priceRanges = [
    'All Prices',
    '$',
    '$$',
    '$$$',
    '$$$$',
  ]

  useEffect(() => {
    let filtered = restaurants

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        restaurant.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by cuisine
    if (selectedCuisine !== 'All Cuisines') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine)
    }

    // Filter by price range
    if (selectedPriceRange !== 'All Prices') {
      filtered = filtered.filter(restaurant => restaurant.priceRange === selectedPriceRange)
    }

    // Filter by options
    if (filterOptions.delivery) {
      filtered = filtered.filter(restaurant => restaurant.delivery)
    }
    if (filterOptions.takeout) {
      filtered = filtered.filter(restaurant => restaurant.takeout)
    }
    if (filterOptions.dineIn) {
      filtered = filtered.filter(restaurant => restaurant.dineIn)
    }
    if (filterOptions.featured) {
      filtered = filtered.filter(restaurant => restaurant.featured)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'reviews':
          return b.reviewCount - a.reviewCount
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          const priceOrder = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 }
          return priceOrder[a.priceRange as keyof typeof priceOrder] - priceOrder[b.priceRange as keyof typeof priceOrder]
        default:
          return 0
      }
    })

    setFilteredRestaurants(filtered)
  }, [restaurants, searchTerm, selectedCuisine, selectedPriceRange, sortBy, filterOptions])

  const featuredRestaurants = restaurants.filter(restaurant => restaurant.featured)

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <StarIconSolid className="w-4 h-4 text-yellow-400 absolute top-0 left-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      )
    }

    return stars
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

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BuildingStorefrontIcon className="w-12 h-12 text-white mr-4" />
              <h1 className="text-5xl font-bold text-white font-luckiest">
                Food & Dining
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover the best restaurants, cafes, and dining experiences in Albuquerque
            </p>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <FireIcon className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 font-luckiest">Featured Restaurants</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredRestaurants.slice(0, 3).map((restaurant) => (
                <article key={restaurant.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                  {restaurant.image && (
                    <div className="aspect-video relative">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          FEATURED
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {restaurant.delivery && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                            <TruckIcon className="w-3 h-3 mr-1" />
                            Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-orange-100 text-orange-600 rounded-full">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-lg font-bold text-gray-700">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-3">
                        {renderStars(restaurant.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {restaurant.rating} ({restaurant.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        <span>{restaurant.hours}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.specialties.slice(0, 2).map((specialty) => (
                        <span key={specialty} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {restaurant.dineIn && (
                          <span className="text-xs text-green-600 font-medium">Dine-In</span>
                        )}
                        {restaurant.takeout && (
                          <span className="text-xs text-blue-600 font-medium">Takeout</span>
                        )}
                        {restaurant.delivery && (
                          <span className="text-xs text-purple-600 font-medium">Delivery</span>
                        )}
                      </div>
                      <Link
                        href={`/food/${restaurant.id}`}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        View Details
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
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  >
                    {cuisineTypes.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  >
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="name">Name A-Z</option>
                    <option value="price">Price Low to High</option>
                  </select>
                </div>

                {/* Service Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Options</label>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterOptions.delivery}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, delivery: e.target.checked }))}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterOptions.takeout}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, takeout: e.target.checked }))}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Takeout</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-luckiest">All Restaurants</h2>
            <div className="flex items-center text-gray-600">
              <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
              <span>{filteredRestaurants.length} restaurants</span>
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms or filters' : 'No restaurants available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <article key={restaurant.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
                  {restaurant.image && (
                    <div className="aspect-video relative">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-1">
                        {restaurant.delivery && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Delivery
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-orange-100 text-orange-600 rounded-full">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-lg font-bold text-gray-700">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {renderStars(restaurant.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {restaurant.rating} ({restaurant.reviewCount})
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        <span>{restaurant.hours}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {restaurant.dineIn && (
                          <span className="text-xs text-green-600 font-medium">Dine-In</span>
                        )}
                        {restaurant.takeout && (
                          <span className="text-xs text-blue-600 font-medium">Takeout</span>
                        )}
                      </div>
                      <Link
                        href={`/food/${restaurant.id}`}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        View Details
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </Link>
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
                <p>food@abqhotspot.com</p>
                <p>(505) 555-FOOD</p>
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