import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory, actionSchema } from '@/modules/playwright'
import { SessionService } from '@/modules/session'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const body = await request.json()

        const validationResult = actionSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Invalid action data',
                    details: validationResult.error.issues,
                },
                { status: 400 }
            )
        }

        const action = validationResult.data

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
