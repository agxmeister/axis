import { Session } from '@/modules/sessions/types'
import type {Context} from "./types";

declare global {
    var sessions: Session[];
}

if (!global.sessions) {
    global.sessions = []
}

export const context: Context = global
