import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { tagsContainer } from './tags.container';

export const tagsModule = ({
  authMiddleware,
  isAccountConfirmedMiddleware,
  logger,
  queryBuilder,
}: ModuleDependencies) => {
  const container = tagsContainer();

  container.register({
    authMiddleware: asValue(authMiddleware),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
  });

  return new ModuleBuilder().setName('tags').setContainer(container).build();
};
