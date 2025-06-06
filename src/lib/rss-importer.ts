import Parser from 'rss-parser'
import { prisma } from './db'

interface RSSFeed {
  url: string
  name: string
  categoryId?: string
  authorId: string
  enabled: boolean
  maxItems?: number
  keywords?: string[]
  excludeKeywords?: string[]
  // New smart filtering options
  allowDuplicatesFromDifferentSources?: boolean
  maxDuplicateAgeHours?: number // Allow re-importing after X hours
  priorityKeywords?: string[] // Keywords that bypass normal filtering
  contentSimilarityThreshold?: number // 0-1, how similar content must be to be considered duplicate
}

interface ImportedPost {
  title: string
  content: string
  excerpt?: string
  link: string
  publishedAt: Date
  externalId: string
  feedSource: string
}

interface ImportResult {
  feedName: string
  success: boolean
  imported: number
  skipped: number
  errors: string[]
  duration: number
}

interface ImportSummary {
  totalFeeds: number
  successfulFeeds: number
  totalImported: number
  totalSkipped: number
  totalDuration: number
  results: ImportResult[]
}

export class RSSImporter {
  private parser: Parser
  private feeds: RSSFeed[]
  private adminUserId: string | null = null
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_CACHE_SIZE = 50 // Prevent memory leaks
  private readonly RATE_LIMIT = new Map<string, number>() // URL -> last request timestamp
  private readonly MIN_REQUEST_INTERVAL = 30 * 1000 // 30 seconds between requests to same URL

  constructor() {
    this.parser = new Parser({
      timeout: 15000, // Increased timeout
      maxRedirects: 3, // Reduced redirects for faster parsing
      customFields: {
        item: [
          'summary', 
          'content:encoded', 
          'content', 
          'description',
          'media:content',
          'media:description',
          'dc:description',
          'excerpt:encoded'
        ]
      }
    })

    // Enhanced feed configuration with smart filtering for news content
    this.feeds = [
      {
        url: 'https://www.krqe.com/feed/',
        name: 'KRQE News',
        categoryId: undefined, // Will be resolved dynamically
        authorId: '',
        enabled: true,
        maxItems: 20, // Increased for more news coverage
        keywords: ['albuquerque', 'new mexico', 'nm', 'santa fe', 'rio rancho', 'las cruces', 'bloomfield', 'farmington', 'gallup', 'roswell', 'clovis'], // Include local keywords
        excludeKeywords: ['advertisement', 'sponsored', 'classifieds', 'obituaries', 'horoscope', 'lottery'],
        priorityKeywords: ['breaking', 'alert', 'urgent', 'update', 'developing', 'live', 'emergency'],
        allowDuplicatesFromDifferentSources: true,
        maxDuplicateAgeHours: 12, // Reduced to 12 hours for fresher content
        contentSimilarityThreshold: 0.65 // Lowered from 80% to 65% to be less aggressive
      },
      {
        url: 'https://www.koat.com/topstories-rss',
        name: 'KOAT News',
        categoryId: undefined, // Will be resolved dynamically
        authorId: '',
        enabled: true,
        maxItems: 20, // Increased for more news coverage
        keywords: ['albuquerque', 'new mexico', 'nm', 'santa fe', 'rio rancho', 'las cruces', 'bloomfield', 'farmington', 'gallup', 'roswell', 'clovis'], // Include local keywords
        excludeKeywords: ['advertisement', 'sponsored', 'classifieds', 'obituaries', 'horoscope', 'lottery'],
        priorityKeywords: ['breaking', 'alert', 'urgent', 'update', 'developing', 'live', 'emergency'],
        allowDuplicatesFromDifferentSources: true,
        maxDuplicateAgeHours: 12, // Reduced to 12 hours for fresher content
        contentSimilarityThreshold: 0.65 // Lowered from 80% to 65% to be less aggressive
      },
      {
        url: 'https://newsradiokkob.com/feed',
        name: 'News Radio KKOB',
        categoryId: undefined, // Will be resolved dynamically
        authorId: '',
        enabled: true,
        maxItems: 15, // Increased for more news coverage
        keywords: ['albuquerque', 'new mexico', 'nm', 'santa fe', 'rio rancho', 'las cruces', 'bloomfield', 'farmington', 'gallup', 'roswell', 'clovis'], // Include local keywords
        excludeKeywords: ['advertisement', 'sponsored', 'classifieds', 'obituaries', 'horoscope', 'lottery'],
        priorityKeywords: ['breaking', 'alert', 'urgent', 'update', 'developing', 'live', 'emergency'],
        allowDuplicatesFromDifferentSources: true,
        maxDuplicateAgeHours: 12, // Reduced to 12 hours for fresher content
        contentSimilarityThreshold: 0.65 // Lowered from 80% to 65% to be less aggressive
      }
    ]

    // Clean cache periodically to prevent memory leaks
    setInterval(() => this.cleanExpiredCache(), 10 * 60 * 1000) // Every 10 minutes
  }

