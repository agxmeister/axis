import { Browser } from 'playwright'

export interface Metadata {
    sessionId: string
    createDate: string
}

export interface Session {
    browser: Browser
    metadata: Metadata
}

export interface Context {
    session: Session | undefined
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
