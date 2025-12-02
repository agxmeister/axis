import { Session } from './types'

declare global {
    var session: Session | undefined
}

export const sessionContext = global
