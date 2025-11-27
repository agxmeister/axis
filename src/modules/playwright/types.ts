import { Browser, Page, BrowserContext } from 'playwright'

export interface BrowserState {
    id: string
    endpoint: string
    timestamp: string
}

export interface BrowserConnection {
    browser: Browser
    context: BrowserContext
    page: Page
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
