import { chromium } from 'playwright'
import { randomUUID } from 'crypto'
import { BrowserMetadataRepository } from './BrowserMetadataRepository'
import { BrowserContext } from './types'

export class PlaywrightService {
    constructor(private readonly repository: BrowserMetadataRepository) {}

    async engageBrowser(): Promise<BrowserContext> {
        const browser = await chromium.launch({
            headless: false,
            timeout: 30000,
            args: ['--remote-debugging-port=9222']
        })

        const metadata = {
            id: randomUUID(),
            endpoint: 'http://localhost:9222',
            timestamp: new Date().toISOString()
        }

        await this.repository.save(metadata)

        return { browser, metadata }
    }

    async getBrowser(browserId: string): Promise<BrowserContext> {
        const metadata = await this.repository.findById(browserId)

        if (!metadata) {
            throw new Error(`Browser with id ${browserId} not found`)
        }

        const browser = await chromium.connectOverCDP(metadata.endpoint)

        return { browser, metadata }
    }

    async retireBrowser(browserId: string): Promise<void> {
        const metadata = await this.repository.findById(browserId)

        if (metadata) {
            try {
                const browser = await chromium.connectOverCDP(metadata.endpoint)
                await browser.close()
            } catch (error) {
            }
        }

        await this.repository.delete(browserId)
    }
}
