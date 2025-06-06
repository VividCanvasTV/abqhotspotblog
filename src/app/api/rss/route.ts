import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Fetch the latest published posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: { name: true, email: true }
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 50, // Limit to last 50 posts
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const buildDate = new Date().toUTCString()

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Albuquerque Hotspot News</title>
    <description>Your trusted source for local news, events, and stories that matter to our Albuquerque community.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <managingEditor>news@abqhotspot.com (ABQ Hotspot Team)</managingEditor>
    <webMaster>admin@abqhotspot.com (ABQ Hotspot Admin)</webMaster>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/images/logo.png</url>
      <title>Albuquerque Hotspot News</title>
      <link>${baseUrl}</link>
    </image>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200) + '...'}]]></description>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : buildDate}</pubDate>
      <author>${post.author.email || 'news@abqhotspot.com'} (${post.author.name})</author>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    )
  }
} 