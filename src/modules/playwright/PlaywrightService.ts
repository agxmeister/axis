import { chromium, Browser } from 'playwright'
import { injectable, inject } from 'inversify'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'
import type { Context } from '@/modules/context/types'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.Context) private readonly context: Context,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageBrowser(sessionId: string): Promise<Browser> {
        const existingSession = this.context.sessions.find(s => s.sessionId === sessionId)

        if (existingSession?.runtime.browser) {
            return existingSession.runtime.browser
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        if (existingSession) {
            existingSession.runtime.browser = browser
        }

        return browser
    }

    async retireBrowser(sessionId: string): Promise<void> {
        const session = this.context.sessions.find(s => s.sessionId === sessionId)

        if (session?.runtime.browser) {
            try {
                await session.runtime.browser.close()
            } catch (error) {
            }
            session.runtime.browser = null
        }
    }
}
