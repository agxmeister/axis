import { inject, injectable } from 'inversify'
import { v4 as uuidv4 } from 'uuid'
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
        const sessionId = uuidv4()
        const session: Session = {
            id: sessionId,
            createDate: new Date().toISOString(),
            runtime: {
                browser: null
            }
        }

        await this.sessionRepository.save(session)
        this.context.runtimes.set(sessionId, session.runtime)

        return session
    }
}
