import { Page } from 'playwright'
import { BrowserContext } from './types'

export class PageFactory {
    constructor(private readonly browserContext: BrowserContext) {}

    async create(): Promise<Page> {
        const contexts = this.browserContext.browser.contexts()
        let context

        if (contexts.length === 0) {
            context = await this.browserContext.browser.newContext()
        } else {
            context = contexts[0]
        }

        const pages = context.pages()
        let page

        if (pages.length === 0) {
            page = await context.newPage()
        } else {
            page = pages[0]
        }

        return page
    }
}
