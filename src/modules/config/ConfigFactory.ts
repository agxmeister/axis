import { readFileSync } from 'fs'
import { injectable, inject } from 'inversify'
import { Config } from './types'
import { dependencies } from '@/container/dependencies'

@injectable()
export class ConfigFactory {
    constructor(
        @inject(dependencies.ConfigPath) private readonly configPath: string
    ) {}

    create(): Config {
        return JSON.parse(readFileSync(this.configPath, 'utf-8'))
    }
}
