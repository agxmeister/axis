import { readFileSync } from 'fs'
import { Config } from './types'

export class ConfigFactory {
    constructor(private readonly configPath: string) {}

    create(): Config {
        return JSON.parse(readFileSync(this.configPath, 'utf-8'))
    }
}
