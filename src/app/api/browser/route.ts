import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import path from 'path'
import { BrowserStateRepository } from '@/modules/playwright/BrowserStateRepository'
import { PlaywrightBrowserService } from '@/modules/playwright/PlaywrightBrowserService'

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

        const dataDir = path.join(process.cwd(), 'data', 'browsers')
        const repository = new BrowserStateRepository(dataDir)
        const playwrightService = new PlaywrightBrowserService(repository)

        const { page } = await playwrightService.engageBrowser()
        await page.goto(url, { waitUntil: 'networkidle' })

        const pageTitle = await page.title()
        const pageUrl = page.url()
        const endpoint = 'http://localhost:9222'

        const browserId = randomUUID()
        await repository.save({
            id: browserId,
            endpoint,
            timestamp: new Date().toISOString()
        })

        return NextResponse.json({
            message: 'Browser window created successfully',
            payload: {
                id: browserId,
                title: pageTitle,
                url: pageUrl,
                endpoint
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
