import { NextRequest, NextResponse } from 'next/server'
import { chromium } from 'playwright'
import { readFile } from 'fs/promises'
import path from 'path'
import { Action } from '@/modules/playwright/types'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ browserId: string }> }
) {
    try {
        const { browserId } = await params
        const action: Action = await request.json()

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
