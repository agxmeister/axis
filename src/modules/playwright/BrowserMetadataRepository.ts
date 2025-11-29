import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import { BrowserMetadata } from './types'

export class BrowserMetadataRepository {
    constructor(private readonly dataDir: string) {}

    async save(metadata: BrowserMetadata): Promise<void> {
        const browserDir = path.join(this.dataDir, metadata.id)
        const statePath = path.join(browserDir, 'state.json')

        await mkdir(browserDir, { recursive: true })
        await writeFile(statePath, JSON.stringify(metadata, null, 4))
    }

    async findById(browserId: string): Promise<BrowserMetadata | null> {
        try {
            const statePath = path.join(this.dataDir, browserId, 'state.json')
            const stateFile = await readFile(statePath, 'utf-8')
            return JSON.parse(stateFile)
        } catch (error) {
            return null
        }
    }

    async delete(browserId: string): Promise<void> {
        const browserDir = path.join(this.dataDir, browserId)
        await rm(browserDir, { recursive: true, force: true })
    }
}
