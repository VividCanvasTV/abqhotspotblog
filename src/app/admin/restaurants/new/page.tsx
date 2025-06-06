'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function NewRestaurantPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    priceRange: '$',
    address: '',
    phone: '',
    hours: '',
    website: '',
    image: '',
    featured: false,
    delivery: false,
    takeout: false,
    dineIn: true,
    specialties: [] as string[],
    tags: [] as string[],
  })
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }))
      setSpecialtyInput('')
    }
  }

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(specialty => specialty !== specialtyToRemove)
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Restaurant created successfully!')
        // Reset form
        setFormData({
          name: '',
          description: '',
          cuisine: '',
          priceRange: '$',
          address: '',
          phone: '',
          hours: '',
          website: '',
          image: '',
          featured: false,
          delivery: false,
          takeout: false,
          dineIn: true,
          tags: [],
          specialties: [],
        })
        setTagInput('')
        setSpecialtyInput('')
        
        // Redirect to restaurants admin page after a delay
        setTimeout(() => {
          router.push('/admin/restaurants')
        }, 1500)
      } else {
        toast.error(data.error || 'Failed to create restaurant')
      }
    } catch (error) {
      console.error('Error creating restaurant:', error)
      toast.error('Failed to create restaurant')
    } finally {
      setIsSubmitting(false)
    }
  }

  const cuisineOptions = [
    'New Mexican',
    'American',
    'Mexican',
    'Italian',
    'Asian',
    'Chinese',
    'Japanese',
    'Indian',
    'Thai',
    'Mediterranean',
    'French',
    'Seafood',
    'Steakhouse',
    'BBQ',
    'Fast Food',
    'Cafe',
    'Other',
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/restaurants"
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Restaurants
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-luckiest">
              Add New Restaurant
            </h1>
            <p className="text-gray-600 text-lg">
              Add a new dining establishment to the directory
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-orange-600" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-3">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-lg text-gray-900 placeholder-gray-500"
                    placeholder="Enter restaurant name..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-3">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="Describe the restaurant..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cuisine" className="block text-sm font-bold text-gray-800 mb-3">
                      Cuisine Type *
                    </label>
                    <select
                      id="cuisine"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 bg-white"
                      required
                    >
                      <option value="">Select cuisine type...</option>
                      {cuisineOptions.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priceRange" className="block text-sm font-bold text-gray-800 mb-3">
                      Price Range *
                    </label>
                    <select
                      id="priceRange"
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 bg-white"
                      required
                    >
                      <option value="$">$ - Budget ($1-15)</option>
                      <option value="$$">$$ - Moderate ($15-30)</option>
                      <option value="$$$">$$$ - Expensive ($30-60)</option>
                      <option value="$$$$">$$$$ - Very Expensive ($60+)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Contact & Location</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-gray-800 mb-3">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="Street address, city, state, zip..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="(505) 555-0123"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-bold text-gray-800 mb-3">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="https://restaurant.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hours" className="block text-sm font-bold text-gray-800 mb-3">
                    Hours of Operation
                  </label>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="11:00 AM - 10:00 PM"
                  />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Specialties</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                    placeholder="Add a specialty dish..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-orange-100 text-orange-800 border border-orange-200"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="ml-2 text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Save Restaurant</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-3 block text-sm font-bold text-gray-800">
                    Featured restaurant
                  </label>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {isSubmitting ? 'Creating...' : 'Create Restaurant'}
                </button>
              </div>
            </div>

            {/* Restaurant Image */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Restaurant Image</h3>
              <div className="space-y-4">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Image URL..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                />
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Restaurant"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <PhotoIcon className="w-5 h-5 mr-2" />
                  Upload Image
                </button>
              </div>
            </div>

            {/* Service Options */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Service Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dineIn"
                    name="dineIn"
                    checked={formData.dineIn}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dineIn" className="ml-3 block text-sm text-gray-800">
                    Dine-in
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="takeout"
                    name="takeout"
                    checked={formData.takeout}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="takeout" className="ml-3 block text-sm text-gray-800">
                    Takeout
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="delivery"
                    name="delivery"
                    checked={formData.delivery}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="delivery" className="ml-3 block text-sm text-gray-800">
                    Delivery
                  </label>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tags</h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 