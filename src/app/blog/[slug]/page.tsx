import Link from 'next/link'
import Image from 'next/image'
import { getPostData, getAllPostSlugs } from '@/lib/posts'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map(({ params }) => ({ slug: params.slug }))
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostData(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-orange-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/images/TheHotspotABQNews.svg"
              alt="The Hotspot ABQ News"
              width={60}
              height={60}
              className="w-15 h-15"
            />
            <div>
              <span className="font-luckiest text-gray-900 text-xl block leading-tight">
                Albuquerque Hotspot News
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
          {[1, 2, 3].map((item) => (
            <article key={item} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📰</span>
                  </div>
                  <h3 className="font-luckiest text-white text-lg px-4">Related ABQ Story #{item}</h3>
                </div>
              </div>
              <div className="p-6">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Local News
                </span>
                <h4 className="font-luckiest text-lg text-gray-900 mt-4 mb-3">
                  Another great story from the Duke City
                </h4>
                <p className="text-gray-600 text-sm">
                  Discover more stories that matter to the ABQ community...
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <Image
              src="/images/TheHotspotABQNews.svg"
              alt="The Hotspot ABQ News"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <div className="text-left">
              <h3 className="font-luckiest text-3xl">Albuquerque Hotspot News</h3>
              <p className="text-orange-100">Where the high desert meets high energy</p>
            </div>
          </div>
          <p className="text-orange-100 text-lg mb-4">
            🌵 Your source for everything ABQ — from breaking news to green chile reviews 🌶️
          </p>
          <p className="text-orange-200 text-sm">
            © {new Date().getFullYear()} Albuquerque Hotspot News. Made with ❤️ in the Land of Enchantment
          </p>
        </div>
      </footer>
    </div>
  )
} 