  private cleanExpiredCache(): void {
    const now = Date.now()
    let deletedCount = 0
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
        deletedCount++
      }
    }
    
    // Also limit cache size
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      const toDelete = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE)
      toDelete.forEach(([key]) => this.cache.delete(key))
      deletedCount += toDelete.length
    }
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned ${deletedCount} expired cache entries`)
    }
  }

  private async getAdminUserId(): Promise<string> {
    if (this.adminUserId) {
      return this.adminUserId
    }

    try {
      const adminUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: 'admin@abqhotspot.com' },
            { role: 'ADMIN' }
          ]
        },
        select: { id: true } // Only select needed field
      })

      if (!adminUser) {
        throw new Error('No admin user found. Please create an admin user first.')
      }

      this.adminUserId = adminUser.id
      return adminUser.id
    } catch (error) {
      console.error('❌ Error finding admin user:', error)
      throw new Error(`Failed to find admin user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async getValidCategoryId(): Promise<string> {
    try {
      // Try to find a "News" category first
      let category = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: 'news' },
            { name: { contains: 'News' } }
          ]
        },
        select: { id: true }
      })

      // If no news category, get the first available category
      if (!category) {
        category = await prisma.category.findFirst({
          select: { id: true }
        })
      }

      // If still no category, create a default one
      if (!category) {
        console.log('📁 Creating default RSS category...')
        category = await prisma.category.create({
          data: {
            name: 'RSS News',
            slug: 'rss-news',
            description: 'Imported RSS content'
          },
          select: { id: true }
        })
      }

      if (!category) {
        throw new Error('Failed to create or find a valid category')
      }

      return category.id
    } catch (error) {
      console.error('❌ Error getting category:', error)
      throw new Error(`Failed to get valid category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async importFromAllFeeds(): Promise<ImportSummary> {
    const startTime = Date.now()
    console.log('🚀 Starting optimized RSS import from all feeds...')
    
    try {
      const adminUserId = await this.getAdminUserId()
      const categoryId = await this.getValidCategoryId()
      
      // Update feeds with admin user ID and valid category
      const enabledFeeds = this.feeds
        .filter(f => f.enabled)
        .map(feed => ({ ...feed, authorId: adminUserId, categoryId }))

      if (enabledFeeds.length === 0) {
        console.log('⚠️ No enabled feeds found')
        return {
          totalFeeds: 0,
          successfulFeeds: 0,
          totalImported: 0,
          totalSkipped: 0,
          totalDuration: Date.now() - startTime,
          results: []
        }
      }

      // Process feeds in parallel with concurrency limit
      const results = await this.processInBatches(enabledFeeds, 2) // Max 2 concurrent feeds
      
      const summary: ImportSummary = {
        totalFeeds: enabledFeeds.length,
        successfulFeeds: results.filter(r => r.success).length,
        totalImported: results.reduce((sum, r) => sum + r.imported, 0),
        totalSkipped: results.reduce((sum, r) => sum + r.skipped, 0),
        totalDuration: Date.now() - startTime,
        results
      }

      console.log('✅ RSS import completed successfully')
      console.log(`📊 Summary: ${summary.totalImported} imported, ${summary.totalSkipped} skipped, ${summary.totalDuration}ms`)
      
      return summary
    } catch (error) {
      console.error('❌ RSS import failed:', error)
      throw new Error(`RSS import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async processInBatches(feeds: RSSFeed[], batchSize: number): Promise<ImportResult[]> {
    const results: ImportResult[] = []
    
    for (let i = 0; i < feeds.length; i += batchSize) {
      const batch = feeds.slice(i, i + batchSize)
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1} with ${batch.length} feeds...`)
      
      const batchPromises = batch.map(feed => this.importFromFeedWithResult(feed))
      
      try {
        const batchResults = await Promise.allSettled(batchPromises)
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value)
          } else {
            console.error(`❌ Batch processing error for ${batch[index].name}:`, result.reason)
            results.push({
              feedName: batch[index].name,
              success: false,
              imported: 0,
              skipped: 0,
              errors: [result.reason?.message || 'Unknown batch processing error'],
              duration: 0
            })
          }
        })
      } catch (error) {
        console.error('❌ Critical batch processing error:', error)
        // Add failed results for the entire batch
        batch.forEach(feed => {
          results.push({
            feedName: feed.name,
            success: false,
            imported: 0,
            skipped: 0,
            errors: [`Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
            duration: 0
          })
        })
      }
      
      // Small delay between batches to avoid overwhelming servers
      if (i + batchSize < feeds.length) {
        console.log('⏳ Waiting between batches...')
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    return results
  }

  private async importFromFeedWithResult(feed: RSSFeed): Promise<ImportResult> {
    const startTime = Date.now()
    const result: ImportResult = {
      feedName: feed.name,
      success: false,
      imported: 0,
      skipped: 0,
      errors: [],
      duration: 0
    }

    try {
      console.log(`📡 Processing ${feed.name}...`)
      
      const feedData = await this.parseFeedWithCache(feed.url)
      
      if (!feedData?.items?.length) {
        result.errors.push('No items found in feed')
        return result
      }

      const maxItems = feed.maxItems || 10
      const items = feedData.items.slice(0, maxItems)
      
      console.log(`📄 Found ${items.length} items in ${feed.name}`)

      let skipReasons = {
        invalid: 0,
        keywords: 0,
        duplicates: 0
      }

      // Process items with filtering
      for (const item of items) {
        if (!this.isValidItem(item)) {
          result.skipped++
          skipReasons.invalid++
          console.log(`⚠️ Skipped invalid item: ${item.title?.substring(0, 50) || 'No title'}`)
          continue
        }

        if (!this.passesKeywordFilter(item, feed)) {
          result.skipped++
          skipReasons.keywords++
          console.log(`🔍 Skipped keyword filter: ${item.title?.substring(0, 50)}`)
          continue
        }

        const externalId = this.generateExternalId(item.link, feed.name)
        
        // Smart duplicate check with multiple strategies
        const isDuplicate = await this.isSmartDuplicate(item, feed, externalId)
        if (isDuplicate) {
          result.skipped++
          skipReasons.duplicates++
          console.log(`🔄 Skipped duplicate: ${item.title?.substring(0, 50)}`)
          continue
        }

        try {
          await this.saveImportedPostOptimized(item, feed)
          result.imported++
          console.log(`✅ Imported: ${item.title?.substring(0, 60)}...`)
        } catch (saveError) {
          result.errors.push(`Failed to save "${item.title}": ${saveError}`)
        }
      }

      result.success = true
      result.duration = Date.now() - startTime
      
      const processingRate = Math.round((items.length / result.duration) * 1000)
      console.log(`✅ ${feed.name}: ${result.imported} imported, ${result.skipped} skipped (${processingRate} items/sec)`)
      console.log(`   📊 Skip reasons: ${skipReasons.duplicates} duplicates, ${skipReasons.keywords} keyword filter, ${skipReasons.invalid} invalid`)
      
      if (result.imported > 0) {
        console.log(`   🎯 Import efficiency: ${Math.round((result.imported / items.length) * 100)}% of items imported`)
      }
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error))
      result.duration = Date.now() - startTime
      console.error(`❌ Failed to process ${feed.name}:`, error)
    }

    return result
  }

  private async parseFeedWithCache(url: string): Promise<any> {
    const cacheKey = `feed_${url}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`📋 Using cached data for ${url}`)
      return cached.data
    }

    // Rate limiting check
    const lastRequest = this.RATE_LIMIT.get(url)
    if (lastRequest && (Date.now() - lastRequest) < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - (Date.now() - lastRequest)
      console.log(`⏰ Rate limiting: waiting ${waitTime}ms before requesting ${url}`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    try {
      console.log(`🌐 Fetching fresh data from ${url}`)
      this.RATE_LIMIT.set(url, Date.now())
      const feedData = await this.parser.parseURL(url)
      this.cache.set(cacheKey, { data: feedData, timestamp: Date.now() })
      
      return feedData
    } catch (error) {
      console.error(`❌ Failed to fetch RSS feed from ${url}:`, error)
      
      // If we have stale cached data, use it as fallback
      if (cached) {
        console.log(`📋 Using stale cached data as fallback for ${url}`)
        return cached.data
      }
      
      throw error
    }
  }

  private isValidItem(item: any): boolean {
    return !!(item.title && item.link)
  }

  private passesKeywordFilter(item: any, feed: RSSFeed): boolean {
    const content = `${item.title} ${item.description || ''} ${item.content || ''}`.toLowerCase()
    
    // Priority keywords bypass all other filtering (breaking news, etc.)
    if (feed.priorityKeywords?.some(keyword => content.includes(keyword.toLowerCase()))) {
      console.log(`🚨 Priority content detected: ${item.title?.substring(0, 50)}`)
      return true
    }
    
    // Check exclude keywords first
    const excludedKeyword = feed.excludeKeywords?.find(keyword => {
      const keywordLower = keyword.toLowerCase()
      // More specific matching - avoid false positives
      return content.includes(` ${keywordLower} `) || 
             content.startsWith(`${keywordLower} `) || 
             content.endsWith(` ${keywordLower}`) ||
             content.includes(`${keywordLower}:`) ||
             content.includes(`${keywordLower}.`)
    })
    
    if (excludedKeyword) {
      console.log(`🚫 Excluded by keyword "${excludedKeyword}": ${item.title?.substring(0, 50)}`)
      return false
    }
    
    // Smart keyword matching for local news
    if (feed.keywords?.length) {
      // Check for local relevance - be more flexible
      const hasLocalKeyword = feed.keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase()
        return content.includes(keywordLower) || 
               item.link?.toLowerCase().includes(keywordLower) ||
               item.category?.some((cat: string) => cat.toLowerCase().includes(keywordLower))
      })
      
      // For news feeds, be more lenient - if it's from a local source, it's probably relevant
      const isLocalSource = content.includes('albuquerque') || content.includes('new mexico') || content.includes(' nm ')
      
      if (!hasLocalKeyword && !isLocalSource) {
        console.log(`📍 Not local content: ${item.title?.substring(0, 50)}`)
        return false
      }
    }
    
    console.log(`✅ Passed keyword filter: ${item.title?.substring(0, 50)}`)
    return true
  }

  private async checkPostExists(externalId: string): Promise<boolean> {
    const count = await prisma.post.count({
      where: { externalId }
    })
    return count > 0
  }

  // Smart duplicate detection for news content with detailed debugging
  private async isSmartDuplicate(item: any, feed: RSSFeed, externalId: string): Promise<boolean> {
    console.log(`🔍 Checking duplicate for: ${item.title?.substring(0, 50)}`)
    
    // 1. Check exact external ID first (same URL from same source)
    const exactMatch = await this.checkPostExists(externalId)
    if (exactMatch) {
      console.log(`   📌 Exact ID match found for: ${externalId}`)
      
      // If it's an exact match, check if enough time has passed for updates
      if (feed.maxDuplicateAgeHours) {
        const cutoffDate = new Date()
        cutoffDate.setHours(cutoffDate.getHours() - feed.maxDuplicateAgeHours)
        
        const recentPost = await prisma.post.findFirst({
          where: {
            externalId,
            createdAt: { gte: cutoffDate }
          },
          select: { id: true, createdAt: true, title: true }
        })
        
        if (!recentPost) {
          console.log(`   ⏰ Old content (>${feed.maxDuplicateAgeHours}h) - allowing re-import`)
          return false // Allow re-import of old content
        } else {
          const ageHours = Math.round((Date.now() - recentPost.createdAt.getTime()) / (1000 * 60 * 60))
          console.log(`   🕒 Recent content (${ageHours}h ago) - skipping as duplicate`)
        }
      }
      return true // True duplicate
    }

    // 2. For different sources, check if we should allow duplicates
    if (feed.allowDuplicatesFromDifferentSources) {
      console.log(`   ✅ Different source allowed - not checking similarity`)
      return false // Different source = not duplicate
    }

    // 3. Check content similarity across all sources
    if (feed.contentSimilarityThreshold && feed.contentSimilarityThreshold < 1.0) {
      console.log(`   📊 Checking content similarity (threshold: ${feed.contentSimilarityThreshold})`)
      const similarPosts = await this.findSimilarContent(item, feed.contentSimilarityThreshold)
      if (similarPosts.length > 0) {
        console.log(`   🎯 Found ${similarPosts.length} similar posts - marking as duplicate`)
        similarPosts.forEach(post => {
          console.log(`      • Similar: "${post.title?.substring(0, 40)}" from ${post.externalSource}`)
        })
        return true // Similar content exists
      } else {
        console.log(`   🆕 No similar content found - allowing import`)
      }
    }

    return false // Not a duplicate
  }

  // Find posts with similar content using enhanced title and description comparison
  private async findSimilarContent(item: any, threshold: number): Promise<any[]> {
    try {
      const itemTitle = (item.title || '').toLowerCase().trim()
      const itemDescription = (item.description || '').toLowerCase().trim()
      
      if (!itemTitle || itemTitle.length < 10) return [] // Skip very short titles

      // Get recent posts for comparison (last 3 days for more current comparison)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 3)
      
      const recentPosts = await prisma.post.findMany({
        where: {
          createdAt: { gte: cutoffDate },
          externalSource: { not: null }
        },
        select: {
          id: true,
          title: true,
          excerpt: true,
          externalSource: true
        }
      })

      const similarPosts = recentPosts.filter(post => {
        const postTitle = (post.title || '').toLowerCase().trim()
        const postExcerpt = (post.excerpt || '').toLowerCase().trim()
        
        // Enhanced similarity check
        const titleSimilarity = this.calculateTextSimilarity(itemTitle, postTitle)
        const descSimilarity = this.calculateTextSimilarity(itemDescription, postExcerpt)
        
        // Also check for exact phrase matches (breaking news updates)
        const hasCommonPhrases = this.hasCommonKeyPhrases(itemTitle, postTitle)
        
        // Use weighted average instead of max, and consider phrase matching
        const weightedSimilarity = (titleSimilarity * 0.7) + (descSimilarity * 0.3)
        const finalSimilarity = hasCommonPhrases ? Math.max(weightedSimilarity, 0.8) : weightedSimilarity
        
        if (finalSimilarity >= threshold) {
          console.log(`      📈 Similarity: ${Math.round(finalSimilarity * 100)}% with "${postTitle.substring(0, 30)}"`)
        }
        
        return finalSimilarity >= threshold
      })

      return similarPosts
    } catch (error) {
      console.error('Error finding similar content:', error)
      return []
    }
  }

  // Check for common key phrases that indicate same story
  private hasCommonKeyPhrases(title1: string, title2: string): boolean {
    const keyPhrases1 = this.extractKeyPhrases(title1)
    const keyPhrases2 = this.extractKeyPhrases(title2)
    
    return keyPhrases1.some(phrase => keyPhrases2.includes(phrase))
  }

  // Extract meaningful phrases from title
  private extractKeyPhrases(title: string): string[] {
    const words = title.toLowerCase().split(/\s+/)
    const phrases: string[] = []
    
    // Extract 2-3 word phrases that might indicate the same story
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 3 && words[i + 1].length > 3) {
        phrases.push(`${words[i]} ${words[i + 1]}`)
        
        if (i < words.length - 2 && words[i + 2].length > 3) {
          phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
        }
      }
    }
    
    return phrases
  }

  // Simple text similarity calculation
  private calculateTextSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0

    const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 3))
    const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 3))
    
    if (words1.size === 0 || words2.size === 0) return 0

    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return intersection.size / union.size
  }

  // Batch check for multiple external IDs - more efficient
  private async checkMultiplePostsExist(externalIds: string[]): Promise<Set<string>> {
    if (externalIds.length === 0) return new Set()
    
    const existingPosts = await prisma.post.findMany({
      where: {
        externalId: {
          in: externalIds
        }
      },
      select: { externalId: true }
    })
    
    return new Set(existingPosts.map(p => p.externalId).filter((id): id is string => Boolean(id)))
  }

  private async saveImportedPostOptimized(item: any, feed: RSSFeed): Promise<void> {
    const publishDate = item.pubDate ? new Date(item.pubDate) : new Date()
    const importedPost = this.parseRSSItem(item, feed, publishDate)
    
    const slug = this.generateSlug(importedPost.title)
    const finalSlug = await this.ensureUniqueSlug(slug)

    // Use transaction for data consistency
    await prisma.$transaction(async (tx) => {
      await tx.post.create({
        data: {
          title: importedPost.title,
          slug: finalSlug,
          content: importedPost.content,
          excerpt: importedPost.excerpt,
          status: 'DRAFT',
          publishedAt: importedPost.publishedAt,
          externalId: importedPost.externalId,
          externalSource: importedPost.feedSource,
          externalUrl: importedPost.link,
          authorId: feed.authorId,
          categoryId: feed.categoryId || null,
          featured: false,
        }
      })
    })
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    const existing = await prisma.post.findFirst({
      where: { slug: baseSlug },
      select: { id: true }
    })
    
    if (!existing) {
      return baseSlug
    }
    
    // Use a more robust uniqueness strategy
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const uniqueSlug = `${baseSlug}-${randomSuffix}`
    
    // Recursively check if the new slug is also taken (very rare but possible)
    const stillExists = await prisma.post.findFirst({
      where: { slug: uniqueSlug },
      select: { id: true }
    })
    
    return stillExists ? `${baseSlug}-${Date.now()}-${randomSuffix}` : uniqueSlug
  }

  private parseRSSItem(item: any, feed: RSSFeed, publishDate: Date): ImportedPost {
    // Try multiple content fields in order of preference
    let rawContent = item['content:encoded'] || 
                     item.content || 
                     item['content'] || 
                     item.summary || 
                     item.description || 
                     item['description'] || ''
    
    // Clean and optimize content
    let content = this.cleanContent(rawContent)
    
    // If content is still poor quality, try description as backup
    if (!content || content.length < 50) {
      const descContent = this.cleanContent(item.description || item.summary || '')
      if (descContent && descContent.length > content.length) {
        content = descContent
      }
    }
    
    // Generate excerpt from cleaned content
    const excerpt = this.generateExcerpt(content, item.title)
    
    // If we still don't have good content, create a basic article with better fallback
    if (!content || content.length < 20) {
      const fallbackExcerpt = excerpt.length > 10 ? excerpt : `${item.title} - Article from ${feed.name}`
      content = `<p>${fallbackExcerpt}</p><p>This article may contain media content, documents, or interactive elements that are best viewed on the original site.</p><p><a href="${item.link}" target="_blank" rel="noopener">Read the full article at ${feed.name}</a></p>`
    }
    
    return {
      title: this.cleanTitle(item.title),
      content,
      excerpt,
      link: item.link,
      publishedAt: publishDate,
      externalId: this.generateExternalId(item.link, feed.name),
      feedSource: feed.name
    }
  }

  private cleanContent(content: string): string {
    if (!content) return ''
    
    // Remove WordPress-specific and unwanted elements
    content = content
      // Remove scripts and styles
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      
      // Remove WordPress block editor elements
      .replace(/<div[^>]*wp-block-file[^>]*>.*?<\/div>/gi, '')
      .replace(/<div[^>]*wp-block-button[^>]*>.*?<\/div>/gi, '')
      .replace(/<div[^>]*wp-block-buttons[^>]*>.*?<\/div>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*\/?>/gi, '')
      
      // Remove Themify builder content
      .replace(/<!--themify_builder_content-->.*?<!--\/themify_builder_content-->/gi, '')
      .replace(/<div[^>]*themify_builder[^>]*>.*?<\/div>/gi, '')
      
      // Remove download links and file references
      .replace(/<a[^>]*download[^>]*>.*?<\/a>/gi, '')
      .replace(/<a[^>]*\.pdf[^>]*>.*?<\/a>/gi, '')
      .replace(/<a[^>]*wp-block-file__button[^>]*>.*?<\/a>/gi, '')
      
      // Remove data attributes and WordPress-specific attributes
      .replace(/\s*data-wp-[^=]*="[^"]*"/gi, '')
      .replace(/\s*class="wp-[^"]*"/gi, '')
      .replace(/\s*id="wp-[^"]*"/gi, '')
      .replace(/\s*aria-describedby="wp-[^"]*"/gi, '')
      
      // Remove empty divs and spans
      .replace(/<div[^>]*>\s*<\/div>/gi, '')
      .replace(/<span[^>]*>\s*<\/span>/gi, '')
      
      // Clean up whitespace and normalize
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
    
    // Extract meaningful text content for news articles
    const textContent = this.extractArticleText(content)
    
    if (textContent) {
      // If we extracted meaningful text, format it properly
      const paragraphs = textContent
        .split(/\n\n+/)
        .filter(p => p.trim().length > 10)
        .map(p => `<p>${p.trim()}</p>`)
      
      return paragraphs.length > 0 ? paragraphs.join('\n') : `<p>${textContent}</p>`
    }
    
    // Fallback: ensure basic formatting for remaining content
    if (content && !content.includes('<p>') && content.length > 10) {
      content = `<p>${content}</p>`
    }
    
    return content || ''
  }

  // Extract actual article text from HTML, ignoring UI elements
  private extractArticleText(html: string): string {
    if (!html) return ''
    
    // Remove all HTML tags and get plain text
    const plainText = html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
    
    // Filter out common UI text that shouldn't be in article content
    const filteredText = plainText
      .replace(/\b(download|more info|read more|click here|view pdf|embed of)\b/gi, '')
      .replace(/\b[a-z0-9-]+\.(pdf|doc|docx|jpg|png|gif)\b/gi, '') // Remove file references
      .replace(/\bhttps?:\/\/[^\s]+/gi, '') // Remove URLs
      .trim()
    
    // Return only if we have substantial content
    return filteredText.length > 50 ? filteredText : ''
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200) // Limit title length
  }

  private generateExcerpt(content: string, title: string): string {
    if (!content && !title) return ''
    
    // Clean HTML and extract text
    let text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
    
    // Remove common UI text and file references
    text = text
      .replace(/\b(download|more info|read more|click here|view pdf|embed of)\b/gi, '')
      .replace(/\b[a-z0-9-]+\.(pdf|doc|docx|jpg|png|gif)\b/gi, '')
      .replace(/\bhttps?:\/\/[^\s]+/gi, '')
      .trim()
    
    // If we have meaningful content, use it
    if (text.length > 20) {
      // Find the first sentence or first 150 characters
      const sentences = text.split(/[.!?]+/)
      const firstSentence = sentences[0]?.trim()
      
      if (firstSentence && firstSentence.length > 20 && firstSentence.length <= 200) {
        return firstSentence + '.'
      }
      
      // Otherwise, take first 150 characters and ensure we don't cut off mid-word
      const excerpt = text.substring(0, 150).trim()
      const lastSpaceIndex = excerpt.lastIndexOf(' ')
      const cleanExcerpt = lastSpaceIndex > 100 ? excerpt.substring(0, lastSpaceIndex) : excerpt
      
      return cleanExcerpt + '...'
    }
    
    // Fallback to title-based excerpt
    if (title && title.length > 10) {
      return `Article from RSS feed: ${title.substring(0, 150)}...`
    }
    
    return 'Article imported from RSS feed.'
  }

  private generateExternalId(link: string, feedName: string): string {
    return `${feedName.toLowerCase().replace(/\s+/g, '-')}-${Buffer.from(link).toString('base64').slice(0, 16)}`
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50)
  }

  // Method for custom URL imports (admin interface)
  async importFromUrl(url: string, feedName: string, categoryId?: string, authorId?: string): Promise<ImportResult> {
    try {
      const adminUserId = authorId || await this.getAdminUserId()
      
      const customFeed: RSSFeed = {
        url,
        name: feedName,
        categoryId: categoryId || '1',
        authorId: adminUserId,
        enabled: true,
        maxItems: 10
      }

      return await this.importFromFeedWithResult(customFeed)
    } catch (error) {
      return {
        feedName,
        success: false,
        imported: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : String(error)],
        duration: 0
      }
    }
  }

  // Get current feed configuration
  getFeeds(): RSSFeed[] {
    return this.feeds.map(feed => ({ ...feed }))
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
    console.log('RSS cache cleared')
  }

  // Clear posts from a specific feed (for testing)
  async clearFeedPosts(feedName: string): Promise<number> {
    try {
      const result = await prisma.post.deleteMany({
        where: {
          externalSource: feedName
        }
      })
      console.log(`🗑️ Cleared ${result.count} posts from ${feedName}`)
      return result.count
    } catch (error) {
      console.error(`Error clearing posts from ${feedName}:`, error)
      throw error
    }
  }

  // Get count of posts by feed
  async getFeedPostCounts(): Promise<Record<string, number>> {
    try {
      const counts = await prisma.post.groupBy({
        by: ['externalSource'],
        where: {
          externalSource: {
            not: null
          }
        },
        _count: {
          id: true
        }
      })

      const result: Record<string, number> = {}
      counts.forEach(count => {
        if (count.externalSource) {
          result[count.externalSource] = count._count.id
        }
      })

      return result
    } catch (error) {
      console.error('Error getting feed post counts:', error)
      return {}
    }
  }
}

// Export function for scheduled imports
export async function runRSSImport(): Promise<ImportSummary> {
  const importer = new RSSImporter()
  return await importer.importFromAllFeeds()
}