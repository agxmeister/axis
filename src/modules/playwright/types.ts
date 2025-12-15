import { z as zod } from 'zod'
import { clickActionSchema, openPageActionSchema, actionSchema } from './schemas'

export type ClickAction = zod.infer<typeof clickActionSchema>
export type OpenPageAction = zod.infer<typeof openPageActionSchema>
export type Action = zod.infer<typeof actionSchema>
