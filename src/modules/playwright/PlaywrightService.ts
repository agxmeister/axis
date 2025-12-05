import { chromium } from 'playwright'
import { randomUUID } from 'crypto'
import { injectable, inject } from 'inversify'
import { MetadataRepository } from './MetadataRepository'
import { ConfigFactory } from '@/modules/config'
import { dependencies } from '@/container/dependencies'
import type { Session, Context } from './types'

@injectable()
export class PlaywrightService {
    constructor(
        @inject(dependencies.Context) private readonly context: Context,
        @inject(dependencies.BrowserMetadataRepository) private readonly repository: MetadataRepository,
        @inject(dependencies.ConfigFactory) private readonly configFactory: ConfigFactory
    ) {}

    async engageSession(): Promise<Session> {
        if (this.context.session) {
            return this.context.session
        }

        const browser = await chromium.launch({
            headless: false,
            timeout: 30000
        })

        const metadata = {
            sessionId: randomUUID(),
            createDate: new Date().toISOString()
        }

        await this.repository.save(metadata)

        this.context.session = { browser, metadata }

        return this.context.session
    }

    async retireSession(sessionId: string): Promise<void> {
        if (this.context.session) {
            try {
                await this.context.session.browser.close()
            } catch (error) {
            }
            this.context.session = undefined
        }

        await this.repository.delete(sessionId)
    }
}
