import type { Runtime } from '@/modules/session'
import type {Context} from "./types";

declare global {
    var runtimes: Map<string, Runtime>;
}

if (!global.runtimes) {
    global.runtimes = new Map()
}

export const context: Context = global
