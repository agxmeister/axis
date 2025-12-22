import { injectable, inject } from 'inversify'
import { dependencies } from '@/container/dependencies'

@injectable()
export class BreadcrumbsService {
    constructor(
        @inject(dependencies.BreadcrumbsUrl) private readonly breadcrumbsUrl: string,
        @inject(dependencies.BreadcrumbsAccessToken) private readonly breadcrumbsAccessToken: string
    ) {}

    async uploadScreenshot(screenshotBuffer: Buffer<ArrayBufferLike>): Promise<string> {
        try {
            const response = await fetch(`${this.breadcrumbsUrl}/api/screenshots`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.breadcrumbsAccessToken}`,
                    'Content-Type': 'application/octet-stream'
                },
                body: Buffer.from(screenshotBuffer),
                signal: AbortSignal.timeout(30000)
            })

            if (!response.ok) {
                throw new Error(
                    `Failed to upload screenshot: ${response.statusText}`
                )
            }

            const result = await response.json()
            return result.id
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Breadcrumbs upload timeout: request took longer than 30 seconds')
                }
                throw new Error(`Breadcrumbs upload failed: ${error.message}`)
            }
            throw new Error('Breadcrumbs upload failed: Unknown error')
        }
    }

    getScreenshotUrl(screenshotId: string): string {
        return `${this.breadcrumbsUrl}/screenshots/${screenshotId}`
    }
}
