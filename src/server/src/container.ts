import { Server } from '@api/server';
import {
  JwtTokenProviderService,
  Logger,
  ModuleDependencies,
  registerAsArray,
  logger,
} from '@krater/building-blocks';
import {
  createQueryBuilder,
  KnexOutboxRepository,
  KnexUnitOfWork,
  QueryBuilder,
} from '@krater/database';
import {
  asClass,
  asFunction,
  asValue,
  AwilixContainer,
  createContainer,
  InjectionMode,
} from 'awilix';
import { platformAccessModule } from '@krater/platform-access';
import { authMiddleware } from '@api/middlewares/auth/auth.middleware';
import { isAccountConfirmedMiddleware } from '@api/middlewares/is-account-confirmed/is-account-confirmed.middleware';
import { RequestHandler } from 'express';
import { ProcessOutboxJob } from '@app/jobs/process-outbox.job';
import { notificationsModule } from '@krater/notifications';

export const createAppContainer = async (): Promise<AwilixContainer> => {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    server: asClass(Server).singleton(),
    queryBuilder: asValue(
      createQueryBuilder('pg', {
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTRGRES_HOSTNAME,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DB,
      }),
    ),
    tokenProviderService: asClass(JwtTokenProviderService).singleton(),
    unitOfWork: asClass(KnexUnitOfWork).singleton(),
    logger: asValue(logger),
    authMiddleware: asFunction(authMiddleware).scoped(),
    isAccountConfirmedMiddleware: asFunction(isAccountConfirmedMiddleware).scoped(),
    outboxRepository: asClass(KnexOutboxRepository).singleton(),
  });

  const queryBuilder = container.resolve<QueryBuilder>('queryBuilder');
  const resolvedLogger = container.resolve<Logger>('logger');
  const resolvedAuthMiddleware = container.resolve<RequestHandler>('authMiddleware');
  const resolvedIsAccountConfirmedMiddleware = container.resolve<RequestHandler>(
    'isAccountConfirmedMiddleware',
  );

  const moduleDependencies: ModuleDependencies = {
    queryBuilder,
    authMiddleware: resolvedAuthMiddleware,
    isAccountConfirmedMiddleware: resolvedIsAccountConfirmedMiddleware,
    logger: resolvedLogger,
  };

  container.register({
    modules: registerAsArray(
      [platformAccessModule(moduleDependencies), notificationsModule(moduleDependencies)].map(
        (module) => asValue(module),
      ),
    ),
    jobs: registerAsArray([asClass(ProcessOutboxJob).singleton()]),
  });

  const server = container.resolve<Server>('server');

  const app = server.getApp();

  container.register({
    app: asValue(app),
  });

  return container;
};
