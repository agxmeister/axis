import { Page } from 'playwright'
import { Session } from './types'

export class PageFactory {
    constructor(private readonly session: Session) {}

    async create(): Promise<Page> {
        const contexts = this.session.browser.contexts()
        let context

        if (contexts.length === 0) {
            context = await this.session.browser.newContext()
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
