export interface BrowserState {
    id: string
    endpoint: string
    timestamp: string
}

export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export type Action = ClickAction
