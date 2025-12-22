import 'reflect-metadata'
import { Container } from 'inversify'
import path from 'path'
import { dependencies } from './dependencies'
import { SessionRepository, SessionFactory, SessionService } from '@/modules/session'
import { context } from '@/modules/context/context'
import { PlaywrightService } from '@/modules/playwright/PlaywrightService'
import { ConfigFactory } from '@/modules/config/ConfigFactory'
import { BreadcrumbsService } from '@/modules/breadcrumbs'
import { ScreenshotRepository } from '@/modules/screenshot'

const container = new Container()

container.bind<string>(dependencies.DataPath).toConstantValue(
    path.join(process.cwd(), 'data', 'sessions')
)
container.bind<string>(dependencies.ConfigPath).toConstantValue(
    path.join(process.cwd(), 'config.json')
)
container.bind(dependencies.Context).toConstantValue(context)

container.bind<SessionRepository>(dependencies.SessionRepository).to(SessionRepository)
container.bind<SessionFactory>(dependencies.SessionFactory).to(SessionFactory)
container.bind<SessionService>(dependencies.SessionService).to(SessionService)
container.bind<ConfigFactory>(dependencies.ConfigFactory).to(ConfigFactory)
container.bind<PlaywrightService>(dependencies.PlaywrightService).to(PlaywrightService).inSingletonScope()

container.bind<string>(dependencies.BreadcrumbsUrl).toConstantValue(
    process.env.BREADCRUMBS_URL || 'https://breadcrumbs.agxmeister.services'
)
container.bind<string>(dependencies.BreadcrumbsAccessToken).toConstantValue(
    process.env.BREADCRUMBS_ACCESS_TOKEN || ''
)
container.bind<BreadcrumbsService>(dependencies.BreadcrumbsService).to(BreadcrumbsService)
container.bind<ScreenshotRepository>(dependencies.ScreenshotRepository).to(ScreenshotRepository)

export { container }
