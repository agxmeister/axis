import { NextResponse } from 'next/server'
import { z as zod } from 'zod'
import { container, dependencies } from '@/container'
import { Session, SessionService } from '@/modules/session'
import { Result } from './types'

export function getData<T>(
    schema: zod.ZodSchema<T>,
    data: unknown
): Result<T, NextResponse> {
    const parseResult = schema.safeParse(data)

    if (!parseResult.success) {
        return {
            ok: false,
            error: NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: parseResult.error.issues,
                },
                { status: 400 }
            ),
        }
    }

    return {
        ok: true,
        value: parseResult.data,
    }
}

export function getSession(sessionId: string): Result<Session, NextResponse> {
    const sessionService = container.get<SessionService>(dependencies.SessionService)
    const session = sessionService.findById(sessionId)

    if (!session) {
        return {
            ok: false,
            error: NextResponse.json(
                { error: `Session not found: ${sessionId}` },
                { status: 404 }
            ),
        }
    }

    return {
        ok: true,
        value: session,
    }
}
