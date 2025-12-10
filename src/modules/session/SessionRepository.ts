import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import { injectable, inject } from 'inversify'
import { Session } from './types'
import { dependencies } from '@/container/dependencies'

@injectable()
export class SessionRepository {
    constructor(
        @inject(dependencies.DataPath) private readonly baseDirectory: string
    ) {}

    async save(session: Session): Promise<void> {
        const sessionDirectory = path.join(this.baseDirectory, session.sessionId)
        const statePath = path.join(sessionDirectory, 'state.json')

        await mkdir(sessionDirectory, { recursive: true })
        await writeFile(statePath, JSON.stringify(session, null, 4))
    }

    async findById(sessionId: string): Promise<Session | null> {
        try {
            const statePath = path.join(this.baseDirectory, sessionId, 'state.json')
            const stateFile = await readFile(statePath, 'utf-8')
            return {
                ...JSON.parse(stateFile),
                runtime: {
                    browser: null
                }
            }
        } catch (error) {
            return null
        }
    }

    async delete(sessionId: string): Promise<void> {
        const sessionDirectory = path.join(this.baseDirectory, sessionId)
        await rm(sessionDirectory, { recursive: true, force: true })
    }
}
