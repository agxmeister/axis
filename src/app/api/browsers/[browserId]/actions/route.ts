import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { BrowserMetadataRepository, PlaywrightService, PageFactory, Action } from '@/modules/playwright'
import { ConfigFactory } from '@/modules/config'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params
        const action: Action = await request.json()

        const dataDir = path.join(process.cwd(), 'data', 'browsers')
        const configPath = path.join(process.cwd(), 'config.json')
        const repository = new BrowserMetadataRepository(dataDir)
        const configFactory = new ConfigFactory(configPath)
        const playwrightService = new PlaywrightService(repository, configFactory)

        const browserContext = await playwrightService.getBrowser(browserId)
        const pageFactory = new PageFactory(browserContext)
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
