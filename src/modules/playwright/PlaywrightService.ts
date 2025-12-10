import { chromium, Browser } from 'playwright'
import { injectable, inject } from 'inversify'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'
import type { Context } from '@/modules/context/types'
import type { Session } from '@/modules/session'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.Context) private readonly context: Context,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageBrowser(session: Session): Promise<Browser> {
        if (session.runtime.browser) {
            return session.runtime.browser
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        session.runtime.browser = browser

        return browser
    }

    async retireBrowser(session: Session): Promise<void> {
        if (session.runtime.browser) {
            try {
                await session.runtime.browser.close()
            } catch (error) {
            }
            session.runtime.browser = null
        }
    }
}
