import { chromium } from 'playwright'
import { PlaywrightBrowserRepository } from './PlaywrightBrowserRepository'
import { BrowserConnection } from './types'

export class PlaywrightBrowserService {
    constructor(private readonly repository: PlaywrightBrowserRepository) {}

    async engageBrowser(): Promise<BrowserConnection> {
        const browser = await chromium.launch({
            headless: false,
            timeout: 30000,
            args: ['--remote-debugging-port=9222']
        })

        const context = await browser.newContext()
        const page = await context.newPage()

        return { browser, context, page }
    }

    async getBrowser(browserId: string): Promise<BrowserConnection> {
        const browserState = await this.repository.findById(browserId)

        if (!browserState) {
            throw new Error(`Browser with id ${browserId} not found`)
        }

        const browser = await chromium.connectOverCDP(browserState.endpoint)
        const contexts = browser.contexts()

        if (contexts.length === 0) {
            throw new Error('No browser context found')
        }

        const context = contexts[0]
        const pages = context.pages()

        if (pages.length === 0) {
            throw new Error('No page found in browser')
        }

        const page = pages[0]

        return { browser, context, page }
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
