import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url, timeout = 30000 } = body

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        const browser = await chromium.launch({
            headless: false,
            timeout,
            args: ['--remote-debugging-port=9222']
        })

        const endpoint = 'http://localhost:9222'

        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto(url, { waitUntil: 'networkidle' })

        const pageTitle = await page.title()
        const pageUrl = page.url()

        const browserId = randomUUID()
        const browserDir = path.join(process.cwd(), 'data', 'browsers', browserId)
        const browserStatePath = path.join(browserDir, 'state.json')

        await mkdir(browserDir, { recursive: true })

        await writeFile(
            browserStatePath,
            JSON.stringify({
                id: browserId,
                endpoint,
                timestamp: new Date().toISOString()
            }, null, 4)
        )

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
