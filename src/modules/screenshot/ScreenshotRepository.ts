import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { injectable, inject } from 'inversify'
import { Screenshot } from './types'
import { dependencies } from '@/container/dependencies'

@injectable()
export class ScreenshotRepository {
    constructor(
        @inject(dependencies.DataPath) private readonly baseDirectory: string
    ) {}

    async save(sessionId: string, screenshot: Screenshot, buffer: Buffer<ArrayBufferLike>): Promise<void> {
        const screenshotDirectory = path.join(
            this.baseDirectory,
            sessionId,
            'screenshots',
            screenshot.id
        )

        await mkdir(screenshotDirectory, { recursive: true })

        await writeFile(
            path.join(screenshotDirectory, `${screenshot.id}.png`),
            buffer
        )

        await writeFile(
            path.join(screenshotDirectory, 'state.json'),
            JSON.stringify({ id: screenshot.id }, null, 4)
        )
    }
}
