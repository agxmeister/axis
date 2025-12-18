import { Browser } from 'playwright'

export interface Runtime {
    browser: Browser | null
}

export interface Session {
    id: string
    createDate: string
    runtime: Runtime
}
