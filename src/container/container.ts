import 'reflect-metadata'
import { Container } from 'inversify'
import path from 'path'
import { dependencies } from './dependencies'
import { BrowserMetadataRepository } from '@/modules/playwright/BrowserMetadataRepository'
import { sessionContext } from '@/modules/playwright/sessionContext'
import { PlaywrightService } from '@/modules/playwright/PlaywrightService'
import { ConfigFactory } from '@/modules/config/ConfigFactory'

const container = new Container()

container.bind<string>(dependencies.DataPath).toConstantValue(
    path.join(process.cwd(), 'data', 'sessions')
)
container.bind<string>(dependencies.ConfigPath).toConstantValue(
    path.join(process.cwd(), 'config.json')
)
container.bind(dependencies.SessionContext).toConstantValue(sessionContext)

container.bind<BrowserMetadataRepository>(dependencies.BrowserMetadataRepository).to(BrowserMetadataRepository)
container.bind<ConfigFactory>(dependencies.ConfigFactory).to(ConfigFactory)
container.bind<PlaywrightService>(dependencies.PlaywrightService).to(PlaywrightService).inSingletonScope()

export { container }
