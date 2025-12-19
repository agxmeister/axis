import { inject, injectable } from 'inversify'
import { Session } from './types'
import { dependencies } from '@/container/dependencies'
import { SessionRepository } from './SessionRepository'
import type { Context } from '@/modules/context/types'

@injectable()
export class SessionService {
    constructor(
        @inject(dependencies.SessionRepository) private readonly sessionRepository: SessionRepository,
        @inject(dependencies.Context) private readonly context: Context,
    ) {}

    async findById(sessionId: string): Promise<Session | null> {
        const persistentSession = await this.sessionRepository.findById(sessionId)
        if (!persistentSession) {
            return null
        }

        const runtimeSession = this.context.sessions.find(s => s.id === sessionId)
        if (runtimeSession) {
            return {
                ...persistentSession,
                runtime: runtimeSession.runtime
            }
        }

        return persistentSession
    }
}
