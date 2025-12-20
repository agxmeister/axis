import { NextRequest, NextResponse } from 'next/server'
import { container, dependencies } from '@/container'
import { PlaywrightService } from '@/modules/playwright'
import { SessionRepository } from '@/modules/session'
import { getSession } from '@/modules/api'
import type { Context } from '@/modules/context/types'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params

        const sessionResult = await getSession(sessionId)
        if (!sessionResult.ok) {
            return sessionResult.error
        }
        const session = sessionResult.value

        const playwrightService = container.get<PlaywrightService>(dependencies.PlaywrightService)
        const sessionRepository = container.get<SessionRepository>(dependencies.SessionRepository)
        const context = container.get<Context>(dependencies.Context)

        await playwrightService.retireBrowser(session)
        await sessionRepository.delete(sessionId)

        context.runtimes.delete(sessionId)

        return NextResponse.json({
            message: 'Session deleted successfully',
            payload: {
                id: sessionId,
            }
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to delete session',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
