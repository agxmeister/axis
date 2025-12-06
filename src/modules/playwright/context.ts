import { BrowserSession } from './types'

declare global {
    var sessions: BrowserSession[];
}

if (!global.sessions) {
    global.sessions = []
}

export const context = global
