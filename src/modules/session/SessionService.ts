import { inject, injectable } from 'inversify'
import { Session } from './types'
import { dependencies } from '@/container/dependencies'
import type { Context } from '@/modules/context/types'

@injectable()
export class SessionService {
    constructor(
        @inject(dependencies.Context) private readonly context: Context,
    ) {}

    findById(sessionId: string): Session | null {
        return this.context.sessions.find(s => s.sessionId === sessionId) ?? null
    }
}
