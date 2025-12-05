import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import { injectable, inject } from 'inversify'
import { Metadata } from './types'
import { dependencies } from '@/container/dependencies'

@injectable()
export class MetadataRepository {
    constructor(
        @inject(dependencies.DataPath) private readonly baseDirectory: string
    ) {}

    async save(metadata: Metadata): Promise<void> {
        const metadataDirectory = path.join(this.baseDirectory, metadata.sessionId)
        const statePath = path.join(metadataDirectory, 'state.json')

        await mkdir(metadataDirectory, { recursive: true })
        await writeFile(statePath, JSON.stringify(metadata, null, 4))
    }

    async findById(sessionId: string): Promise<Metadata | null> {
        try {
            const statePath = path.join(this.baseDirectory, sessionId, 'state.json')
            const stateFile = await readFile(statePath, 'utf-8')
            return JSON.parse(stateFile)
        } catch (error) {
            return null
        }
    }

    async delete(sessionId: string): Promise<void> {
        const metadataDirectory = path.join(this.baseDirectory, sessionId)
        await rm(metadataDirectory, { recursive: true, force: true })
    }
}
