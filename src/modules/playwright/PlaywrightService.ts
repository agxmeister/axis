import { chromium, Browser } from 'playwright'
import { BrowserStateRepository } from './BrowserStateRepository'

export class PlaywrightService {
    constructor(private readonly repository: BrowserStateRepository) {}

    async engageBrowser(): Promise<Browser> {
        const browser = await chromium.launch({
            headless: false,
            timeout: 30000,
            args: ['--remote-debugging-port=9222']
        })

        return browser
    }

    async getBrowser(browserId: string): Promise<Browser> {
        const browserState = await this.repository.findById(browserId)

        if (!browserState) {
            throw new Error(`Browser with id ${browserId} not found`)
        }

        const browser = await chromium.connectOverCDP(browserState.endpoint)

        return browser
    }

    async retireBrowser(browserId: string): Promise<void> {
        const browserState = await this.repository.findById(browserId)

        if (browserState) {
            try {
                const browser = await chromium.connectOverCDP(browserState.endpoint)
                await browser.close()
            } catch (error) {
                // Browser might already be closed, continue with cleanup
            }
        }

        await this.repository.delete(browserId)
    }
}
