import * as cron from 'node-cron'
import { RSSImporter } from './rss-importer'

interface SchedulerConfig {
  enabled: boolean
  cronPattern: string
  maxRetries: number
  retryDelay: number
}

interface ImportStats {
  lastRun: Date
  totalImports: number
  successfulImports: number
  failedImports: number
  averageRunTime: number
}

export class RSSScheduler {
  private config: SchedulerConfig
  private task: any = null
  private stats: ImportStats
  private isRunning: boolean = false

  constructor(config?: Partial<SchedulerConfig>) {
    this.config = {
      enabled: process.env.RSS_AUTO_IMPORT === 'true',
      cronPattern: process.env.RSS_CRON_PATTERN || '0 */4 * * *', // Every 4 hours
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      ...config
    }

    this.stats = {
      lastRun: new Date(0),
      totalImports: 0,
      successfulImports: 0,
      failedImports: 0,
      averageRunTime: 0
    }
  }

  start(): void {
    if (!this.config.enabled) {
      console.log('RSS auto-import is disabled')
      return
    }

    if (this.task) {
      console.log('RSS scheduler is already running')
      return
    }

    this.task = cron.schedule(this.config.cronPattern, async () => {
      await this.executeImport()
    }, {
      timezone: 'America/Denver' // Mountain Time for Albuquerque
    })

    console.log(`RSS scheduler started with pattern: ${this.config.cronPattern}`)
  }

  stop(): void {
    if (this.task) {
      this.task.stop()
      this.task.destroy()
      this.task = null
      console.log('RSS scheduler stopped')
    }
  }

  // Cleanup method for proper shutdown
  cleanup(): void {
    this.stop()
    // Clear any pending timeouts or intervals
    if (this.isRunning) {
      console.log('⚠️ Forcing cleanup of running import...')
      this.isRunning = false
    }
  }

  async executeImport(): Promise<void> {
    if (this.isRunning) {
      console.log('RSS import already in progress, skipping...')
      return
    }

    this.isRunning = true
    const startTime = Date.now()

    try {
      console.log('🔄 Starting scheduled RSS import...')
      
      const importer = new RSSImporter()
      const results = await this.executeWithRetry(() => importer.importFromAllFeeds())

      const runTime = Date.now() - startTime
      this.updateStats(true, runTime)

      console.log(`✅ Scheduled RSS import completed in ${runTime}ms`)
      console.log('📊 Import results:', results)

    } catch (error) {
      const runTime = Date.now() - startTime
      this.updateStats(false, runTime)

      console.error('❌ Scheduled RSS import failed:', error)
      
      // Optional: Send notification email or webhook here
      await this.handleImportFailure(error)
    } finally {
      this.isRunning = false
    }
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt < this.config.maxRetries) {
          console.log(`Import attempt ${attempt} failed, retrying in ${this.config.retryDelay}ms...`)
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay))
        }
      }
    }

    throw lastError
  }

  private updateStats(success: boolean, runTime: number): void {
    this.stats.lastRun = new Date()
    this.stats.totalImports++
    
    if (success) {
      this.stats.successfulImports++
    } else {
      this.stats.failedImports++
    }

    // Calculate running average
    this.stats.averageRunTime = Math.round(
      (this.stats.averageRunTime * (this.stats.totalImports - 1) + runTime) / this.stats.totalImports
    )
  }

  private async handleImportFailure(error: unknown): Promise<void> {
    // Log to file or external service
    console.error('RSS Import Failure Details:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stats: this.stats
    })

    // Future: Send email notification, webhook, etc.
  }

  getStats(): ImportStats {
    return { ...this.stats }
  }

  isSchedulerRunning(): boolean {
    return this.task !== null
  }

  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    const wasRunning = this.isSchedulerRunning()
    
    if (wasRunning) {
      this.stop()
    }

    this.config = { ...this.config, ...newConfig }

    if (wasRunning && this.config.enabled) {
      this.start()
    }
  }

  // Manual trigger for testing
  async triggerImport(): Promise<void> {
    await this.executeImport()
  }
}

// Global instance
export const rssScheduler = new RSSScheduler()

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  rssScheduler.start()
} 