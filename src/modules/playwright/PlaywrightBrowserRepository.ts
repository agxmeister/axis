import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

export interface BrowserState {
    id: string
    endpoint: string
    timestamp: string
}

export class PlaywrightBrowserRepository {
    constructor(private readonly dataDir: string) {}

    async save(browserState: BrowserState): Promise<void> {
        const browserDir = path.join(this.dataDir, browserState.id)
        const statePath = path.join(browserDir, 'state.json')

        await mkdir(browserDir, { recursive: true })
        await writeFile(statePath, JSON.stringify(browserState, null, 4))
    }

    async findById(browserId: string): Promise<BrowserState | null> {
        try {
            const statePath = path.join(this.dataDir, browserId, 'state.json')
            const stateFile = await readFile(statePath, 'utf-8')
            return JSON.parse(stateFile)
        } catch (error) {
            return null
        }
    }
}
