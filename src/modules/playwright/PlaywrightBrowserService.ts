import { chromium, Browser, Page, BrowserContext } from 'playwright'
import { PlaywrightBrowserRepository } from './PlaywrightBrowserRepository'

export interface BrowserConnection {
    browser: Browser
    context: BrowserContext
    page: Page
}

export class PlaywrightBrowserService {
    constructor(private readonly repository: PlaywrightBrowserRepository) {}

    async getBrowser(browserId?: string, timeout: number = 30000): Promise<BrowserConnection> {
        let browser: Browser
        let context: BrowserContext
        let page: Page

        if (browserId) {
            const browserState = await this.repository.findById(browserId)

            if (!browserState) {
                throw new Error(`Browser with id ${browserId} not found`)
            }

            browser = await chromium.connectOverCDP(browserState.endpoint)
            const contexts = browser.contexts()

            if (contexts.length === 0) {
                throw new Error('No browser context found')
            }

            context = contexts[0]
            const pages = context.pages()

            if (pages.length === 0) {
                throw new Error('No page found in browser')
            }

            page = pages[0]
        } else {
            browser = await chromium.launch({
                headless: false,
                timeout,
                args: ['--remote-debugging-port=9222']
            })

            context = await browser.newContext()
            page = await context.newPage()
        }

        return { browser, context, page }
    }
}
