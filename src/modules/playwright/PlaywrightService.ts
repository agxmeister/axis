import { chromium, Browser } from 'playwright'
import { BrowserStateRepository } from './BrowserStateRepository'

export class PlaywrightService {
    constructor(private readonly repository: BrowserStateRepository) {}

    async engageBrowser(): Promise<Browser> {
        return await chromium.launch({
            headless: false,
            timeout: 30000,
            args: ['--remote-debugging-port=9222']
        })
    }

    async getBrowser(browserId: string): Promise<Browser> {
        const browserState = await this.repository.findById(browserId)

        if (!browserState) {
            throw new Error(`Browser with id ${browserId} not found`)
        }

        return await chromium.connectOverCDP(browserState.endpoint)
    }

    async retireBrowser(browserId: string): Promise<void> {
        const browserState = await this.repository.findById(browserId)

        if (browserState) {
            try {
                const browser = await chromium.connectOverCDP(browserState.endpoint)
                await browser.close()
            } catch (error) {
            }
        }

        await this.repository.delete(browserId)
    }
}
