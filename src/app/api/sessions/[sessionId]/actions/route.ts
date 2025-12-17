import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory, actionSchema } from '@/modules/playwright'
import { getData, getSession } from '@/modules/api'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const body = await request.json()

        const dataResult = getData(actionSchema, body)
        if (!dataResult.ok) {
            return dataResult.error
        }
        const action = dataResult.value

        const sessionResult = getSession(sessionId)
        if (!sessionResult.ok) {
            return sessionResult.error
        }
        const session = sessionResult.value

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const browser = await playwrightService.engageBrowser(session)
        const pageFactory = new PageFactory(browser)
        const page = await pageFactory.create()

        switch (action.type) {
            case 'click':
                await page.mouse.click(action.x, action.y)
                return NextResponse.json({
                    message: 'Click action performed successfully',
                    payload: {
                        type: 'click',
                        x: action.x,
                        y: action.y
                    }
                })

            case 'open-page':
                await page.goto(action.url)
                return NextResponse.json({
                    message: 'Page opened successfully',
                    payload: {
                        type: 'open-page',
                        url: action.url
                    }
                })
        }
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to perform action',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
