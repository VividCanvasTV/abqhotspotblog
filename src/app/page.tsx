import Image from "next/image";
import Link from "next/link";
import { getSortedPostsData, type PostMetadata } from "@/lib/posts";

export default function Home() {
  const allPostsData: PostMetadata[] = getSortedPostsData();
  const featuredPost = allPostsData[0]; 
  const otherPosts = allPostsData.slice(1, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-orange-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Image
              src="/images/TheHotspotABQNews.svg"
              alt="The Hotspot ABQ News"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <div>
              <span className="font-luckiest text-gray-900 text-2xl block leading-tight">
                Albuquerque Hotspot News
              </span>
            </div>
            <div className="bg-gradient-to-r from-turquoise-400 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
              Blog
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-700 hover:text-red-600 font-semibold transition-colors relative group">
              Local News
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors relative group">
              Business
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-gray-700 hover:text-cyan-600 font-semibold transition-colors relative group">
              Culture
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-600 font-semibold transition-colors relative group">
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Subscribe Button */}
          <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Subscribe
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 text-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-red-400"></div>
          <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-orange-400"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 rounded-full bg-cyan-400"></div>
          <div className="absolute bottom-40 right-16 w-14 h-14 rounded-full bg-yellow-400"></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
              🌵 Our blog
            </span>
          </div>
          <h1 className="font-luckiest text-6xl md:text-7xl lg:text-8xl mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Stories
            </span>
            <br />
            <span className="text-gray-800">& ideas</span>
          </h1>
          <p className="text-gray-700 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            The pulse of <span className="text-red-600 font-bold">Albuquerque</span> — from the Sandias to the Rio Grande
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post - Left Side (2/3 width) */}
          {featuredPost && (
            <div className="lg:col-span-2">
              <article className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-orange-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
                {/* Featured Post Image */}
                <div className="h-80 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative Southwest pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white transform rotate-45"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                    <div className="absolute bottom-4 left-8 w-10 h-4 bg-white/50 rounded-full"></div>
                    <div className="absolute bottom-8 right-8 w-4 h-8 bg-white/30 rounded-full transform rotate-12"></div>
                  </div>
                  <div className="relative z-10 text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <span className="text-4xl">🏜️</span>
                    </div>
                    <h2 className="font-luckiest text-white text-2xl drop-shadow-lg">Featured in ABQ</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* Category Tag and Read Time */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                      🌶️ {featuredPost.tags[0] || 'Hot News'}
                    </span>
                    <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                      ⏱️ 5 min read
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-luckiest text-4xl text-gray-900 mb-6 leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-red-600 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h3>

                  {/* Author Info */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-luckiest text-lg">
                        {featuredPost.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-lg">{featuredPost.author}</p>
                      <p className="text-gray-600 font-medium">📅 {featuredPost.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Other Posts - Right Side (1/3 width) */}
          <div className="space-y-6">
            {otherPosts.map((post, index) => {
              // Southwest-inspired category themes
              const themes = [
                { bg: 'from-red-500 to-pink-500', emoji: '🌵', category: 'Local Buzz' },
                { bg: 'from-orange-500 to-yellow-500', emoji: '🏜️', category: 'Desert Biz' },
                { bg: 'from-cyan-500 to-blue-500', emoji: '🎨', category: 'Art Scene' }
              ];
              const theme = themes[index % themes.length];
              
              return (
                <article key={post.slug} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Post Image */}
                  <div className={`h-36 bg-gradient-to-br ${theme.bg} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">{theme.emoji}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category and Read Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`bg-gradient-to-r ${theme.bg} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {theme.category}
                      </span>
                      <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        3 min
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-luckiest text-lg text-gray-900 mb-4 leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-red-600 transition-colors">
                        {post.title}
                      </Link>
                    </h4>

                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className={`w-8 h-8 bg-gradient-to-br ${theme.bg} rounded-full flex items-center justify-center mr-3 shadow-md`}>
                        <span className="text-white font-bold text-xs">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{post.author}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Blog Posts Section */}
      <section className="bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 py-20 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-luckiest text-5xl text-white mb-4">
              All the <span className="text-yellow-400">ABQ</span> stories
            </h2>
            <p className="text-gray-300 text-xl">From the Duke City to you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPostsData.map((post, index) => {
              const themes = [
                { bg: 'from-red-500 to-pink-500', accent: 'red' },
                { bg: 'from-orange-500 to-yellow-500', accent: 'orange' },
                { bg: 'from-cyan-500 to-blue-500', accent: 'cyan' },
                { bg: 'from-purple-500 to-pink-500', accent: 'purple' }
              ];
              const theme = themes[index % themes.length];
              
              return (
                <article key={post.slug} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
                  {/* Post Image */}
                  <div className={`h-48 bg-gradient-to-br ${theme.bg} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                        <span className="text-2xl">📰</span>
                      </div>
                      <h3 className="font-luckiest text-white text-sm px-4 drop-shadow-lg">{post.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category */}
                    <div className="mb-4">
                      <span className={`bg-gradient-to-r ${theme.bg} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {post.tags[0] || ['Breaking', 'Featured', 'Trending', 'Local'][index % 4]}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-luckiest text-xl text-gray-900 mb-3 leading-tight">
                      <Link href={`/blog/${post.slug}`} className={`hover:text-${theme.accent}-600 transition-colors`}>
                        {post.title}
                      </Link>
                    </h4>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 bg-gradient-to-br ${theme.bg} rounded-full flex items-center justify-center mr-3 shadow-md`}>
                          <span className="text-white font-bold text-xs">
                            {post.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-sm">{post.author}</p>
                          <p className="text-gray-500 text-xs">{post.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <Image
              src="/images/TheHotspotABQNews.svg"
              alt="The Hotspot ABQ News"
              width={100}
              height={100}
              className="w-25 h-25"
            />
            <div className="text-left">
              <h3 className="font-luckiest text-3xl">Albuquerque Hotspot</h3>
              <p className="text-orange-100">Where the high desert meets high energy</p>
            </div>
          </div>
          <p className="text-orange-100 text-lg mb-4">
            🌵 Your source for everything ABQ — from breaking news to green chile reviews 🌶️
          </p>
          <p className="text-orange-200 text-sm">
            © {new Date().getFullYear()} Albuquerque Hotspot. Made with ❤️ in the Land of Enchantment
          </p>
        </div>
      </footer>
    </div>
  );
}
