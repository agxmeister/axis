import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory } from '@/modules/playwright'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const session = await playwrightService.engageSession()
        const pageFactory = new PageFactory(session)
        const page = await pageFactory.create()

        const screenshotId = randomUUID()
        const screenshotDir = path.join(process.cwd(), 'data', 'sessions', browserId, 'screenshots')
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
