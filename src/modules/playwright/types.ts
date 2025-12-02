import { Browser } from 'playwright'

export interface Metadata {
    id: string
    timestamp: string
}

export interface Session {
    browser: Browser
    metadata: Metadata
}

export interface SessionContext {
    session: Session | undefined
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
