import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Sample posts data for build-time generation
const samplePosts = [
  {
    slug: 'breaking-downtown-development',
    title: 'Major Downtown Albuquerque Development Breaks Ground',
    date: 'December 15, 2024',
    author: 'Maria Rodriguez',
    excerpt: 'A new mixed-use development in downtown ABQ promises to bring 200 jobs and revitalize the historic district with modern amenities while preserving the area\'s cultural heritage.',
    tags: ['Breaking News', 'Development', 'Downtown'],
    featured: true,
    content: `
# Major Downtown Albuquerque Development Breaks Ground

A transformative mixed-use development project broke ground this week in downtown Albuquerque, promising to bring significant economic opportunities and urban revitalization to the heart of the city.

## Project Overview

The **Plaza Esperanza** development will feature:

- **200 new jobs** across retail, hospitality, and professional services
- **Mixed-use spaces** combining residential, commercial, and office areas  
- **Historic preservation** elements maintaining the area's cultural character
- **Sustainable design** with LEED Gold certification goals

## Community Impact

"This project represents a major step forward for downtown Albuquerque," said Mayor Tim Keller. "We're creating opportunities while respecting our heritage."

### Economic Benefits
- $150 million total investment
- 500 construction jobs during build phase
- 200 permanent positions upon completion
- Increased property values in surrounding areas

### Cultural Preservation
The development incorporates elements of traditional southwestern architecture and will feature:
- Public art installations by local artists
- Cultural event spaces
- Historic facade preservation
- Native landscaping

## Timeline

Construction is expected to begin in January 2025, with phase one completion scheduled for late 2026. The project represents the largest downtown investment in over a decade.

The development is a partnership between local firm Southwest Development Group and national investor Heritage Capital Partners.
    `
  },
  {
    slug: 'green-chile-festival-record',
    title: 'Hatch Green Chile Festival Sets New Attendance Record',
    date: 'December 14, 2024',
    author: 'Carlos Mendoza',
    excerpt: 'This year\'s festival drew over 50,000 visitors from across the Southwest, celebrating New Mexico\'s signature crop with record-breaking crowds and sales.',
    tags: ['Events', 'Culture', 'Food'],
    content: `
# Hatch Green Chile Festival Sets New Attendance Record

The annual Hatch Green Chile Festival exceeded all expectations this year, drawing over 50,000 visitors and setting new records for both attendance and sales.

## Record-Breaking Numbers

This year's festival saw:
- **50,000+ attendees** (up 25% from last year)
- **$2.8 million in sales** for local vendors
- **150 vendors** participating
- **Zero major incidents** reported

## What Made This Year Special

### Perfect Weather
Ideal conditions throughout the weekend encouraged visitors to stay longer and explore more of what the festival had to offer.

### Expanded Offerings
- Live music performances on three stages
- Cooking demonstrations by celebrity chefs
- Children's activities and rides
- Arts and crafts from over 50 local artisans

### Record Chile Sales
Local farmers reported their best sales in festival history:
- **500,000 pounds** of green chile sold
- **$1.5 million** in direct farmer sales
- Orders from 45 states for shipping

## Community Impact

"The festival isn't just about celebrating our crop," said festival organizer Maria Santos. "It's about showcasing our community and supporting our local economy."

The festival's success provides crucial income for local farmers and businesses, with many vendors reporting they make 30-40% of their annual revenue during the three-day event.

## Looking Ahead

Plans are already underway for next year's festival, with organizers considering expanding to a four-day event to accommodate growing demand.
    `
  },
  {
    slug: 'sandia-peak-winter-activities',
    title: 'Sandia Peak Opens New Winter Recreation Trails',
    date: 'December 13, 2024',
    author: 'Jennifer Chen',
    excerpt: 'The Sandia Mountains now offer expanded winter activities including snowshoeing trails and a new sledding area, making outdoor winter fun more accessible to ABQ families.',
    tags: ['Recreation', 'Outdoors', 'Family'],
    content: `
# Sandia Peak Opens New Winter Recreation Trails

The Sandia Mountains are welcoming winter enthusiasts with expanded recreational opportunities, making outdoor winter activities more accessible to Albuquerque families than ever before.

## New Winter Offerings

Sandia Peak now features:

### Snowshoeing Trails
- **5 miles of groomed trails** for all skill levels
- **Equipment rental** available on-site
- **Guided tours** every weekend
- **Family-friendly routes** suitable for children

### Sledding Area
- **Dedicated sledding hill** with safety barriers
- **Warming hut** with hot cocoa and snacks
- **Sled rentals** available
- **Designated parking area**

### Cross-Country Skiing
- **8 miles of Nordic skiing trails**
- **Equipment rental and lessons**
- **Trail maps and difficulty ratings**

## Getting There

The winter recreation area is accessible via the Sandia Peak Tramway or by driving to the top via the scenic byway. Special winter shuttle service is available on weekends.

Operating hours are 9 AM to 4 PM daily, with extended hours until 6 PM on weekends.

## Safety First

All visitors are required to:
- Check weather conditions before visiting
- Dress appropriately for mountain weather
- Stay on designated trails
- Carry emergency supplies for backcountry activities

"We want families to enjoy the mountains safely," said Parks Director Sarah Martinez. "Our new facilities make winter recreation accessible while maintaining the natural beauty of the area."

## Pricing

- **Snowshoe rental**: $15/day
- **Sled rental**: $10/day
- **Guided tours**: $25/adult, $15/child
- **Parking**: Free with tramway ticket, $5 if driving up
    `
  }
]

