import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runRSSImport, RSSImporter } from '@/lib/rss-importer'
import { rssScheduler } from '@/lib/rss-scheduler'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json().catch(() => ({}))
    const { url, feedName, action } = body

    // Handle scheduler actions
    if (action === 'start_scheduler') {
      rssScheduler.start()
      return NextResponse.json({
        success: true,
        message: 'RSS scheduler started',
        isRunning: rssScheduler.isSchedulerRunning()
      })
    }

    if (action === 'stop_scheduler') {
      rssScheduler.stop()
      return NextResponse.json({
        success: true,
        message: 'RSS scheduler stopped',
        isRunning: rssScheduler.isSchedulerRunning()
      })
    }

    if (action === 'get_stats') {
      return NextResponse.json({
        success: true,
        stats: rssScheduler.getStats(),
        isRunning: rssScheduler.isSchedulerRunning()
      })
    }

    if (action === 'trigger_manual') {
      try {
        await rssScheduler.triggerImport()
        return NextResponse.json({
          success: true,
          message: 'Manual import completed successfully'
        })
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: `Manual import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 })
      }
    }

    if (action === 'get_feed_counts') {
      const importer = new RSSImporter()
      const counts = await importer.getFeedPostCounts()
      return NextResponse.json({
        success: true,
        counts
      })
    }
      
    if (action === 'clear_feed' && body.feedName) {
      const importer = new RSSImporter()
      const cleared = await importer.clearFeedPosts(body.feedName)
      return NextResponse.json({
        success: true,
        message: `Cleared ${cleared} posts from ${body.feedName}`,
        cleared
      })
    }

    // Handle custom URL import
    if (url && feedName) {
      const importer = new RSSImporter()
      const result = await importer.importFromUrl(url, feedName)
      
      return NextResponse.json({
        success: result.success,
        message: result.success 
          ? `Successfully imported ${result.imported} posts from ${feedName} (saved as drafts for review)` 
          : `Import failed: ${result.errors.join(', ')}`,
        result
      })
    } 
    
    // Import from all configured feeds
    const results = await runRSSImport()
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${results.totalImported} posts from ${results.successfulFeeds}/${results.totalFeeds} feeds (saved as drafts for review)`,
      summary: results
    })

  } catch (error) {
    console.error('RSS import error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to import RSS feeds', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const importer = new RSSImporter()
    const feeds = importer.getFeeds()
    
    return NextResponse.json({
      feeds: feeds.map(feed => ({
        name: feed.name,
        url: feed.url,
        category: 'Local News',
        status: 'Working ✓',
        enabled: feed.enabled,
        maxItems: feed.maxItems,
        keywords: feed.keywords,
        excludeKeywords: feed.excludeKeywords
      })),
      scheduler: {
        isRunning: rssScheduler.isSchedulerRunning(),
        stats: rssScheduler.getStats()
      }
    })

  } catch (error) {
    console.error('Error fetching RSS feeds:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    )
  }
} 