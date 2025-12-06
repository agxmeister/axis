import { inject, injectable } from 'inversify'
import { randomUUID } from 'crypto'
import { SessionRepository } from './SessionRepository'
import { dependencies } from '@/container/dependencies'
import { Session } from './types'

@injectable()
export class SessionFactory {
    constructor(
        @inject(dependencies.SessionRepository) private sessionRepository: SessionRepository,
    ) {}

    async create(): Promise<Session> {
        const sessionId = randomUUID()
        const session: Session = {
            sessionId,
            createDate: new Date().toISOString(),
        }

        await this.sessionRepository.save(session)

        return session
    }
}