export async function generateStaticParams() {
  // Generate params for all sample posts
  return samplePosts.map((post) => ({
    slug: post.slug,
  }))
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Simple markdown to HTML converter for basic formatting
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-luckiest text-gray-800 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-luckiest text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-luckiest text-gray-900 mb-6">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-600 hover:text-red-700 underline">$1</a>')
    
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-red-500 pl-4 italic text-gray-700 my-4">$1</blockquote>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br/>')
    
    // Wrap in paragraph tags
    .replace(/^(.)/gm, '<p class="mb-4">$1')
    .replace(/(.*)$/gm, '$1</p>')
    
    // Clean up extra paragraph tags around headers and lists
    .replace(/<p class="mb-4">(<h[1-6])/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p class="mb-4">(<li)/g, '$1')
    .replace(/(<\/li>)<\/p>/g, '$1')
    .replace(/<p class="mb-4">(<\/blockquote>)/g, '$1')
    .replace(/(<blockquote[^>]*>)<\/p>/g, '$1')
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = samplePosts.find(p => p.slug === resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-orange-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <div>
              <span className="font-luckiest text-gray-900 text-xl block leading-tight">
                Albuquerque Hotspot
              </span>
            </div>
          </Link>
          
          <Link 
            href="/" 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6">
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              🌵 {post.tags[0]}
            </span>
          </div>
          
          <h1 className="font-luckiest text-4xl md:text-6xl text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-white/90">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="font-bold text-lg">{post.author.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-lg">{post.author}</p>
                <p className="text-orange-100">{post.date}</p>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/30"></div>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-orange-100">📍 Albuquerque, NM</span>
              <span className="text-orange-100">⏱️ 5 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-200 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: markdownToHtml(post.content)
                }}
              />
            </div>
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="font-luckiest text-xl text-gray-900 mb-4">Tags</h4>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => {
                  const tagColors = [
                    'from-red-500 to-orange-500',
                    'from-orange-500 to-yellow-500',
                    'from-cyan-500 to-blue-500',
                    'from-purple-500 to-pink-500'
                  ]
                  return (
                    <span 
                      key={tag} 
                      className={`bg-gradient-to-r ${tagColors[index % tagColors.length]} text-white px-4 py-2 rounded-full text-sm font-bold`}
                    >
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  )
                })}
              </div>
            </div>
            
            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="font-luckiest text-xl text-gray-900 mb-4">Share this story</h4>
              <div className="flex space-x-4">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition-all">
                  📘 Facebook
                </button>
                <button className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-6 py-3 rounded-full font-bold hover:from-sky-500 hover:to-sky-600 transition-all">
                  🐦 Twitter
                </button>
                <button className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-full font-bold hover:from-gray-800 hover:to-gray-900 transition-all">
                  📧 Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="font-luckiest text-3xl text-gray-900 text-center mb-12">
          More from <span className="text-red-600">ABQ Hotspot</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {samplePosts.filter(p => p.slug !== post.slug).slice(0, 3).map((relatedPost) => (
            <article key={relatedPost.slug} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
                <span className="text-white text-6xl">📰</span>
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                    {relatedPost.tags[0]}
                </span>
                </div>
                <h3 className="font-luckiest text-lg text-gray-900 mb-3 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {relatedPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{relatedPost.date}</span>
                  <Link 
                    href={`/blog/${relatedPost.slug}`}
                    className="text-red-600 hover:text-red-700 text-sm font-bold"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <span className="font-luckiest text-2xl">Albuquerque Hotspot</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Your trusted source for local news, events, and stories that matter to our Albuquerque community.
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">&copy; 2024 Albuquerque Hotspot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 