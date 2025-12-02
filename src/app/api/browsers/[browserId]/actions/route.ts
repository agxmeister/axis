import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory, Action } from '@/modules/playwright'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params
        const action: Action = await request.json()

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const session = await playwrightService.engageSession()
        const pageFactory = new PageFactory(session)
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
