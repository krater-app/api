import { ModuleBuilder, ModuleDependencies, ModuleNames } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { followingContainer } from './following.container';

export const followingModule = ({
  authMiddleware,
  isAccountConfirmedMiddleware,
  logger,
  queryBuilder,
}: ModuleDependencies) => {
  const container = followingContainer();

  container.register({
    authMiddleware: asValue(authMiddleware),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
  });

  return new ModuleBuilder().setName(ModuleNames.Following).setContainer(container).build();
};
