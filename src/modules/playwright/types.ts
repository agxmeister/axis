import { Browser } from 'playwright'

export interface BrowserMetadata {
    id: string
    endpoint: string
    timestamp: string
}

export interface BrowserContext {
    browser: Browser
    metadata: BrowserMetadata
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
