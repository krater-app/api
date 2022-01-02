import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { newsFeedContainer } from './news-feed.container';

export const newsFeedModule = ({
  authMiddleware,
  logger,
  isAccountConfirmedMiddleware,
  queryBuilder,
}: ModuleDependencies) => {
  const container = newsFeedContainer();

  container.register({
    authMiddleware: asValue(authMiddleware),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
  });

  return new ModuleBuilder().setName('news-feed').setContainer(container).build();
};
