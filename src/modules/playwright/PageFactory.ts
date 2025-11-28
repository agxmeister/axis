import { Browser, Page } from 'playwright'

export class PageFactory {
    async create(browser: Browser): Promise<Page> {
        const contexts = browser.contexts()
        let context

        if (contexts.length === 0) {
            context = await browser.newContext()
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
