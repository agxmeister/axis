import { Session } from './types'

declare global {
    let session: Session | undefined;
}

export const sessionContext = global
