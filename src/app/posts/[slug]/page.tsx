import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PostPageProps {
  params: {
    slug: string
  }
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

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug)
  
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
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-hotspot-red rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AH</span>
                </div>
                <Link href="/" className="text-xl font-bold text-gray-900 font-luckiest hover:text-hotspot-red">
                  Albuquerque Hotspot
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/news" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  News
                </Link>
                <Link href="/events" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Events
                </Link>
                <Link href="/food" className="text-gray-500 hover:text-hotspot-red px-3 py-2 rounded-md text-sm font-medium">
                  Food
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-hotspot-red hover:text-red-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-hotspot-red text-white rounded-full">
                {post.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-luckiest leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-lg font-medium text-gray-700">
                  {post.author.name?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{post.author.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <time dateTime={post.publishedAt!}>
                    {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => {
              // Handle markdown-style headers
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4 font-luckiest">
                    {paragraph.substring(2)}
                  </h1>
                )
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h2>
                )
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">
                    {paragraph.substring(4)}
                  </h3>
                )
              }
              
              // Handle bold text
              const boldText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              
              // Handle empty lines
              if (paragraph.trim() === '') {
                return <br key={index} />
              }
              
              // Regular paragraphs
              return (
                <p 
                  key={index} 
                  className="mb-4 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: boldText }}
                />
              )
            })}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-medium text-gray-700">
                  {post.author.name?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{post.author.name}</p>
                <p className="text-gray-600">Contributing Writer</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-hotspot-red text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Read More Stories
            </Link>
          </div>
        </footer>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-hotspot-red rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AH</span>
              </div>
              <span className="text-xl font-bold font-luckiest">Albuquerque Hotspot</span>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            <p>&copy; 2024 Albuquerque Hotspot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 