import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'
import { BrowserStateRepository } from '@/modules/playwright/BrowserStateRepository'
import { PlaywrightService } from '@/modules/playwright/PlaywrightService'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const dataDir = path.join(process.cwd(), 'data', 'browsers')
        const repository = new BrowserStateRepository(dataDir)
        const playwrightService = new PlaywrightService(repository)

        const browser = await playwrightService.getBrowser(browserId)
        const contexts = browser.contexts()

        if (contexts.length === 0) {
            throw new Error('No browser context found')
        }

        const context = contexts[0]
        const pages = context.pages()

        if (pages.length === 0) {
            throw new Error('No page found in browser')
        }

        const page = pages[0]

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
