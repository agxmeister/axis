import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory } from '@/modules/playwright'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url } = body

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const browserContext = await playwrightService.engageBrowser()
        const pageFactory = new PageFactory(browserContext)
        const page = await pageFactory.create()
        await page.goto(url, { waitUntil: 'networkidle' })

        const pageTitle = await page.title()
        const pageUrl = page.url()

        return NextResponse.json({
            message: 'Browser window created successfully',
            payload: {
                id: browserContext.metadata.id,
                title: pageTitle,
                url: pageUrl,
                endpoint: browserContext.metadata.endpoint
            }
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to create browser window',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
