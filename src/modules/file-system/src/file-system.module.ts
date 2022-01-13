import { ModuleBuilder, ModuleDependencies } from '@krater/building-blocks';
import { asValue } from 'awilix';
import { fileSystemContainer } from './file-system.container';

export const fileSystemModule = ({
  authMiddleware,
  isAccountConfirmedMiddleware,
  logger,
  queryBuilder,
  storageService,
}: ModuleDependencies) => {
  const container = fileSystemContainer();

  container.register({
    authMiddleware: asValue(authMiddleware),
    isAccountConfirmedMiddleware: asValue(isAccountConfirmedMiddleware),
    logger: asValue(logger),
    queryBuilder: asValue(queryBuilder),
    storageService: asValue(storageService),
  });

  return new ModuleBuilder().setName('file-system').setContainer(container).build();
};
