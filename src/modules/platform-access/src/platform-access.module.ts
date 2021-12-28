import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { platformAccessContainer } from './platform-access.container';

export const platformAccessModule = ({
  logger,
  queryBuilder,
  authMiddleware,
  isAccountConfirmedMiddleware,
}: ModuleDependencies) => {
  const container = platformAccessContainer();

  container.register({
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
    authMiddleware: asValue(authMiddleware),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
  });

  return new ModuleBuilder().setName('platform-access').setContainer(container).build();
};
