import 'reflect-metadata'
import { Container } from 'inversify'
import path from 'path'
import { dependencies } from './dependencies'
import { MetadataRepository } from '@/modules/playwright/MetadataRepository'
import { context } from '@/modules/playwright/context'
import { PlaywrightService } from '@/modules/playwright/PlaywrightService'
import { ConfigFactory } from '@/modules/config/ConfigFactory'

const container = new Container()

container.bind<string>(dependencies.DataPath).toConstantValue(
    path.join(process.cwd(), 'data', 'sessions')
)
container.bind<string>(dependencies.ConfigPath).toConstantValue(
    path.join(process.cwd(), 'config.json')
)
container.bind(dependencies.Context).toConstantValue(context)

container.bind<MetadataRepository>(dependencies.BrowserMetadataRepository).to(MetadataRepository)
container.bind<ConfigFactory>(dependencies.ConfigFactory).to(ConfigFactory)
container.bind<PlaywrightService>(dependencies.PlaywrightService).to(PlaywrightService).inSingletonScope()

export { container }
