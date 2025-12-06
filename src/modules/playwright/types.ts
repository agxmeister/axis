import { Browser } from 'playwright'

export interface BrowserSession {
    sessionId: string
    browser: Browser
}

export interface Context {
    sessions: BrowserSession[]
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
