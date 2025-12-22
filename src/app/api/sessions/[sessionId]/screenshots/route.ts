import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory } from '@/modules/playwright'
import { BreadcrumbsService } from '@/modules/breadcrumbs'
import { ScreenshotRepository, Screenshot } from '@/modules/screenshot'
import { getSession } from '@/modules/api'

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
        const breadcrumbsService = container.get<BreadcrumbsService>(dependencies.BreadcrumbsService)
        const screenshotRepository = container.get<ScreenshotRepository>(dependencies.ScreenshotRepository)

        const browser = await playwrightService.engageBrowser(session)
        const pageFactory = new PageFactory(browser)
        const page = await pageFactory.create()

        const screenshotBuffer = await page.screenshot({ type: 'png' })

        const screenshotId = await breadcrumbsService.uploadScreenshot(screenshotBuffer)
        const screenshotUrl = breadcrumbsService.getScreenshotUrl(screenshotId)

        const screenshot: Screenshot = {
            id: screenshotId,
            url: screenshotUrl
        }

        await screenshotRepository.save(sessionId, screenshot, screenshotBuffer)

        return NextResponse.json({
            message: 'Screenshot created successfully',
            payload: {
                id: screenshotId,
                url: screenshotUrl
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
