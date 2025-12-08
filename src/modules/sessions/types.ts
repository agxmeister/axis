import { Browser } from 'playwright'

export interface Runtime {
    browser: Browser | null
}

export interface Session {
    sessionId: string
    createDate: string
    runtime: Runtime
}
