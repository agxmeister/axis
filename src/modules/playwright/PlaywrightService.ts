import { chromium } from 'playwright'
import { randomUUID } from 'crypto'
import { injectable, inject } from 'inversify'
import { BrowserMetadataRepository } from './BrowserMetadataRepository'
import { Session, SessionContext } from './types'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.BrowserMetadataRepository) private readonly repository: BrowserMetadataRepository,
        @inject(dependencies.SessionContext) private readonly global: SessionContext,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageSession(): Promise<Session> {
        if (this.global.session) {
            return this.global.session
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        const metadata = {
            id: randomUUID(),
            timestamp: new Date().toISOString()
        }

        await this.repository.save(metadata)

        this.global.session = { browser, metadata }

        return this.global.session
    }

    async retireSession(sessionId: string): Promise<void> {
        if (this.global.session) {
            try {
                await this.global.session.browser.close()
            } catch (error) {
            }
            this.global.session = undefined
        }

        await this.repository.delete(sessionId)
    }
}
