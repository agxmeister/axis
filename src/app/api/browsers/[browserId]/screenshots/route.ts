import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'
import { BrowserStateRepository, PlaywrightService, PageFactory } from '@/modules/playwright'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const dataDir = path.join(process.cwd(), 'data', 'browsers')
        const repository = new BrowserStateRepository(dataDir)
        const playwrightService = new PlaywrightService(repository)
        const pageFactory = new PageFactory()

        const browser = await playwrightService.getBrowser(browserId)
        const page = await pageFactory.create(browser)

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
