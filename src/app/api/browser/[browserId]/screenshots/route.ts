import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { readFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const browserStatePath = path.join(process.cwd(), 'data', 'browsers', browserId, 'state.json')
        const stateFile = await readFile(browserStatePath, 'utf-8')
        const browserState = JSON.parse(stateFile)

        if (!browserState) {
            return NextResponse.json(
                { error: `Browser with id ${browserId} not found` },
                { status: 404 }
            )
        }

        const browser = await chromium.connectOverCDP(browserState.endpoint)
        const contexts = browser.contexts()

        if (contexts.length === 0) {
            return NextResponse.json(
                { error: 'No browser context found' },
                { status: 400 }
            )
        }

        const pages = contexts[0].pages()

        if (pages.length === 0) {
            return NextResponse.json(
                { error: 'No page found in browser' },
                { status: 400 }
            )
        }

        const page = pages[0]
        const screenshotId = randomUUID()
        const screenshotDir = path.join(process.cwd(), 'data', 'browsers', browserId, 'screenshots')
        const screenshotPath = path.join(screenshotDir, `${screenshotId}.png`)

        await mkdir(screenshotDir, { recursive: true })
        await page.screenshot({ path: screenshotPath })

        return NextResponse.json({
            message: 'Screenshot created successfully',
            payload: {
                id: screenshotId,
                path: screenshotPath
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
