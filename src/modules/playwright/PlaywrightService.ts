import { chromium, Browser } from 'playwright'
import { injectable, inject } from 'inversify'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'
import type { BrowserSession, Context } from './types'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.Context) private readonly context: Context,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageBrowser(sessionId: string): Promise<Browser> {
        const existingSession = this.context.sessions.find(s => s.sessionId === sessionId)

        if (existingSession) {
            return existingSession.browser
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        const browserSession: BrowserSession = {
            sessionId,
            browser
        }

        this.context.sessions.push(browserSession)

        return browser
    }

    async retireBrowser(sessionId: string): Promise<void> {
        const sessionIndex = this.context.sessions.findIndex(s => s.sessionId === sessionId)

        if (sessionIndex !== -1) {
            const session = this.context.sessions[sessionIndex]
            try {
                await session.browser.close()
            } catch (error) {
            }
            this.context.sessions.splice(sessionIndex, 1)
        }
    }
}
