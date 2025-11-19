import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'

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
            timeout
        })

        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto(url, { waitUntil: 'networkidle' })

        const pageTitle = await page.title()
        const pageUrl = page.url()

        return NextResponse.json({
            message: 'Browser window created successfully',
            payload: {
                title: pageTitle,
                url: pageUrl
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
