import { chromium } from 'playwright'
import { randomUUID } from 'crypto'
import { injectable, inject } from 'inversify'
import { BrowserMetadataRepository } from './BrowserMetadataRepository'
import { BrowserContext } from './types'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.BrowserMetadataRepository) private readonly repository: BrowserMetadataRepository,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageBrowser(): Promise<BrowserContext> {
        const config = this.configFactory.create()
        const port = config.browser.port

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000,
            args: [`--remote-debugging-port=${port}`]
        })

        const metadata = {
            id: randomUUID(),
            endpoint: `http://localhost:${port}`,
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
