import { z as zod } from 'zod'

export const clickActionSchema = zod.object({
    type: zod.literal('click'),
    x: zod.number(),
    y: zod.number()
})

export const openPageActionSchema = zod.object({
    type: zod.literal('open-page'),
    url: zod.string().url()
})

export const actionSchema = zod.discriminatedUnion('type', [
    clickActionSchema,
    openPageActionSchema
])
