import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, ClockIcon, TagIcon, ShareIcon, UserIcon } from '@heroicons/react/24/outline'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: { name: true, avatar: true, email: true }
        },
        category: true,
        tags: true,
      },
    })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Simple markdown to HTML converter for basic formatting
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-800 mt-8 mb-4 font-luckiest">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-5 font-luckiest">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-6 font-luckiest">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-600 hover:text-red-700 underline font-medium">$1</a>')
    
    // Line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.trim().startsWith('<h') || paragraph.trim() === '') {
        return paragraph
      }
      return `<p class="mb-6 text-gray-800 leading-relaxed text-lg">${paragraph.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')
}

async function getRelatedPosts(currentSlug: string, categoryId?: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        slug: { not: currentSlug },
        status: 'PUBLISHED',
        ...(categoryId && { categoryId }),
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: true,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    })
    return posts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.categoryId || undefined)
  const formattedContent = formatContent(post.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">AH</span>
                </div>
                <div>
                  <Link href="/" className="text-2xl font-bold text-gray-900 font-luckiest hover:text-red-600 transition-colors">
                    Albuquerque Hotspot
                  </Link>
                  <p className="text-xs text-gray-600 font-medium">Your Local News Source</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/news" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  News
                </Link>
                <Link href="/events" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  Events
                </Link>
                <Link href="/food" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 border border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-white/90 hover:text-white font-medium group transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wide border border-white/30">
                📰 {post.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-luckiest text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed max-w-4xl font-light">
              {post.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-white/90">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">{post.author.name}</p>
                <div className="flex items-center text-orange-100 text-sm">
                  <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
                    {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="mx-2">•</span>
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8 md:p-12">
                <div 
                  className="prose prose-lg prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-luckiest text-xl text-gray-900">Share this story</h4>
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Facebook
                      </button>
                      <button className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Twitter
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Bio */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-luckiest text-lg text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {post.author.name?.[0] || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-600">Staff Writer</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Bringing you the latest news and stories from around Albuquerque.
              </p>
            </div>

            {/* All Tags */}
            {post.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-luckiest text-lg text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-luckiest text-lg mb-3">Stay Updated</h3>
              <p className="text-sm mb-4 text-white/90">
                Get the latest ABQ news delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm"
                />
                <button className="w-full bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="font-luckiest text-3xl text-gray-900 mb-4">
              More from <span className="text-red-600">ABQ Hotspot</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover more stories that matter to our Albuquerque community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center relative overflow-hidden">
                  {relatedPost.featuredImage ? (
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-white text-6xl">📰</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                      {relatedPost.category?.name || 'News'}
                    </span>
                  </div>
                  <h3 className="font-luckiest text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(relatedPost.publishedAt!).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/posts/${relatedPost.slug}`}
                      className="text-red-600 hover:text-red-700 text-sm font-bold group-hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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