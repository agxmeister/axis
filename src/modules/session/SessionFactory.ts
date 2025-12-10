import { inject, injectable } from 'inversify'
import { randomUUID } from 'crypto'
import { SessionRepository } from './SessionRepository'
import { dependencies } from '@/container/dependencies'
import { Session } from './types'
import type { Context } from '@/modules/context/types'

@injectable()
export class SessionFactory {
    constructor(
        @inject(dependencies.SessionRepository) private sessionRepository: SessionRepository,
        @inject(dependencies.Context) private readonly context: Context,
    ) {}

    async create(): Promise<Session> {
        const sessionId = randomUUID()
        const session: Session = {
            sessionId,
            createDate: new Date().toISOString(),
            runtime: {
                browser: null
            }
        }

        await this.sessionRepository.save(session)
        this.context.sessions.push(session)

        return session
    }
}
