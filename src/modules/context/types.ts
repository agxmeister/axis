import type { Runtime } from '@/modules/session'

export interface Context {
    runtimes: Map<string, Runtime>
}
