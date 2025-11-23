import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { readFile } from 'fs/promises'
import path from 'path'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params

        const browserStatePath = path.join(process.cwd(), 'browser-state.json')
        const stateFile = await readFile(browserStatePath, 'utf-8')
        const state = JSON.parse(stateFile)

        const browserState = state[browserId]

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
        const screenshotPath = path.join(process.cwd(), 'screenshot.png')

        await page.screenshot({ path: screenshotPath })

        return NextResponse.json({
            message: 'Screenshot created successfully',
            payload: {
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
