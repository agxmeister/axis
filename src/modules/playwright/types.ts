export interface ClickAction {
    type: 'click'
    x: number
    y: number
}

export interface OpenPageAction {
    type: 'open-page'
    url: string
}

export type Action = ClickAction | OpenPageAction
