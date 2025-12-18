import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService, PageFactory } from '@/modules/playwright'
import { SessionFactory } from '@/modules/session'

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

        const sessionFactory = container.get<SessionFactory>(dependencies.SessionFactory)
        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)

        const session = await sessionFactory.create()
        const browser = await playwrightService.engageBrowser(session)
        const pageFactory = new PageFactory(browser)
        const page = await pageFactory.create()
        await page.goto(url, { waitUntil: 'networkidle' })

        const { runtime, ...sessionPersistentData } = session

        return NextResponse.json({
            message: 'Session created successfully',
            payload: {
                ...sessionPersistentData,
            }
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to create session',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
