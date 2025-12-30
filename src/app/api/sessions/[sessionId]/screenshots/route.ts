import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory } from '@/modules/playwright'
import { ScreenshotRepository, Screenshot } from '@/modules/screenshot'
import { getSession } from '@/modules/api'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params

        const sessionResult = await getSession(sessionId)
        if (!sessionResult.ok) {
            return sessionResult.error
        }
        const session = sessionResult.value

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)
        const screenshotRepository = container.get<ScreenshotRepository>(dependencies.ScreenshotRepository)

        const browser = await playwrightService.engageBrowser(session)
        const pageFactory = new PageFactory(browser)
        const page = await pageFactory.create()

        const screenshotBuffer = await page.screenshot({ type: 'png' })

        const screenshotId = uuidv4()

        const screenshot: Screenshot = {
            id: screenshotId
        }

        await screenshotRepository.save(sessionId, screenshot, screenshotBuffer)

        return new NextResponse(Uint8Array.from(screenshotBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `inline; filename="${screenshotId}.png"`
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
