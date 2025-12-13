import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory, Action } from '@/modules/playwright'
import { SessionService } from '@/modules/session'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const action: Action = await request.json()

        const sessionService = container.get<SessionService>(dependencies.SessionService)
        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const session = sessionService.findById(sessionId)
        if (!session) {
            return NextResponse.json(
                { error: `Session not found: ${sessionId}` },
                { status: 404 }
            )
        }

        const browser = await playwrightService.engageBrowser(session)
        const pageFactory = new PageFactory(browser)
        const page = await pageFactory.create()

        switch (action.type) {
            case 'click':
                if (typeof action.x !== 'number' || typeof action.y !== 'number') {
                    return NextResponse.json(
                        { error: 'Click action requires x and y coordinates' },
                        { status: 400 }
                    )
                }
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
                if (typeof action.url !== 'string' || !action.url) {
                    return NextResponse.json(
                        { error: 'Open page action requires a valid URL' },
                        { status: 400 }
                    )
                }
                await page.goto(action.url)
                return NextResponse.json({
                    message: 'Page opened successfully',
                    payload: {
                        type: 'open-page',
                        url: action.url
                    }
                })

            default:
                return NextResponse.json(
                    { error: `Unknown action type: ${(action as Action).type}` },
                    { status: 400 }
                )
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
