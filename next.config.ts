import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NODE_ENV === 'production' 
      ? 'https://abqhotspotblog-production.up.railway.app' 
      : 'http://localhost:3000'
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    // Enable server-side rendering optimizations
    serverActions: {
      // Enable server actions if needed
      allowedOrigins: ['localhost:3000', 'abqhotspotblog-production.up.railway.app']
    },
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
