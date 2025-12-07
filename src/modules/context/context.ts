import { Session } from '@/modules/sessions/types'

declare global {
    var sessions: Session[];
}

if (!global.sessions) {
    global.sessions = []
}

export const context = global
