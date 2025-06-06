import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">AH</span>
          </div>
          <h1 className="font-luckiest text-2xl text-gray-900">
            Albuquerque Hotspot
          </h1>
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h2 className="text-8xl font-luckiest text-gray-300 mb-4">404</h2>
          <h3 className="text-2xl font-luckiest text-gray-900 mb-3">
            Page Not Found
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Oops! The page you're looking for seems to have wandered off like a balloon in the wind. 
            Let's get you back to the hottest stories in ABQ!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            🏠 Take Me Home
          </Link>
          
          <Link 
            href="/news"
            className="block w-full border-2 border-red-500 text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            📰 Browse News
          </Link>
        </div>

        {/* Fun ABQ Facts */}
        <div className="mt-12 p-6 bg-white/50 rounded-2xl border border-orange-200">
          <h4 className="font-luckiest text-lg text-gray-900 mb-3">
            🌶️ Did You Know?
          </h4>
          <p className="text-gray-700 text-sm">
            Albuquerque hosts the world's largest hot air balloon festival every October, 
            with over 500 balloons taking to the skies!
          </p>
        </div>
      </div>
    </div>
  )
} 