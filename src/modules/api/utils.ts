import { NextResponse } from 'next/server'
import { z as zod } from 'zod'
import { Result } from './types'

export function validateRequest<T>(
    schema: zod.ZodSchema<T>,
    data: unknown
): Result<T, NextResponse> {
    const validationResult = schema.safeParse(data)

    if (!validationResult.success) {
        return {
            ok: false,
            error: NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: validationResult.error.issues,
                },
                { status: 400 }
            ),
        }
    }

    return {
        ok: true,
        value: validationResult.data,
    }
}
