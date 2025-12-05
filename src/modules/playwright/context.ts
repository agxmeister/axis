import { Session } from './types'

declare global {
    let session: Session | undefined;
}

export const context = global
