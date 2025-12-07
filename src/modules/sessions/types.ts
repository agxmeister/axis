import { Browser } from 'playwright'

export interface Session {
    sessionId: string
    createDate: string
    browser?: Browser
}
