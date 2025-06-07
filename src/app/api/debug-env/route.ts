import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET',
    nextauth_secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
  })
} 