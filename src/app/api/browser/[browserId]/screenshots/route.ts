import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'
import { PlaywrightBrowserRepository } from '@/modules/playwright/PlaywrightBrowserRepository'
import { PlaywrightBrowserService } from '@/modules/playwright/PlaywrightBrowserService'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const dataDir = path.join(process.cwd(), 'data', 'browsers')
        const repository = new PlaywrightBrowserRepository(dataDir)
        const playwrightService = new PlaywrightBrowserService(repository)

        const { page } = await playwrightService.getBrowser(browserId)

        const screenshotId = randomUUID()
        const screenshotDir = path.join(process.cwd(), 'data', 'browsers', browserId, 'screenshots')
        const screenshotPath = path.join(screenshotDir, `${screenshotId}.png`)

        await mkdir(screenshotDir, { recursive: true })
        await page.screenshot({ path: screenshotPath })

        return NextResponse.json({
            message: 'Screenshot created successfully',
            payload: {
                id: screenshotId,
                path: screenshotPath
            }
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to create screenshot',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
