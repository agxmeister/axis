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

        if (existingSession?.browser) {
            return existingSession.browser
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        if (existingSession) {
            existingSession.browser = browser
        }

        return browser
    }

    async retireBrowser(sessionId: string): Promise<void> {
        const session = this.context.sessions.find(s => s.sessionId === sessionId)

        if (session?.browser) {
            try {
                await session.browser.close()
            } catch (error) {
            }
            session.browser = undefined
        }
    }
}
