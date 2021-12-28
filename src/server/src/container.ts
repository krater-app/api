import { Server } from '@api/server';
import {
  JwtTokenProviderService,
  Logger,
  ModuleDependencies,
  registerAsArray,
  logger,
} from '@krater/building-blocks';
import { createQueryBuilder, KnexUnitOfWork, QueryBuilder } from '@krater/database';
import { asClass, asValue, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { platformAccessModule } from '@krater/platform-access';

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
  });

  const queryBuilder = container.resolve<QueryBuilder>('queryBuilder');
  const resolvedLogger = container.resolve<Logger>('logger');

  const moduleDependencies: ModuleDependencies = {
    queryBuilder,
    logger: resolvedLogger,
  };

  container.register({
    modules: registerAsArray(
      [platformAccessModule(moduleDependencies)].map((module) => asValue(module)),
    ),
  });

  const server = container.resolve<Server>('server');

  const app = server.getApp();

  container.register({
    app: asValue(app),
  });

  return container;
};
