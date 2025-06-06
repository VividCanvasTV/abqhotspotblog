import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
      // Check if user is authenticated
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Role-based access control for specific admin routes
      const userRole = token.role as string
      
      // Admin-only routes
      const adminOnlyRoutes = [
        '/admin/users',
        '/admin/settings'
      ]
      
      if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/unauthorized', req.url))
        }
      }
      
      // Editor and Admin routes (content management)
      const editorRoutes = [
        '/admin/media'
      ]
      
      if (editorRoutes.some(route => pathname.startsWith(route))) {
        if (!['ADMIN', 'EDITOR'].includes(userRole)) {
          return NextResponse.redirect(new URL('/admin/unauthorized', req.url))
        }
      }
      
      // All authenticated users can access dashboard and posts
      // Additional permission checks will be handled in the components
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to login page
        if (pathname === '/login') {
          return true
        }
        
        // Require authentication for admin routes
        if (pathname.startsWith('/admin')) {
          return !!token
        }
        
        // Allow access to public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
} 